package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.dao.IdleItemDao;
import com.second.hand.trading.server.dao.OrderDao;
import com.second.hand.trading.server.dao.SeckillActivityDao;
import com.second.hand.trading.server.dao.SeckillOrderDao;
import com.second.hand.trading.server.message.SeckillMessage;
import com.second.hand.trading.server.model.IdleItemModel;
import com.second.hand.trading.server.model.OrderModel;
import com.second.hand.trading.server.model.SeckillActivityModel;
import com.second.hand.trading.server.model.SeckillOrderModel;
import com.second.hand.trading.server.service.RedisCacheService;
import com.second.hand.trading.server.service.SeckillService;
import com.second.hand.trading.server.utils.IdFactoryUtil;
import com.second.hand.trading.server.utils.OrderTask;
import com.second.hand.trading.server.utils.OrderTaskHandler;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.kafka.core.KafkaTemplate;
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

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

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

        // Send to Kafka for async processing
        SeckillMessage message = new SeckillMessage(userId, seckillId, quantity);
        kafkaTemplate.send("seckill_orders", JSON.toJSONString(message));

        // Return a dummy order object indicating "Queued"
        // In a real system, we might return a status code "202 Accepted"
        SeckillOrderModel dummy = new SeckillOrderModel();
        dummy.setId(-1L); // -1 indicates async processing
        dummy.setStatus((byte) 0);
        return dummy;
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
