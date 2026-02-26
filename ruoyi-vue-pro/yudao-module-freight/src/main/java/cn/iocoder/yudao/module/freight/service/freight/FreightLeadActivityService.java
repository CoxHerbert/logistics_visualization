package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightLeadActivityDO;

import javax.validation.Valid;
import java.util.List;

public interface FreightLeadActivityService {

    Long createLeadActivityByAdmin(@Valid AdminFreightLeadActivityCreateReqVO createReqVO);


    List<FreightLeadActivityDO> getLeadActivityList(Long leadId);

}
