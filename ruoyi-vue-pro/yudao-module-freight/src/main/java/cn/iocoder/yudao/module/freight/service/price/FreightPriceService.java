package cn.iocoder.yudao.module.freight.service.price;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPricePageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPriceSaveReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;

import java.time.LocalDate;

public interface FreightPriceService {

    Long create(FreightPriceSaveReqVO reqVO);

    void update(FreightPriceSaveReqVO reqVO);

    void updateStatus(Long id, Integer status);

    FreightPriceDO get(Long id);

    PageResult<FreightPriceDO> getPage(FreightPricePageReqVO reqVO);

    FreightPriceDO matchPrice(Integer transportType, String origin, String destination, LocalDate onDate);
}
