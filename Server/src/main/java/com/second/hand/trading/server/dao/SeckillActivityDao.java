package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.SeckillActivityModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SeckillActivityDao {

    int insert(SeckillActivityModel record);

    SeckillActivityModel selectByPrimaryKey(Long id);

    SeckillActivityModel selectByIdleId(Long idleId);

    List<SeckillActivityModel> listActive();

    int decreaseStockIfEnough(@Param("id") Long id, @Param("amount") Integer amount);

    int increaseStock(@Param("id") Long id, @Param("amount") Integer amount);
}

