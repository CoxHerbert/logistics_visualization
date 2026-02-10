package cn.iocoder.yudao.module.system.service.freight.tool;

import cn.hutool.core.util.StrUtil;
import cn.iocoder.yudao.module.infra.api.config.ConfigApi;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolCalcRespVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolFclCalcReqVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolLclCalcReqVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolSensitiveCheckReqVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class FreightToolCalcServiceImpl implements FreightToolCalcService {

    private static final String KEY_LCL_RATE_PER_CBM = "freight.tool.lcl.ratePerCbm";
    private static final String KEY_LCL_RATE_PER_KG = "freight.tool.lcl.ratePerKg";
    private static final String KEY_LCL_DOC_FEE = "freight.tool.lcl.docFee";

    private static final String KEY_FCL_RATE_PER_CONTAINER = "freight.tool.fcl.ratePerContainer";
    private static final String KEY_FCL_DOC_FEE = "freight.tool.fcl.docFee";
    private static final String KEY_SENSITIVE_WORDS = "freight.tool.sensitive.words";

    @Resource
    private ConfigApi configApi;

    @Override
    public WebFreightToolCalcRespVO calcLcl(WebFreightToolLclCalcReqVO reqVO) {
        BigDecimal ratePerCbm = getDecimalConfig(KEY_LCL_RATE_PER_CBM, new BigDecimal("420"));
        BigDecimal ratePerKg = getDecimalConfig(KEY_LCL_RATE_PER_KG, new BigDecimal("1.2"));
        BigDecimal docFee = getDecimalConfig(KEY_LCL_DOC_FEE, new BigDecimal("80"));

        BigDecimal oceanByVolume = reqVO.getVolumeCbm().multiply(ratePerCbm);
        BigDecimal oceanByWeight = reqVO.getWeightKg().multiply(ratePerKg);
        BigDecimal oceanFreight = oceanByVolume.max(oceanByWeight);

        List<WebFreightToolCalcRespVO.CostItem> costs = new ArrayList<>();
        costs.add(cost("Ocean Freight", oceanFreight));
        costs.add(cost("Documentation", docFee));

        WebFreightToolCalcRespVO respVO = new WebFreightToolCalcRespVO();
        respVO.setCostBreakdown(costs);
        respVO.setTotal(oceanFreight.add(docFee));
        respVO.setNotes(List.of(
                "LCL pricing is estimated by max(volume*ratePerCbm, weight*ratePerKg)",
                String.format("Route: %s -> %s", reqVO.getOrigin(), reqVO.getDestination())
        ));
        return respVO;
    }

    @Override
    public WebFreightToolCalcRespVO calcFcl(WebFreightToolFclCalcReqVO reqVO) {
        BigDecimal ratePerContainer = getDecimalConfig(KEY_FCL_RATE_PER_CONTAINER, new BigDecimal("1200"));
        BigDecimal docFee = getDecimalConfig(KEY_FCL_DOC_FEE, new BigDecimal("120"));

        BigDecimal oceanFreight = reqVO.getContainerCount().multiply(ratePerContainer);
        List<WebFreightToolCalcRespVO.CostItem> costs = new ArrayList<>();
        costs.add(cost("Ocean Freight", oceanFreight));
        costs.add(cost("Documentation", docFee));

        WebFreightToolCalcRespVO respVO = new WebFreightToolCalcRespVO();
        respVO.setCostBreakdown(costs);
        respVO.setTotal(oceanFreight.add(docFee));
        respVO.setNotes(List.of(
                String.format("Container: %s x %s", reqVO.getContainerType(), reqVO.getContainerCount()),
                String.format("Route: %s -> %s", reqVO.getOrigin(), reqVO.getDestination())
        ));
        return respVO;
    }

    @Override
    public WebFreightToolCalcRespVO checkSensitive(WebFreightToolSensitiveCheckReqVO reqVO) {
        String configWords = configApi.getConfigValueByKey(KEY_SENSITIVE_WORDS);
        List<String> words = StrUtil.isBlank(configWords)
                ? List.of("battery", "powder", "liquid", "magnet")
                : StrUtil.split(configWords, ',');

        String cargo = reqVO.getCargoDesc().toLowerCase(Locale.ROOT);
        List<String> matched = words.stream()
                .map(String::trim)
                .filter(StrUtil::isNotBlank)
                .filter(word -> cargo.contains(word.toLowerCase(Locale.ROOT)))
                .toList();

        WebFreightToolCalcRespVO respVO = new WebFreightToolCalcRespVO();
        respVO.setCostBreakdown(List.of(cost("Matched Words", BigDecimal.valueOf(matched.size()))));
        respVO.setTotal(BigDecimal.ZERO);
        respVO.setNotes(matched.isEmpty()
                ? List.of("No obvious sensitive words detected")
                : List.of("Sensitive words detected: " + String.join(",", matched)));
        return respVO;
    }

    private WebFreightToolCalcRespVO.CostItem cost(String name, BigDecimal amount) {
        WebFreightToolCalcRespVO.CostItem item = new WebFreightToolCalcRespVO.CostItem();
        item.setName(name);
        item.setAmount(amount);
        return item;
    }

    private BigDecimal getDecimalConfig(String key, BigDecimal defaultValue) {
        String value = configApi.getConfigValueByKey(key);
        if (StrUtil.isBlank(value)) {
            return defaultValue;
        }
        try {
            return new BigDecimal(value.trim());
        } catch (Exception ignored) {
            return defaultValue;
        }
    }

}
