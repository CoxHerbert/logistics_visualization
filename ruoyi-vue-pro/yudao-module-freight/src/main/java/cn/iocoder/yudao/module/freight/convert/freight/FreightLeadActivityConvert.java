package cn.iocoder.yudao.module.freight.convert.freight;

import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.activity.AdminFreightLeadActivityRespVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightLeadActivityDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface FreightLeadActivityConvert {

    FreightLeadActivityConvert INSTANCE = Mappers.getMapper(FreightLeadActivityConvert.class);

    FreightLeadActivityDO convert(AdminFreightLeadActivityCreateReqVO bean);


    AdminFreightLeadActivityRespVO convert(FreightLeadActivityDO bean);

    List<AdminFreightLeadActivityRespVO> convertList(List<FreightLeadActivityDO> list);

}
