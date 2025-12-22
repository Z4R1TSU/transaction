package com.second.hand.trading.server.service;

import com.second.hand.trading.server.model.SeckillActivityModel;
import com.second.hand.trading.server.model.SeckillOrderModel;

import java.util.List;

public interface SeckillService {

    SeckillActivityModel createActivity(Long sellerId, SeckillActivityModel activity);

    SeckillActivityModel getActivity(Long id);

    List<SeckillActivityModel> listActive();

    /**
     * 秒杀下单：预扣减秒杀库存与商品库存，并创建订单
     */
    SeckillOrderModel seckillBuy(Long userId, Long seckillId, Integer quantity);

    /**
     * 订单取消时同步取消秒杀订单并回补秒杀库存
     */
    boolean cancelByOrderId(Long orderId);

    /**
     * 订单支付成功时同步秒杀订单状态
     */
    boolean markPaidByOrderId(Long orderId);
}

