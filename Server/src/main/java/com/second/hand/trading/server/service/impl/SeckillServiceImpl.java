package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.dao.IdleItemDao;
import com.second.hand.trading.server.dao.OrderDao;
import com.second.hand.trading.server.dao.SeckillActivityDao;
import com.second.hand.trading.server.dao.SeckillOrderDao;
import com.second.hand.trading.server.model.IdleItemModel;
import com.second.hand.trading.server.model.OrderModel;
import com.second.hand.trading.server.model.SeckillActivityModel;
import com.second.hand.trading.server.model.SeckillOrderModel;
import com.second.hand.trading.server.service.RedisCacheService;
import com.second.hand.trading.server.service.SeckillService;
import com.second.hand.trading.server.utils.IdFactoryUtil;
import com.second.hand.trading.server.utils.OrderTask;
import com.second.hand.trading.server.utils.OrderTaskHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class SeckillServiceImpl implements SeckillService {

    @Resource
    private SeckillActivityDao seckillActivityDao;

    @Resource
    private SeckillOrderDao seckillOrderDao;

    @Resource
    private IdleItemDao idleItemDao;

    @Resource
    private OrderDao orderDao;

    @Autowired
    private RedisCacheService redisCacheService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SeckillActivityModel createActivity(Long sellerId, SeckillActivityModel activity) {
        activity.setSellerId(sellerId);
        if (activity.getStatus() == null) {
            activity.setStatus((byte) 1);
        }
        if (activity.getPerLimit() == null || activity.getPerLimit() <= 0) {
            activity.setPerLimit(1);
        }
        activity.setCreateTime(new Date());

        seckillActivityDao.insert(activity);
        
        // Initialize stock in Redis
        if (activity.getSeckillStock() != null) {
            redisCacheService.setSeckillStock(activity.getId(), activity.getSeckillStock());
        }
        
        return activity;
    }

    @Override
    public SeckillActivityModel getActivity(Long id) {
        return seckillActivityDao.selectByPrimaryKey(id);
    }

    @Override
    public List<SeckillActivityModel> listActive() {
        return seckillActivityDao.listActive();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SeckillOrderModel seckillBuy(Long userId, Long seckillId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return null;
        }

        // Redis Pre-check
        int result = redisCacheService.trySeckill(seckillId, userId, quantity);
        if (result == -2) {
            // Cache miss, load from DB
            SeckillActivityModel activity = seckillActivityDao.selectByPrimaryKey(seckillId);
            if (activity == null || activity.getStatus() != 1) {
                return null;
            }
            Date now = new Date();
            if (activity.getStartTime() != null && now.before(activity.getStartTime())) {
                return null;
            }
            if (activity.getEndTime() != null && now.after(activity.getEndTime())) {
                return null;
            }
            
            redisCacheService.setSeckillStock(seckillId, activity.getSeckillStock());
            // Retry
            result = redisCacheService.trySeckill(seckillId, userId, quantity);
        }

        if (result == -1) {
            throw new DuplicateKeyException("Repeat buy");
        }
        if (result == 0) {
            return null; // Sold out
        }

        SeckillActivityModel activity = seckillActivityDao.selectByPrimaryKey(seckillId);
        // Double check just in case, though Redis should handle it. 
        // We do this to get price and idleId.
        if (activity == null) {
            redisCacheService.revertStock(seckillId, quantity);
            redisCacheService.removeUserFromSeckill(seckillId, userId);
            return null;
        }

        try {
            // 1) Decrease DB stock (Durability)
            int changedSeckill = seckillActivityDao.decreaseStockIfEnough(seckillId, quantity);
            if (changedSeckill != 1) {
                 // Should not happen if Redis is consistent, but if it does, rollback Redis
                 throw new RuntimeException("DB Stock mismatch");
            }

            // 2) Decrease Idle Item stock
            int changedIdle = idleItemDao.decreaseStockIfEnough(activity.getIdleId(), quantity);
            if (changedIdle != 1) {
                throw new RuntimeException("Idle Item Stock mismatch");
            }

            // 3) Create Order
            OrderModel order = new OrderModel();
            order.setOrderNumber(IdFactoryUtil.getOrderId());
            order.setUserId(userId);
            order.setIdleId(activity.getIdleId());
            order.setOrderQuantity(quantity);
            order.setOrderStatus((byte) 0);
            order.setPaymentStatus((byte) 0);
            order.setCreateTime(new Date());

            BigDecimal totalPrice = activity.getSeckillPrice().multiply(BigDecimal.valueOf(quantity));
            order.setOrderPrice(totalPrice);

            if (orderDao.insert(order) != 1) {
                throw new RuntimeException("Create order failed");
            }

            // 4) Create Seckill Order
            SeckillOrderModel skOrder = new SeckillOrderModel();
            skOrder.setSeckillId(seckillId);
            skOrder.setOrderId(order.getId());
            skOrder.setUserId(userId);
            skOrder.setIdleId(activity.getIdleId());
            skOrder.setQuantity(quantity);
            skOrder.setStatus((byte) 0);
            skOrder.setCreateTime(new Date());

            seckillOrderDao.insert(skOrder);

            // 5) Timeout task
            OrderModel cancelTaskModel = new OrderModel();
            cancelTaskModel.setId(order.getId());
            cancelTaskModel.setOrderStatus((byte) 4);
            OrderTaskHandler.addOrder(new OrderTask(cancelTaskModel, 5 * 60));

            skOrder.setOrder(order);
            return skOrder;
        } catch (Exception e) {
            // Rollback Redis on any error
            redisCacheService.revertStock(seckillId, quantity);
            redisCacheService.removeUserFromSeckill(seckillId, userId);
            throw e;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancelByOrderId(Long orderId) {
        SeckillOrderModel sk = seckillOrderDao.selectByOrderId(orderId);
        if (sk == null) {
            return false;
        }
        // 只允许从未支付 -> 已取消
        int updated = seckillOrderDao.updateStatusIfMatch(sk.getId(), 0, 2);
        if (updated == 1) {
            seckillActivityDao.increaseStock(sk.getSeckillId(), sk.getQuantity());
            // Restore Redis
            redisCacheService.revertStock(sk.getSeckillId(), sk.getQuantity());
            redisCacheService.removeUserFromSeckill(sk.getSeckillId(), sk.getUserId());
            return true;
        }
        return false;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean markPaidByOrderId(Long orderId) {
        SeckillOrderModel sk = seckillOrderDao.selectByOrderId(orderId);
        if (sk == null) {
            return false;
        }
        return seckillOrderDao.updateStatusIfMatch(sk.getId(), 0, 1) == 1;
    }
}
