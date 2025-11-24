package com.second.hand.trading.server.consumer;

import com.second.hand.trading.server.config.KafkaTopicConfig;
import com.second.hand.trading.server.dto.SeckillOrder;
import com.second.hand.trading.server.model.IdleItemModel;
import com.second.hand.trading.server.model.OrderModel;
import com.second.hand.trading.server.service.IdleItemService;
import com.second.hand.trading.server.service.OrderService;
import com.second.hand.trading.server.utils.IdFactoryUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class SeckillOrderConsumer {

    private static final Logger logger = LoggerFactory.getLogger(SeckillOrderConsumer.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private IdleItemService idleItemService;

    @KafkaListener(topics = KafkaTopicConfig.SECKILL_TOPIC, groupId = "seckill-group")
    public void processSeckillOrder(SeckillOrder seckillOrder) {
        logger.info("Received seckill order: {}", seckillOrder);

        boolean success = idleItemService.decrementStock(seckillOrder.getProductId(), 1);

        if (success) {
            IdleItemModel idleItem = idleItemService.getIdleItem(seckillOrder.getProductId());

            OrderModel orderModel = new OrderModel();
            orderModel.setOrderNumber(IdFactoryUtil.getOrderId());
            orderModel.setUserId(seckillOrder.getUserId());
            orderModel.setIdleId(seckillOrder.getProductId());
            orderModel.setOrderPrice(idleItem.getIdlePrice());
            orderModel.setPaymentStatus((byte) 0); // unpaid
            orderModel.setCreateTime(new Date());
            orderModel.setOrderStatus((byte) 1); // created
            orderModel.setIsDeleted((byte) 0);

            orderService.addOrder(orderModel);
            logger.info("Seckill order created successfully: {}", orderModel.getOrderNumber());
        } else {
            logger.warn("Failed to decrement stock for product: {}, seckill failed.", seckillOrder.getProductId());
            // Here you can add logic to handle the failure, e.g., notify the user, or add the user to a list of failed orders.
        }
    }
}