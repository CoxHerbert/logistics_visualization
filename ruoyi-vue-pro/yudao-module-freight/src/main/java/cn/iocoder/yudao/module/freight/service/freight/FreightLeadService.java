package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.lead.AdminFreightLeadPageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.lead.AdminFreightLeadUpdateReqVO;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.lead.WebFreightLeadCreateReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightLeadDO;

public interface FreightLeadService {

    Long createLead(WebFreightLeadCreateReqVO createReqVO);

    PageResult<FreightLeadDO> getLeadPage(AdminFreightLeadPageReqVO pageReqVO);

    void updateLead(AdminFreightLeadUpdateReqVO updateReqVO);

    FreightLeadDO getLead(Long id);

}
