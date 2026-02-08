package cn.iocoder.yudao.module.system.controller.web.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.servlet.ServletUtils;
import cn.iocoder.yudao.framework.tenant.core.aop.TenantIgnore;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.lead.WebFreightLeadCreateReqVO;
import cn.iocoder.yudao.module.system.service.freight.FreightLeadAntiBrushService;
import cn.iocoder.yudao.module.system.service.freight.FreightLeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.annotation.security.PermitAll;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;
import static cn.iocoder.yudao.module.system.enums.ErrorCodeConstants.FREIGHT_LEAD_SUBMIT_TOO_FAST;

@Tag(name = "Web 端 - 货运线索")
@RestController
@RequestMapping("/freight/lead")
@Validated
public class FreightLeadController {

    @Resource
    private FreightLeadService freightLeadService;
    @Resource
    private FreightLeadAntiBrushService freightLeadAntiBrushService;

    @PostMapping("/create")
    @Operation(summary = "创建货运线索")
    @PermitAll
    @TenantIgnore
    public CommonResult<Long> createLead(@Valid @RequestBody WebFreightLeadCreateReqVO createReqVO) {
        String clientIp = ServletUtils.getClientIP();
        if (freightLeadAntiBrushService.isLimited(clientIp, createReqVO.getContactPhone())) {
            throw exception(FREIGHT_LEAD_SUBMIT_TOO_FAST);
        }
        return success(freightLeadService.createLead(createReqVO));
    }

}
