package cn.iocoder.yudao.module.system.controller.app.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.system.controller.app.freight.vo.activity.AppFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.service.freight.FreightLeadActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 货运线索跟进记录")
@RestController
@RequestMapping("/freight/lead-activity")
@Validated
public class AppFreightLeadActivityController {

    @Resource
    private FreightLeadActivityService freightLeadActivityService;

    @PostMapping("/create")
    @Operation(summary = "创建线索跟进记录")
    public CommonResult<Long> createLeadActivity(@Valid @RequestBody AppFreightLeadActivityCreateReqVO createReqVO) {
        return success(freightLeadActivityService.createLeadActivityByApp(createReqVO));
    }

}
