package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.config.KafkaTopicConfig;
import com.second.hand.trading.server.service.MessageProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageProducerServiceImpl implements MessageProducerService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendSeckillMessage(Object message) {
        kafkaTemplate.send(KafkaTopicConfig.SECKILL_TOPIC, message);
    }
}