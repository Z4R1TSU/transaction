package com.second.hand.trading.server.aop;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    /**
     * 每秒生成的令牌数
     */
    double permitsPerSecond() default 100.0;

    /**
     * 获取令牌的超时时间
     */
    long timeout() default 0;

    /**
     * 超时时间单位
     */
    TimeUnit timeUnit() default TimeUnit.MILLISECONDS;

    /**
     * 无法获取令牌时的提示信息
     */
    String msg() default "当前排队人数较多，请稍后再试";
}