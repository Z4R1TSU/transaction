package com.second.hand.trading.server.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String SECKILL_TOPIC = "seckill.topic";

    @Bean
    public NewTopic seckillTopic() {
        return TopicBuilder.name(SECKILL_TOPIC)
                .partitions(1)
                .replicas(1)
                .build();
    }
}