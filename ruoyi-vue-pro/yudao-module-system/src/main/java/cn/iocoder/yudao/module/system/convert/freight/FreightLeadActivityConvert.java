package cn.iocoder.yudao.module.system.convert.freight;

import cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity.AdminFreightLeadActivityRespVO;
import cn.iocoder.yudao.module.system.controller.app.freight.vo.activity.AppFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadActivityDO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface FreightLeadActivityConvert {

    FreightLeadActivityConvert INSTANCE = Mappers.getMapper(FreightLeadActivityConvert.class);

    FreightLeadActivityDO convert(AdminFreightLeadActivityCreateReqVO bean);

    FreightLeadActivityDO convert(AppFreightLeadActivityCreateReqVO bean);

    AdminFreightLeadActivityRespVO convert(FreightLeadActivityDO bean);

    List<AdminFreightLeadActivityRespVO> convertList(List<FreightLeadActivityDO> list);

}
