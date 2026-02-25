package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.freight.controller.app.freight.vo.activity.AppFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightLeadActivityDO;

import java.util.List;

public interface FreightLeadActivityService {

    Long createLeadActivityByAdmin(AdminFreightLeadActivityCreateReqVO createReqVO);

    Long createLeadActivityByApp(AppFreightLeadActivityCreateReqVO createReqVO);

    List<FreightLeadActivityDO> getLeadActivityList(Long leadId);

}
