package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.service.SeckillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class SeckillServiceImpl implements SeckillService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String SECKILL_STOCK_KEY_PREFIX = "seckill:stock:";

    // Lua脚本，用于原子性地扣减库存
    private static final String DECREMENT_STOCK_LUA_SCRIPT = 
        "local stock = redis.call('get', KEYS[1]);" +
        "if (stock and tonumber(stock) > 0) then" +
        "    redis.call('decr', KEYS[1]);" +
        "    return 1;" +
        "else" +
        "    return 0;" +
        "end";

    @Override
    public void preloadSeckillStock(Long seckillId, Long productId, Integer stock) {
        String key = SECKILL_STOCK_KEY_PREFIX + seckillId + ":" + productId;
        redisTemplate.opsForValue().set(key, stock);
    }

    @Override
    public boolean preDecrementStock(Long seckillId, Long productId) {
        String key = SECKILL_STOCK_KEY_PREFIX + seckillId + ":" + productId;
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>(DECREMENT_STOCK_LUA_SCRIPT, Long.class);
        Long result = redisTemplate.execute(redisScript, Collections.singletonList(key));
        return result != null && result == 1;
    }
}