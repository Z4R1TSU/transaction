package com.second.hand.trading.server;

import com.second.hand.trading.server.service.RedisCacheService;
import com.second.hand.trading.server.service.SeckillService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class SeckillFlowTest {

    @Autowired
    private RedisCacheService redisCacheService;

    @Autowired
    private SeckillService seckillService;

    @MockBean
    private KafkaTemplate<String, String> kafkaTemplate;

    @Test
    public void testTokenBucket() {
        String key = "test_user_1";
        // Capacity 5, Rate 1, Request 1 -> Allowed
        assert redisCacheService.allowRequestTokenBucket(key, 1, 5, 1);
        
        // Drain tokens
        assert redisCacheService.allowRequestTokenBucket(key, 1, 5, 4);
        
        // Should fail
        assert !redisCacheService.allowRequestTokenBucket(key, 1, 5, 1);
    }

    @Test
    public void testSeckillAsyncFlow() {
        // Mocking stock in Redis
        Long seckillId = 100L;
        Integer stock = 10;
        redisCacheService.setSeckillStock(seckillId, stock);
        
        // Perform Buy
        Long userId = 888L;
        Integer quantity = 1;
        
        seckillService.seckillBuy(userId, seckillId, quantity);
        
        // Verify Kafka message sent
        verify(kafkaTemplate).send(eq("seckill_orders"), anyString());
    }
}
