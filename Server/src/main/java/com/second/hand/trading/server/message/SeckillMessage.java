package com.second.hand.trading.server.message;

import java.io.Serializable;

public class SeckillMessage implements Serializable {
    private Long userId;
    private Long seckillId;
    private Integer quantity;

    public SeckillMessage() {
    }

    public SeckillMessage(Long userId, Long seckillId, Integer quantity) {
        this.userId = userId;
        this.seckillId = seckillId;
        this.quantity = quantity;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "SeckillMessage{" +
                "userId=" + userId +
                ", seckillId=" + seckillId +
                ", quantity=" + quantity +
                '}';
    }
}
