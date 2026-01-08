package com.second.hand.trading.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scripting.support.ResourceScriptSource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;

@Service
public class RedisCacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private DefaultRedisScript<Long> seckillScript;
    private DefaultRedisScript<Long> rateLimitScript;
    private DefaultRedisScript<Long> tokenBucketScript;

    @PostConstruct
    public void init() {
        seckillScript = new DefaultRedisScript<>();
        seckillScript.setResultType(Long.class);
        seckillScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/seckill.lua")));

        rateLimitScript = new DefaultRedisScript<>();
        rateLimitScript.setResultType(Long.class);
        rateLimitScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/rate_limit.lua")));
        
        tokenBucketScript = new DefaultRedisScript<>();
        tokenBucketScript.setResultType(Long.class);
        tokenBucketScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/token_bucket.lua")));
    }

    private String getStockKey(Long seckillId) {
        return "seckill:stock:" + seckillId;
    }

    private String getUserKey(Long seckillId) {
        return "seckill:users:" + seckillId;
    }

    public void setSeckillStock(Long seckillId, Integer stock) {
        redisTemplate.opsForValue().set(getStockKey(seckillId), stock);
    }

    /**
     * @return 1: success, 0: sold out, -1: repeat buy
     */
    public int trySeckill(Long seckillId, Long userId, Integer quantity) {
        List<String> keys = Arrays.asList(getStockKey(seckillId), getUserKey(seckillId));
        Long result = redisTemplate.execute(seckillScript, keys, userId.toString(), quantity.toString());
        return result != null ? result.intValue() : 0;
    }

    public void revertStock(Long seckillId, Integer quantity) {
        redisTemplate.opsForValue().increment(getStockKey(seckillId), quantity);
    }

    public void removeUserFromSeckill(Long seckillId, Long userId) {
        redisTemplate.opsForSet().remove(getUserKey(seckillId), userId.toString());
    }
    
    public boolean hasStock(Long seckillId) {
        Object stock = redisTemplate.opsForValue().get(getStockKey(seckillId));
        return stock != null && (Integer) stock > 0;
    }

    public boolean allowRequest(String key, int limit, int windowSeconds) {
        List<String> keys = Arrays.asList("rate_limit:" + key);
        Long result = redisTemplate.execute(rateLimitScript, keys, String.valueOf(limit), String.valueOf(windowSeconds));
        return result != null && result == 1;
    }

    /**
     * Token Bucket Rate Limiting
     * @param key Unique key
     * @param rate Tokens per second
     * @param capacity Max tokens
     * @param requested Tokens requested
     * @return true if allowed
     */
    public boolean allowRequestTokenBucket(String key, double rate, double capacity, int requested) {
        List<String> keys = Arrays.asList("token_bucket:" + key);
        long now = System.currentTimeMillis() / 1000;
        Long result = redisTemplate.execute(tokenBucketScript, keys, String.valueOf(rate), String.valueOf(capacity), String.valueOf(now), String.valueOf(requested));
        return result != null && result == 1;
    }
}
