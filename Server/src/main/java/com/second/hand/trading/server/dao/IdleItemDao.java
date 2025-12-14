package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.IdleItemModel;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IdleItemDao {
    int deleteByPrimaryKey(Long id);

    int insert(IdleItemModel record);

    int insertSelective(IdleItemModel record);

    IdleItemModel selectByPrimaryKey(Long id);

    List<IdleItemModel> getAllIdleItem(Long userId);

    int countIdleItem(String findValue);

    int countIdleItemByLable(int idleLabel);

    int countIdleItemByStatus(int status);

    List<IdleItemModel> findIdleItem(String findValue, int begin, int nums);

    List<IdleItemModel> findIdleItemByLable(int idleLabel, int begin, int nums);

    List<IdleItemModel> getIdleItemByStatus(int status, int begin, int nums);

    int updateByPrimaryKeySelective(IdleItemModel record);

    int updateByPrimaryKey(IdleItemModel record);

    List<IdleItemModel> findIdleByList(List<Long> idList);

    /**
     * 原子扣减库存：仅当上架且库存充足时更新成功（返回1）
     */
    int decreaseStockIfEnough(@Param("id") Long id, @Param("amount") Integer amount);

    /**
     * 增加库存（用于取消订单回补库存）
     */
    int increaseStock(@Param("id") Long id, @Param("amount") Integer amount);
}
