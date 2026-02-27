package cn.iocoder.yudao.module.freight.controller.admin.price.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FreightPriceRespVO {
    private Long id;
    private Integer transportType;
    private String origin;
    private String destination;
    private Integer priceMode;
    private BigDecimal unitPrice;
    private BigDecimal minPrice;
    private String currency;
    private LocalDate validFrom;
    private LocalDate validTo;
    private Integer status;
    private String remark;
    private LocalDateTime createTime;
}
