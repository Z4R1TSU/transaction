package com.second.hand.trading.server.dto;

import java.io.Serializable;

public class SeckillOrder implements Serializable {

    private Long userId;
    private Long seckillId;
    private Long productId;

    public SeckillOrder() {
    }

    public SeckillOrder(Long userId, Long seckillId, Long productId) {
        this.userId = userId;
        this.seckillId = seckillId;
        this.productId = productId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSeckillId() {
        return seckillId;
    }

    public void setSeckillId(Long seckillId) {
        this.seckillId = seckillId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}