package cn.iocoder.yudao.module.freight.controller.portal.price;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.freight.controller.portal.price.vo.*;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;
import cn.iocoder.yudao.module.freight.service.price.FreightPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@RestController
@RequestMapping("/portal-api/freight/price")
@Validated
@RequiredArgsConstructor
public class FreightPricePortalController {

    private final FreightPriceService freightPriceService;

    @PostMapping("/calc")
    public CommonResult<FreightPriceCalcRespVO> calc(@Valid @RequestBody FreightPriceCalcReqVO reqVO) {
        LocalDate today = LocalDate.now();
        FreightPriceDO price = freightPriceService.matchPrice(
                reqVO.getTransportType(), reqVO.getOrigin(), reqVO.getDestination(), today
        );
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

        BigDecimal chargeable;
        if (price.getPriceMode() == 1) { // CBM
            chargeable = nz(req.getVolumeCbm());
        } else if (price.getPriceMode() == 2) { // KG
            chargeable = nz(req.getWeightKg());
        } else { // 整柜一口价
            chargeable = BigDecimal.ONE;
        }

        BigDecimal amount = price.getUnitPrice().multiply(chargeable);
        if (price.getMinPrice() != null && amount.compareTo(price.getMinPrice()) < 0) {
            amount = price.getMinPrice();
        }

        resp.setChargeable(chargeable);
        resp.setAmount(amount);
        resp.setNote("报价为系统测算运费，不含税金/查验/超重超尺等附加费，具体以客服确认为准");
        return resp;
    }

    private BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
