package com.second.hand.trading.server.model;

import java.io.Serializable;
import java.util.Date;

/**
 * sh_seckill_order
 */
public class SeckillOrderModel implements Serializable {

    private Long id;

    private Long seckillId;

    private Long orderId;

    private Long userId;

    private Long idleId;

    private Integer quantity;

    /**
     * 状态(0未支付 1已支付 2已取消)
     */
    private Byte status;

    private Date createTime;

    private SeckillActivityModel seckill;

    private OrderModel order;

    private IdleItemModel idleItem;

    private static final long serialVersionUID = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSeckillId() {
        return seckillId;
    }

    public void setSeckillId(Long seckillId) {
        this.seckillId = seckillId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getIdleId() {
        return idleId;
    }

    public void setIdleId(Long idleId) {
        this.idleId = idleId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public SeckillActivityModel getSeckill() {
        return seckill;
    }

    public void setSeckill(SeckillActivityModel seckill) {
        this.seckill = seckill;
    }

    public OrderModel getOrder() {
        return order;
    }

    public void setOrder(OrderModel order) {
        this.order = order;
    }

    public IdleItemModel getIdleItem() {
        return idleItem;
    }

    public void setIdleItem(IdleItemModel idleItem) {
        this.idleItem = idleItem;
    }
}

