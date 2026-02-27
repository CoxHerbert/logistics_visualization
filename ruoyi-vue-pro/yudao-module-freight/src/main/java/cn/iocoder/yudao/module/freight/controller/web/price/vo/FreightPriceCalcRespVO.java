package cn.iocoder.yudao.module.freight.controller.web.price.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FreightPriceCalcRespVO {

    private Long priceId;
    private Integer transportType;
    private Integer priceMode;
    private String currency;

    private BigDecimal unitPrice;
    private BigDecimal minPrice;

    /** 计费量（CBM/KG/1） */
    private BigDecimal chargeable;

    /** 运费金额（不含税/杂费） */
    private BigDecimal amount;

    private String note;
}
