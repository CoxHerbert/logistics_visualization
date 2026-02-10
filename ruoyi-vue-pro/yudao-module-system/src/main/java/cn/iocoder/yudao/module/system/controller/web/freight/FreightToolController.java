package cn.iocoder.yudao.module.system.controller.web.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.tenant.core.aop.TenantIgnore;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolCalcRespVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolFclCalcReqVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolLclCalcReqVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolSensitiveCheckReqVO;
import cn.iocoder.yudao.module.system.service.freight.tool.FreightToolCalcService;
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

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "Web 端 - 货运工具")
@RestController
@RequestMapping("/freight/tool")
@Validated
public class FreightToolController {

    @Resource
    private FreightToolCalcService freightToolCalcService;

    @PostMapping("/lcl/calc")
    @Operation(summary = "拼箱工具计算")
    @PermitAll
    @TenantIgnore
    public CommonResult<WebFreightToolCalcRespVO> calcLcl(@Valid @RequestBody WebFreightToolLclCalcReqVO reqVO) {
        return success(freightToolCalcService.calcLcl(reqVO));
    }

    @PostMapping("/fcl/calc")
    @Operation(summary = "整箱工具计算")
    @PermitAll
    @TenantIgnore
    public CommonResult<WebFreightToolCalcRespVO> calcFcl(@Valid @RequestBody WebFreightToolFclCalcReqVO reqVO) {
        return success(freightToolCalcService.calcFcl(reqVO));
    }

    @PostMapping("/sensitive/check")
    @Operation(summary = "敏感品检测")
    @PermitAll
    @TenantIgnore
    public CommonResult<WebFreightToolCalcRespVO> checkSensitive(@Valid @RequestBody WebFreightToolSensitiveCheckReqVO reqVO) {
        return success(freightToolCalcService.checkSensitive(reqVO));
    }

}
