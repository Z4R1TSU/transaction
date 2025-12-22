package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.SeckillOrderModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SeckillOrderDao {

    int insert(SeckillOrderModel record);

    SeckillOrderModel selectByPrimaryKey(Long id);

    SeckillOrderModel selectByUserAndSeckill(@Param("userId") Long userId, @Param("seckillId") Long seckillId);

    SeckillOrderModel selectByOrderId(Long orderId);

    int updateStatusIfMatch(@Param("id") Long id, @Param("fromStatus") Integer fromStatus, @Param("toStatus") Integer toStatus);
}

