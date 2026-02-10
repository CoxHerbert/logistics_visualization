package cn.iocoder.yudao.module.system.service.freight;

import cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote.AdminFreightQuoteCreateReqVO;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightQuoteDO;

import java.util.List;

public interface FreightQuoteService {

    Long createQuote(AdminFreightQuoteCreateReqVO createReqVO);

    FreightQuoteDO getQuote(Long id);

    List<FreightQuoteDO> getQuoteListByLeadId(Long leadId);

}
