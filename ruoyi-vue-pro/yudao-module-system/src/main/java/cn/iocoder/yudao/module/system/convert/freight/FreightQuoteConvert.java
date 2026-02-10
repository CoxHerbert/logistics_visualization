package cn.iocoder.yudao.module.system.convert.freight;

import cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote.AdminFreightQuoteCreateReqVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote.AdminFreightQuoteRespVO;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightQuoteDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface FreightQuoteConvert {

    FreightQuoteConvert INSTANCE = Mappers.getMapper(FreightQuoteConvert.class);

    FreightQuoteDO convert(AdminFreightQuoteCreateReqVO bean);

    AdminFreightQuoteRespVO convert(FreightQuoteDO bean);

    List<AdminFreightQuoteRespVO> convertList(List<FreightQuoteDO> list);

}
