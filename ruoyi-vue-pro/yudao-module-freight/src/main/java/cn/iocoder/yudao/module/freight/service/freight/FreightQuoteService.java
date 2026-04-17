package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.quote.AdminFreightQuoteCreateReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightQuoteDO;

public interface FreightQuoteService {

    Long createQuote(AdminFreightQuoteCreateReqVO createReqVO);

    FreightQuoteDO getQuote(Long id);

}
