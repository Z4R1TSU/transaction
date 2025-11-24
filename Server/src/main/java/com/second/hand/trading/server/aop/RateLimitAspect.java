package com.second.hand.trading.server.aop;

import com.google.common.util.concurrent.RateLimiter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.concurrent.ConcurrentHashMap;

@Aspect
@Component
public class RateLimitAspect {

    private final ConcurrentHashMap<String, RateLimiter> rateLimiters = new ConcurrentHashMap<>();

    @Pointcut("@annotation(com.second.hand.trading.server.aop.RateLimit)")
    public void rateLimitCut() {
    }

    @Around("rateLimitCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        RateLimit annotation = method.getAnnotation(RateLimit.class);

        String key = method.toGenericString();
        RateLimiter rateLimiter = rateLimiters.computeIfAbsent(key, k -> RateLimiter.create(annotation.permitsPerSecond()));

        if (rateLimiter.tryAcquire(annotation.timeout(), annotation.timeUnit())) {
            return point.proceed();
        } else {
            // 可以抛出自定义的异常，或者返回特定的错误信息
            throw new RuntimeException(annotation.msg());
        }
    }
}