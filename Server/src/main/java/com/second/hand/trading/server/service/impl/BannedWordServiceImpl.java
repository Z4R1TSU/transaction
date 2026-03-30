package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.dao.BannedWordDao;
import com.second.hand.trading.server.model.BannedWordModel;
import com.second.hand.trading.server.service.BannedWordService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class BannedWordServiceImpl implements BannedWordService {

    @Resource
    private BannedWordDao bannedWordDao;

    @Override
    public boolean addBannedWord(String word) {
        BannedWordModel model = new BannedWordModel();
        model.setWord(word);
        model.setCreateTime(new Date());
        return bannedWordDao.insert(model) == 1;
    }

    @Override
    public boolean deleteBannedWord(Long id) {
        return bannedWordDao.deleteByPrimaryKey(id) == 1;
    }

    @Override
    public List<BannedWordModel> getAllBannedWords() {
        return bannedWordDao.getAllBannedWords();
    }

    @Override
    public String checkBannedWord(String text) {
        if (text == null || text.isEmpty()) {
            return null;
        }
        List<BannedWordModel> words = bannedWordDao.getAllBannedWords();
        for (BannedWordModel bw : words) {
            if (text.contains(bw.getWord())) {
                return bw.getWord();
            }
        }
        return null;
    }
}
