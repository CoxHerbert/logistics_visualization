package cn.iocoder.yudao.module.freight.controller.admin.price;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.*;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;
import cn.iocoder.yudao.module.freight.service.price.FreightPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@RestController
@RequestMapping("/admin-api/freight/price")
@Validated
@RequiredArgsConstructor
public class FreightPriceController {

    private final FreightPriceService freightPriceService;

    @PostMapping("/create")
    public CommonResult<Long> create(@Valid @RequestBody FreightPriceSaveReqVO reqVO) {
        return success(freightPriceService.create(reqVO));
    }

    @PutMapping("/update")
    public CommonResult<Boolean> update(@Valid @RequestBody FreightPriceSaveReqVO reqVO) {
        freightPriceService.update(reqVO);
        return success(true);
    }

    @GetMapping("/get")
    public CommonResult<FreightPriceRespVO> get(@RequestParam("id") Long id) {
        FreightPriceDO data = freightPriceService.get(id);
        if (data == null) return success(null);
        return success(toResp(data));
    }

    @GetMapping("/page")
    public CommonResult<PageResult<FreightPriceRespVO>> page(@Valid FreightPricePageReqVO reqVO) {
        PageResult<FreightPriceDO> page = freightPriceService.getPage(reqVO);
        return success(new PageResult<>(
                page.getList().stream().map(this::toResp).toList(),
                page.getTotal()
        ));
    }

    @PutMapping("/update-status")
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
