package cn.iocoder.yudao.module.freight.controller.web.price.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class FreightPriceCalcReqVO {

    @NotNull
    private Integer transportType;

    @NotBlank
    private String origin;

    @NotBlank
    private String destination;

    /** 体积 CBM（海派/海卡常用） */
    private BigDecimal volumeCbm;

    /** 重量 KG（部分线路用） */
    private BigDecimal weightKg;

    /** 整柜：柜型（20GP/40HQ）可选，先预留 */
    private String containerType;
}
