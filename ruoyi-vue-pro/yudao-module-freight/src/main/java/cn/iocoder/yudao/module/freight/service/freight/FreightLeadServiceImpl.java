package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.lead.AdminFreightLeadPageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.lead.AdminFreightLeadUpdateReqVO;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.lead.WebFreightLeadCreateReqVO;
import cn.iocoder.yudao.module.freight.convert.freight.FreightLeadConvert;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightLeadDO;
import cn.iocoder.yudao.module.freight.dal.mysql.freight.FreightLeadMapper;
import cn.iocoder.yudao.module.freight.enums.freight.LeadSourceEnum;
import cn.iocoder.yudao.module.freight.enums.freight.LeadStatusEnum;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.freight.enums.ErrorCodeConstants.FREIGHT_LEAD_NOT_EXISTS;

@Service
@Validated
public class FreightLeadServiceImpl implements FreightLeadService {

    @Resource
    private FreightLeadMapper freightLeadMapper;

    @Override
    public Long createLead(@Valid WebFreightLeadCreateReqVO createReqVO) {
        FreightLeadDO lead = FreightLeadConvert.INSTANCE.convert(createReqVO);
        lead.setContactType("PHONE");
        lead.setStatus(LeadStatusEnum.NEW.getStatus());
        lead.setSource(LeadSourceEnum.WEB.getSource());
        freightLeadMapper.insert(lead);
        return lead.getId();
    }

    @Override
    public PageResult<FreightLeadDO> getLeadPage(AdminFreightLeadPageReqVO pageReqVO) {
        return freightLeadMapper.selectPage(pageReqVO);
    }

    @Override
    public void updateLead(@Valid AdminFreightLeadUpdateReqVO updateReqVO) {
        validateLeadExists(updateReqVO.getId());
        FreightLeadDO updateObj = FreightLeadConvert.INSTANCE.convert(updateReqVO);
        freightLeadMapper.updateById(updateObj);
    }

    @Override
    public FreightLeadDO getLead(Long id) {
        return freightLeadMapper.selectById(id);
    }

    private void validateLeadExists(Long id) {
        if (id == null) {
            return;
        }
        if (freightLeadMapper.selectById(id) == null) {
            throw exception(FREIGHT_LEAD_NOT_EXISTS);
        }
    }

}
