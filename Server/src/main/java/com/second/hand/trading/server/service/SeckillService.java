package com.second.hand.trading.server.service;

public interface SeckillService {

    /**
     * 预加载秒杀商品库存到Redis
     * @param seckillId 秒杀活动ID
     * @param productId 商品ID
     * @param stock 库存数量
     */
    void preloadSeckillStock(Long seckillId, Long productId, Integer stock);

    /**
     * 预扣减库存
     * @param seckillId 秒杀活动ID
     * @param productId 商品ID
     * @return 是否扣减成功
     */
    boolean preDecrementStock(Long seckillId, Long productId);

}