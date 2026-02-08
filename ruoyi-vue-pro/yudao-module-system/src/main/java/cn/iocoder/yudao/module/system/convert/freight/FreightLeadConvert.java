package cn.iocoder.yudao.module.system.convert.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead.AdminFreightLeadRespVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead.AdminFreightLeadUpdateReqVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.lead.WebFreightLeadCreateReqVO;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface FreightLeadConvert {

    FreightLeadConvert INSTANCE = Mappers.getMapper(FreightLeadConvert.class);

    FreightLeadDO convert(WebFreightLeadCreateReqVO bean);

    FreightLeadDO convert(AdminFreightLeadUpdateReqVO bean);

    AdminFreightLeadRespVO convert(FreightLeadDO bean);

    PageResult<AdminFreightLeadRespVO> convertPage(PageResult<FreightLeadDO> page);

}
