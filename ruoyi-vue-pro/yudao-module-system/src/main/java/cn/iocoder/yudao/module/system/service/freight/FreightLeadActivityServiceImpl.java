package cn.iocoder.yudao.module.system.service.freight;

import cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.controller.app.freight.vo.activity.AppFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.convert.freight.FreightLeadActivityConvert;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadActivityDO;
import cn.iocoder.yudao.module.system.dal.mysql.freight.FreightLeadActivityMapper;
import cn.iocoder.yudao.module.system.dal.mysql.freight.FreightLeadMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.FREIGHT_LEAD_NOT_EXISTS;

@Service
@Validated
public class FreightLeadActivityServiceImpl implements FreightLeadActivityService {

    private static final Integer CREATOR_TYPE_ADMIN = 1;
    private static final Integer CREATOR_TYPE_APP = 2;

    @Resource
    private FreightLeadMapper freightLeadMapper;
    @Resource
    private FreightLeadActivityMapper freightLeadActivityMapper;

    @Override
    public Long createLeadActivityByAdmin(@Valid AdminFreightLeadActivityCreateReqVO createReqVO) {
        FreightLeadActivityDO activity = FreightLeadActivityConvert.INSTANCE.convert(createReqVO);
        return createLeadActivity(activity, CREATOR_TYPE_ADMIN);
    }

    @Override
    public Long createLeadActivityByApp(@Valid AppFreightLeadActivityCreateReqVO createReqVO) {
        FreightLeadActivityDO activity = FreightLeadActivityConvert.INSTANCE.convert(createReqVO);
        return createLeadActivity(activity, CREATOR_TYPE_APP);
    }

    @Override
    public List<FreightLeadActivityDO> getLeadActivityList(Long leadId) {
        return freightLeadActivityMapper.selectListByLeadId(leadId);
    }

    private Long createLeadActivity(FreightLeadActivityDO activity, Integer creatorType) {
        validateLeadExists(activity.getLeadId());
        activity.setCreatorType(creatorType);
        freightLeadActivityMapper.insert(activity);
        return activity.getId();
    }

    private void validateLeadExists(Long leadId) {
        if (freightLeadMapper.selectById(leadId) == null) {
            throw exception(FREIGHT_LEAD_NOT_EXISTS);
        }
    }

}
