package cn.iocoder.yudao.module.freight.service.freight;

import cn.hutool.core.util.StrUtil;
import cn.iocoder.yudao.module.crm.controller.admin.clue.vo.CrmClueSaveReqVO;
import cn.iocoder.yudao.module.crm.service.clue.CrmClueService;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.clue.WebFreightPortalClueCreateReqVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;

@Service
@Validated
public class FreightPortalClueServiceImpl implements FreightPortalClueService {

    private static final Integer PORTAL_CLUE_SOURCE = 11;

    @Resource
    private CrmClueService clueService;

    @Value("${yudao.crm.portal-clue.owner-user-id:143}")
    private Long portalClueOwnerUserId;

    @Override
    public Long createClue(WebFreightPortalClueCreateReqVO createReqVO) {
        CrmClueSaveReqVO crmCreateReqVO = new CrmClueSaveReqVO();
        crmCreateReqVO.setOwnerUserId(portalClueOwnerUserId);
        crmCreateReqVO.setSource(PORTAL_CLUE_SOURCE);
        crmCreateReqVO.setName(createReqVO.getName());
        crmCreateReqVO.setMobile(createReqVO.getMobile());
        crmCreateReqVO.setTelephone(StrUtil.blankToDefault(createReqVO.getTelephone(), createReqVO.getMobile()));
        crmCreateReqVO.setEmail(createReqVO.getEmail());
        crmCreateReqVO.setWechat(createReqVO.getWechat());
        crmCreateReqVO.setQq(createReqVO.getQq());
        crmCreateReqVO.setRemark(StrUtil.trimToNull(createReqVO.getRemark()));
        return clueService.createClue(crmCreateReqVO);
    }

}
