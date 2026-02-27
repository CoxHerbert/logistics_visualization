package cn.iocoder.yudao.module.freight.controller.web.price;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.tenant.core.aop.TenantIgnore;
import cn.iocoder.yudao.module.freight.controller.web.price.vo.FreightPriceCalcReqVO;
import cn.iocoder.yudao.module.freight.controller.web.price.vo.FreightPriceCalcRespVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;
import cn.iocoder.yudao.module.freight.service.price.FreightPriceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.PermitAll;
import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "Web 端 - 货运价格")
@RestController
@RequestMapping("/freight/price")
@Validated
@RequiredArgsConstructor
public class FreightPricePortalController {

    private final FreightPriceService freightPriceService;

    @PostMapping("/calc")
    @Operation(summary = "运价测算")
    @PermitAll
    @TenantIgnore
    public CommonResult<FreightPriceCalcRespVO> calc(@Valid @RequestBody FreightPriceCalcReqVO reqVO) {
        FreightPriceDO price = freightPriceService.matchPrice(
                reqVO.getTransportType(), reqVO.getOrigin(), reqVO.getDestination(), LocalDate.now());
        if (price == null) {
            return success(null);
        }
        return success(calcAmount(price, reqVO));
    }

    private FreightPriceCalcRespVO calcAmount(FreightPriceDO price, FreightPriceCalcReqVO req) {
        FreightPriceCalcRespVO resp = new FreightPriceCalcRespVO();
        resp.setPriceId(price.getId());
        resp.setTransportType(price.getTransportType());
        resp.setPriceMode(price.getPriceMode());
        resp.setCurrency(price.getCurrency());
        resp.setUnitPrice(price.getUnitPrice());
        resp.setMinPrice(price.getMinPrice());

        BigDecimal chargeable = price.getPriceMode() == 1 ? nz(req.getVolumeCbm())
                : price.getPriceMode() == 2 ? nz(req.getWeightKg()) : BigDecimal.ONE;

        BigDecimal amount = price.getUnitPrice().multiply(chargeable);
        if (price.getMinPrice() != null && amount.compareTo(price.getMinPrice()) < 0) {
            amount = price.getMinPrice();
        }
        resp.setChargeable(chargeable);
        resp.setAmount(amount);
        resp.setNote("报价为系统测算运费，不含税金/查验/超重超尺等附加费，具体以客服确认为准");
        return resp;
    }

    private BigDecimal nz(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

}
