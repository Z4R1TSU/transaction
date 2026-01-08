package com.second.hand.trading.server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.second.hand.trading.server.enums.ErrorMsg;
import com.second.hand.trading.server.service.RedisCacheService;
import com.second.hand.trading.server.vo.ResultVo;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 秒杀接口限流（分布式）：按 userId/IP 做短窗口限流
 */
public class SeckillRateLimitInterceptor implements HandlerInterceptor {

    private final RedisCacheService redisCacheService;
    private static final ObjectMapper mapper = new ObjectMapper();

    public SeckillRateLimitInterceptor(RedisCacheService redisCacheService) {
        this.redisCacheService = redisCacheService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String userId = null;
        if (request.getCookies() != null) {
            for (javax.servlet.http.Cookie c : request.getCookies()) {
                if ("shUserId".equals(c.getName())) {
                    userId = c.getValue();
                    break;
                }
            }
        }
        String key = (userId != null && !userId.isEmpty()) ? ("uid:" + userId) : ("ip:" + request.getRemoteAddr());
        
        // Token Bucket: 10 tokens/sec, max 20 tokens capacity, 1 token requested
        boolean allowed = redisCacheService.allowRequestTokenBucket(key, 10, 20, 1);
        if (allowed) {
            return true;
        }

        response.setStatus(200);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(mapper.writeValueAsString(ResultVo.fail(ErrorMsg.SECKILL_RATE_LIMIT)));
        return false;
    }
}

