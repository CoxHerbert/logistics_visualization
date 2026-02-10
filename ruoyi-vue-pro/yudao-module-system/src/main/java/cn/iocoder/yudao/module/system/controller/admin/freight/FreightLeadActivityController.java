package cn.iocoder.yudao.module.system.controller.admin.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity.AdminFreightLeadActivityCreateReqVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity.AdminFreightLeadActivityRespVO;
import cn.iocoder.yudao.module.system.convert.freight.FreightLeadActivityConvert;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadActivityDO;
import cn.iocoder.yudao.module.system.service.freight.FreightLeadActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 货运线索跟进记录")
@RestController
@RequestMapping("/freight/lead-activity")
@Validated
public class FreightLeadActivityController {

    @Resource
    private FreightLeadActivityService freightLeadActivityService;

    @GetMapping("/list")
    @Operation(summary = "获得线索跟进记录列表")
    @Parameter(name = "leadId", description = "线索编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('freight:lead-activity:query')")
    public CommonResult<List<AdminFreightLeadActivityRespVO>> getLeadActivityList(@RequestParam("leadId") Long leadId) {
        List<FreightLeadActivityDO> list = freightLeadActivityService.getLeadActivityList(leadId);
        return success(FreightLeadActivityConvert.INSTANCE.convertList(list));
    }

    @PostMapping("/create")
    @Operation(summary = "创建线索跟进记录")
    @PreAuthorize("@ss.hasPermission('freight:lead-activity:create')")
    public CommonResult<Long> createLeadActivity(@Valid @RequestBody AdminFreightLeadActivityCreateReqVO createReqVO) {
        return success(freightLeadActivityService.createLeadActivityByAdmin(createReqVO));
    }

}
