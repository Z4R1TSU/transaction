package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.IdleItemModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IdleItemDao {
    int deleteByPrimaryKey(Long id);

    int insert(IdleItemModel record);

    int insertSelective(IdleItemModel record);

    IdleItemModel selectByPrimaryKey(Long id);

    List<IdleItemModel> getAllIdleItem(Long userId);

    int countIdleItem(@Param("findValue") String findValue);

    int countIdleItemByLable(@Param("idleLabel") int idleLabel);

    int countIdleItemByStatus(@Param("status") int status);

    List<IdleItemModel> findIdleItem(@Param("findValue") String findValue, @Param("begin") int begin, @Param("nums") int nums);

    List<IdleItemModel> findIdleItemByLable(@Param("idleLabel") int idleLabel, @Param("begin") int begin, @Param("nums") int nums);

    List<IdleItemModel> getIdleItemByStatus(@Param("status") int status, @Param("begin") int begin, @Param("nums") int nums);

    List<IdleItemModel> adminGetAllIdleItem(@Param("begin") int begin, @Param("nums") int nums);

    int countAdminAllIdleItem();

    int updateByPrimaryKeySelective(IdleItemModel record);

    int updateByPrimaryKey(IdleItemModel record);

    List<IdleItemModel> findIdleByList(@Param("idList") List<Long> idList);
}
