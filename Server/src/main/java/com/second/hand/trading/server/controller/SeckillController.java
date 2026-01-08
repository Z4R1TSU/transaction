package com.second.hand.trading.server.controller;

import com.second.hand.trading.server.enums.ErrorMsg;
import com.second.hand.trading.server.model.IdleItemModel;
import com.second.hand.trading.server.model.SeckillActivityModel;
import com.second.hand.trading.server.model.SeckillOrderModel;
import com.second.hand.trading.server.service.IdleItemService;
import com.second.hand.trading.server.service.SeckillService;
import com.second.hand.trading.server.vo.ResultVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/seckill")
public class SeckillController {

    @Autowired
    private SeckillService seckillService;

    @Autowired
    private IdleItemService idleItemService;

    /**
     * 卖家创建秒杀活动（绑定自己的闲置）
     */
    @PostMapping("/publish")
    public ResultVo publish(@CookieValue("shUserId")
                            @NotNull(message = "登录异常 请重新登录")
                            @NotEmpty(message = "登录异常 请重新登录") String shUserId,
                            @RequestBody SeckillActivityModel activity) {

        if (activity.getIdleId() == null || activity.getSeckillPrice() == null || activity.getSeckillStock() == null) {
            return ResultVo.fail(ErrorMsg.MISSING_PARAMETER);
        }
        if (activity.getSeckillStock() <= 0) {
            return ResultVo.fail(ErrorMsg.PARAM_ERROR);
        }

        IdleItemModel idle = idleItemService.getIdleItem(activity.getIdleId());
        if (idle == null || idle.getUserId() == null || !idle.getUserId().equals(Long.valueOf(shUserId))) {
            return ResultVo.fail(ErrorMsg.PARAM_ERROR);
        }
        if (idle.getIdleStock() == null || idle.getIdleStock() < activity.getSeckillStock()) {
            return ResultVo.fail(ErrorMsg.PARAM_ERROR);
        }
        if (activity.getStartTime() == null) {
            activity.setStartTime(new Date());
        }
        if (activity.getEndTime() == null) {
            // 默认 24 小时
            activity.setEndTime(new Date(System.currentTimeMillis() + 24L * 60 * 60 * 1000));
        }
        if (activity.getEndTime().before(activity.getStartTime())) {
            return ResultVo.fail(ErrorMsg.PARAM_ERROR);
        }

        SeckillActivityModel created = seckillService.createActivity(Long.valueOf(shUserId), activity);
        return ResultVo.success(created);
    }

    @GetMapping("/info")
    public ResultVo info(@RequestParam Long id) {
        SeckillActivityModel activity = seckillService.getActivity(id);
        if (activity == null) {
            return ResultVo.fail(ErrorMsg.SECKILL_NOT_EXIST);
        }
        return ResultVo.success(activity);
    }

    @GetMapping("/list")
    public ResultVo list() {
        List<SeckillActivityModel> list = seckillService.listActive();
        return ResultVo.success(list);
    }

    /**
     * 秒杀下单：预扣库存 + 创建订单（未支付）
     */
    @PostMapping("/buy")
    public ResultVo buy(@CookieValue("shUserId")
                        @NotNull(message = "登录异常 请重新登录")
                        @NotEmpty(message = "登录异常 请重新登录") String shUserId,
                        @RequestBody SeckillOrderModel req) {

        if (req.getSeckillId() == null) {
            return ResultVo.fail(ErrorMsg.MISSING_PARAMETER);
        }
        Integer quantity = req.getQuantity() == null ? 1 : req.getQuantity();
        if (quantity <= 0) {
            return ResultVo.fail(ErrorMsg.PARAM_ERROR);
        }

        try {
            SeckillOrderModel order = seckillService.seckillBuy(Long.valueOf(shUserId), req.getSeckillId(), quantity);
            if (order == null) {
                return ResultVo.fail(ErrorMsg.SECKILL_SOLD_OUT);
            }
            if (order.getId() == -1L) {
                return ResultVo.success("排队中", order);
            }
            return ResultVo.success(order);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            return ResultVo.fail(ErrorMsg.SECKILL_REPEAT_BUY);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultVo.fail(ErrorMsg.SYSTEM_ERROR);
        }
    }
}

