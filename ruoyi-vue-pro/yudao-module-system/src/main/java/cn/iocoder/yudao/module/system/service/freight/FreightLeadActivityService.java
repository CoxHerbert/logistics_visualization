package cn.iocoder.yudao.module.system.service.freight;

import cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.controller.app.freight.vo.activity.AppFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadActivityDO;

import java.util.List;

public interface FreightLeadActivityService {

    Long createLeadActivityByAdmin(AdminFreightLeadActivityCreateReqVO createReqVO);

    Long createLeadActivityByApp(AppFreightLeadActivityCreateReqVO createReqVO);

    List<FreightLeadActivityDO> getLeadActivityList(Long leadId);

}
