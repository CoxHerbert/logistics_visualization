package cn.iocoder.yudao.module.system.controller.admin.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote.AdminFreightQuoteCreateReqVO;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote.AdminFreightQuoteRespVO;
import cn.iocoder.yudao.module.system.convert.freight.FreightQuoteConvert;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightQuoteDO;
import cn.iocoder.yudao.module.system.service.freight.FreightQuoteService;
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

@Tag(name = "管理后台 - 货运报价")
@RestController
@RequestMapping("/freight/quote")
@Validated
public class FreightQuoteController {

    @Resource
    private FreightQuoteService freightQuoteService;

    @PostMapping("/create")
    @Operation(summary = "创建报价")
    @PreAuthorize("@ss.hasPermission('freight:quote:create')")
    public CommonResult<Long> createQuote(@Valid @RequestBody AdminFreightQuoteCreateReqVO createReqVO) {
        return success(freightQuoteService.createQuote(createReqVO));
    }

    @GetMapping("/get")
    @Operation(summary = "获得报价详情")
    @Parameter(name = "id", description = "报价编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('freight:quote:query')")
    public CommonResult<AdminFreightQuoteRespVO> getQuote(@RequestParam("id") Long id) {
        FreightQuoteDO quote = freightQuoteService.getQuote(id);
        return success(FreightQuoteConvert.INSTANCE.convert(quote));
    }

    @GetMapping("/list-by-lead")
    @Operation(summary = "按线索获得报价列表")
    @Parameter(name = "leadId", description = "线索编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('freight:quote:query')")
    public CommonResult<List<AdminFreightQuoteRespVO>> getQuoteListByLeadId(@RequestParam("leadId") Long leadId) {
        List<FreightQuoteDO> list = freightQuoteService.getQuoteListByLeadId(leadId);
        return success(FreightQuoteConvert.INSTANCE.convertList(list));
    }

}
