package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.BannedWordModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BannedWordDao {
    int insert(BannedWordModel record);

    int deleteByPrimaryKey(Long id);

    List<BannedWordModel> getAllBannedWords();
}
