package com.xzl.transaction.Serivce.Impl;

import com.xzl.transaction.Entities.BusinessUser;
import com.xzl.transaction.Entities.CommonUser;
import com.xzl.transaction.Entities.MiddleWallet;
import com.xzl.transaction.Entities.Wallet;
import com.xzl.transaction.Mapper.UserMapper;
import com.xzl.transaction.Mapper.WalletMapper;
import com.xzl.transaction.Serivce.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletServiceImplement implements WalletService {
    @Autowired
    private WalletMapper walletMapper;
    @Autowired
    private UserMapper userMapper;

//    @Override
//    public Boolean insertWallet(String userId) {
//        Boolean aBoolean = walletMapper.insertWallet(userId);
//        return aBoolean;
//    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public Boolean addMoney(String userId, Double addMoney) {
        BusinessUser businessUser = userMapper.queryBusinessUserById(userId);
        CommonUser commonUser = userMapper.queryCommonUserById(userId);
        if (businessUser == null && commonUser == null) {
            return false;
        }
        Wallet wallet = walletMapper.queryWallet(userId);
        Double currentMoney = wallet.getCurrentMoney();
        Double sumMoney = wallet.getSumMoney();
        double newSumMoney = sumMoney + addMoney;
        double newCurrentMoney = currentMoney + addMoney;
        Boolean aBoolean = walletMapper.updateSumMoney(userId, newSumMoney);
        Boolean aBoolean1 = walletMapper.updateCurrentMoney(userId, newCurrentMoney);
        return aBoolean && aBoolean1;
    }

    @Override
    public Wallet getWallet(String userId) {
        Wallet wallet = walletMapper.queryWallet(userId);
        return wallet;
    }

    @Override
    public Boolean subMoney(String userId, Integer subMoney) {
        Wallet wallet = walletMapper.queryWallet(userId);
        Double currentMoney = wallet.getCurrentMoney();
//        Double sumMoney = wallet.getSumMoney();
        Integer integral = wallet.getIntegral();
        double newCurrentMoney = currentMoney - subMoney;
//        double newSumMoney = sumMoney - subMoney;
        int newIntegral = integral + subMoney;
        if (newCurrentMoney < 0) {
            return false;
        }
//        Boolean aBoolean = walletMapper.updateSumMoney(userId, newSumMoney);
        Boolean aBoolean1 = walletMapper.updateCurrentMoney(userId, newCurrentMoney);
        Boolean aBoolean2 = walletMapper.updateIntegral(userId, newIntegral);
        return aBoolean1 && aBoolean2;
    }

    @Override
    public MiddleWallet getMiddleWallet(String dealUUID, String status) {
        return walletMapper.queryMiddleWalletByUUID(dealUUID, status);
    }

    @Override
    public Boolean updateMiddleWalletStatus(String dealUUID, String status) {
        return walletMapper.updateMiddleWalletStatus(dealUUID, status);
    }
}
