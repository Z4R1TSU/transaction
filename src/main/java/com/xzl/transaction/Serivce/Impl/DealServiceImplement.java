package com.xzl.transaction.Serivce.Impl;

import com.xzl.transaction.Entities.Deal;
import com.xzl.transaction.Entities.Goods;
import com.xzl.transaction.Mapper.DealMapper;
import com.xzl.transaction.Mapper.GoodsMapper;
import com.xzl.transaction.Serivce.DealService;
import com.xzl.transaction.Serivce.GoodsService;
import com.xzl.transaction.Serivce.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DealServiceImplement implements DealService {
    @Autowired
    private DealMapper dealMapper;
    @Autowired
    private GoodsMapper goodsMapper;
    @Autowired
    private ShopService shopService;
    @Autowired
    private GoodsService goodsService;


    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public Boolean insertDeal(Deal deal) {
        String goodsUUID = deal.getGoodsUUID();
        String shopUUID = deal.getShopUUID();
        Goods goods = goodsMapper.queryGoodsByUUID(goodsUUID);
        Integer goodsCount = goods.getGoodsCount();
        Integer dealCount = Integer.valueOf(deal.getDealCount());
        if (goodsCount < dealCount) {
            return false;
        }
        Boolean flag1 = goodsService.updateGoodsDealCount(goodsUUID, Integer.valueOf(dealCount));
        Boolean flag2 = shopService.updateShopDealCount(shopUUID, Integer.valueOf(dealCount));
        Boolean flag3 = goodsService.updateGoodsCount(goodsUUID, Integer.valueOf(dealCount));
        if (flag3 == null)
            return null;
        Boolean flag4 = goodsService.updateGoodsPraiseRate(goodsUUID);
        Boolean flag5 = shopService.updateShopPraiseRate(shopUUID);
        Boolean aBoolean = dealMapper.insertDeal(deal);
        return flag1 && flag2 && flag3 && flag4 && flag5 && aBoolean;
    }

    @Override
    public List<Deal> getDealListByCondition(Deal deal, Integer currentPage, Integer pageSize) {
        Integer begin;
        if (currentPage != null) {
            begin = (currentPage - 1) * pageSize;
        } else {
            begin = 0;
            pageSize = 10000;
        }
        List<Deal> deals = dealMapper.queryDealListByCondition(deal, begin, pageSize);
        return deals;
    }

    @Override
    public Boolean updateDealTime(String dealUUID) {
        Boolean aBoolean = dealMapper.updateDealTime(dealUUID);
        return aBoolean;
    }

    @Override
    public Boolean updateAssess(String dealUUID, String assess) {
        return dealMapper.updateAssess(dealUUID, assess);
    }

    @Override
    public Boolean updateStatus(String dealUUID, String status) {
        return dealMapper.updateStatus(dealUUID, status);
    }

    @Override
    public Deal getDeal(String dealUUID) {
        Deal deal = dealMapper.queryDealByUUID(dealUUID);
        return deal;
    }

    @Override
    public List<Deal> getDealListByGoodsUUID(String goodsUUID) {
        return dealMapper.queryDealListByGoodsUUID(goodsUUID);
    }

    @Override
    public Integer queryDealCount(Deal deal) {
        if (deal==null)
            return dealMapper.queryALLDealCount();
        return dealMapper.queryDealCount(deal);
    }
}
