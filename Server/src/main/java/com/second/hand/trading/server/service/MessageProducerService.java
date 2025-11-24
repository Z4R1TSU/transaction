package com.second.hand.trading.server.service;

public interface MessageProducerService {

    /**
     * 发送秒杀订单消息
     * @param message 消息内容
     */
    void sendSeckillMessage(Object message);
}