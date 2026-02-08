package cn.iocoder.yudao.module.system.controller.admin.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead.AdminFreightLeadPageReqVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead.AdminFreightLeadRespVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead.AdminFreightLeadUpdateReqVO;
import cn.iocoder.yudao.module.system.convert.freight.FreightLeadConvert;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadDO;
import cn.iocoder.yudao.module.system.service.freight.FreightLeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 货运线索")
@RestController("adminFreightLeadController")
@RequestMapping("/freight/lead")
@Validated
public class FreightLeadController {

    @Resource
    private FreightLeadService freightLeadService;

    @GetMapping("/page")
    @Operation(summary = "获得货运线索分页")
    @PreAuthorize("@ss.hasPermission('freight:lead:query')")
    public CommonResult<PageResult<AdminFreightLeadRespVO>> getLeadPage(@Validated AdminFreightLeadPageReqVO pageReqVO) {
        PageResult<FreightLeadDO> pageResult = freightLeadService.getLeadPage(pageReqVO);
        return success(FreightLeadConvert.INSTANCE.convertPage(pageResult));
    }

    @GetMapping("/get")
    @Operation(summary = "获得货运线索详情")
    @Parameter(name = "id", description = "编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('freight:lead:query')")
    public CommonResult<AdminFreightLeadRespVO> getLead(@RequestParam("id") Long id) {
        FreightLeadDO lead = freightLeadService.getLead(id);
        return success(FreightLeadConvert.INSTANCE.convert(lead));
    }

    @PutMapping("/update")
    @Operation(summary = "更新货运线索")
    @PreAuthorize("@ss.hasPermission('freight:lead:update')")
    public CommonResult<Boolean> updateLead(@Valid @RequestBody AdminFreightLeadUpdateReqVO updateReqVO) {
        freightLeadService.updateLead(updateReqVO);
        return success(true);
    }

}
