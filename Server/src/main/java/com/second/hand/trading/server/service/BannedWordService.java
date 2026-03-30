package com.second.hand.trading.server.service;

import com.second.hand.trading.server.model.BannedWordModel;

import java.util.List;

public interface BannedWordService {
    boolean addBannedWord(String word);

    boolean deleteBannedWord(Long id);

    List<BannedWordModel> getAllBannedWords();

    String checkBannedWord(String text);
}
