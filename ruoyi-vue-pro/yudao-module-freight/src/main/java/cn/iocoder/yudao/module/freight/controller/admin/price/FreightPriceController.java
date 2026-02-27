package cn.iocoder.yudao.module.freight.controller.admin.price;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPricePageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPriceRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPriceSaveReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;
import cn.iocoder.yudao.module.freight.service.price.FreightPriceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.stream.Collectors;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 运价管理")
@RestController
@RequestMapping("/admin-api/freight/price")
@Validated
@RequiredArgsConstructor
public class FreightPriceController {

    private final FreightPriceService freightPriceService;

    @PostMapping("/create")
    @Operation(summary = "创建运价")
    @PreAuthorize("@ss.hasPermission('freight:price:create')")
    public CommonResult<Long> create(@Valid @RequestBody FreightPriceSaveReqVO reqVO) {
        return success(freightPriceService.create(reqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新运价")
    @PreAuthorize("@ss.hasPermission('freight:price:update')")
    public CommonResult<Boolean> update(@Valid @RequestBody FreightPriceSaveReqVO reqVO) {
        freightPriceService.update(reqVO);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得运价详情")
    @Parameter(name = "id", description = "编号", required = true, example = "1")
    @PreAuthorize("@ss.hasPermission('freight:price:query')")
    public CommonResult<FreightPriceRespVO> get(@RequestParam("id") Long id) {
        FreightPriceDO data = freightPriceService.get(id);
        if (data == null) {
            return success(null);
        }
        return success(toResp(data));
    }

    @GetMapping("/page")
    @Operation(summary = "获得运价分页")
    @PreAuthorize("@ss.hasPermission('freight:price:query')")
    public CommonResult<PageResult<FreightPriceRespVO>> page(@Valid FreightPricePageReqVO reqVO) {
        PageResult<FreightPriceDO> page = freightPriceService.getPage(reqVO);
        return success(new PageResult<>(
                page.getList().stream().map(this::toResp).collect(Collectors.toList()),
                page.getTotal()
        ));
    }

    @PutMapping("/update-status")
    @Operation(summary = "更新运价状态")
    @PreAuthorize("@ss.hasPermission('freight:price:update')")
    public CommonResult<Boolean> updateStatus(@RequestParam("id") Long id,
                                              @RequestParam("status") Integer status) {
        freightPriceService.updateStatus(id, status);
        return success(true);
    }

    private FreightPriceRespVO toResp(FreightPriceDO d) {
        FreightPriceRespVO vo = new FreightPriceRespVO();
        vo.setId(d.getId());
        vo.setTransportType(d.getTransportType());
        vo.setOrigin(d.getOrigin());
        vo.setDestination(d.getDestination());
        vo.setPriceMode(d.getPriceMode());
        vo.setUnitPrice(d.getUnitPrice());
        vo.setMinPrice(d.getMinPrice());
        vo.setCurrency(d.getCurrency());
        vo.setValidFrom(d.getValidFrom());
        vo.setValidTo(d.getValidTo());
        vo.setStatus(d.getStatus());
        vo.setRemark(d.getRemark());
        vo.setCreateTime(d.getCreateTime());
        return vo;
    }
}
