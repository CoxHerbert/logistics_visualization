package cn.iocoder.yudao.module.freight.controller.admin.price.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FreightPriceSaveReqVO {

    private Long id;

    @NotNull
    private Integer transportType;

    @NotBlank
    private String origin;

    @NotBlank
    private String destination;

    @NotNull
    private Integer priceMode;

    @NotNull
    private BigDecimal unitPrice;

    @NotNull
    private BigDecimal minPrice;

    @NotBlank
    private String currency;

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validTo;

    @NotNull
    private Integer status;

    private String remark;
}
