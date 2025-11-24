package com.second.hand.trading.server.controller;

import com.second.hand.trading.server.aop.RateLimit;
import com.second.hand.trading.server.dto.SeckillOrder;
import com.second.hand.trading.server.service.MessageProducerService;
import com.second.hand.trading.server.service.SeckillService;
import com.second.hand.trading.server.vo.ResultVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seckill")
public class SeckillController {

    @Autowired
    private SeckillService seckillService;

    @Autowired
    private MessageProducerService messageProducerService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String SECKILL_USER_KEY_PREFIX = "seckill:users:";

    /**
     * 预加载秒杀商品库存
     * @param seckillId
     * @param productId
     * @param stock
     * @return
     */
    @PostMapping("/preload")
    public ResultVo preloadSeckillStock(@RequestParam("seckillId") Long seckillId,
                                        @RequestParam("productId") Long productId,
                                        @RequestParam("stock") Integer stock) {
        seckillService.preloadSeckillStock(seckillId, productId, stock);
        return ResultVo.success();
    }

    /**
     * 执行秒杀
     * @param seckillId
     * @param productId
     * @param userId
     * @return
     */
    @RateLimit(permitsPerSecond = 10)
    @PostMapping("/{seckillId}/{productId}/{userId}")
    public ResultVo executeSeckill(@PathVariable("seckillId") Long seckillId,
                                     @PathVariable("productId") Long productId,
                                     @PathVariable("userId") Long userId) {
        String userKey = SECKILL_USER_KEY_PREFIX + seckillId + ":" + productId;
        Boolean isMember = redisTemplate.opsForSet().isMember(userKey, userId.toString());
        if (isMember != null && isMember) {
            return ResultVo.fail("您已参与过本次秒杀");
        }

        boolean success = seckillService.preDecrementStock(seckillId, productId);
        if (success) {
            redisTemplate.opsForSet().add(userKey, userId.toString());
            messageProducerService.sendSeckillMessage(new SeckillOrder(userId, seckillId, productId));
            return ResultVo.success("正在排队中，请稍后查看订单");
        }
        return ResultVo.fail("已售罄");
    }
}