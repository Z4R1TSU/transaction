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
import com.second.hand.trading.server.utils.IdFactoryUtil;
import com.second.hand.trading.server.utils.OrderTask;
import com.second.hand.trading.server.utils.OrderTaskHandler;
import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Date;

@Service
public class SeckillConsumer {

    private static final Logger logger = LoggerFactory.getLogger(SeckillConsumer.class);

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

    @KafkaListener(topics = "seckill_orders", groupId = "seckill-group")
    public void consume(String message) {
        logger.info("Receive seckill message: {}", message);
        SeckillMessage sm = JSON.parseObject(message, SeckillMessage.class);
        Long userId = sm.getUserId();
        Long seckillId = sm.getSeckillId();
        Integer quantity = sm.getQuantity();

        SeckillActivityModel activity = seckillActivityDao.selectByPrimaryKey(seckillId);
        if (activity == null) {
            return;
        }

        // Re-check DB stock just in case
        // Although Redis checked, we do real transaction here
        try {
            createOrder(userId, activity, quantity);
        } catch (Exception e) {
            logger.error("Failed to create order for user: {}, seckillId: {}", userId, seckillId, e);
            // Rollback Redis if DB failed
            redisCacheService.revertStock(seckillId, quantity);
            redisCacheService.removeUserFromSeckill(seckillId, userId);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void createOrder(Long userId, SeckillActivityModel activity, Integer quantity) {
        Long seckillId = activity.getId();

        // 1) Decrease DB stock (Durability)
        int changedSeckill = seckillActivityDao.decreaseStockIfEnough(seckillId, quantity);
        if (changedSeckill != 1) {
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
        
        logger.info("Order created successfully. OrderId: {}", order.getId());
    }
}
