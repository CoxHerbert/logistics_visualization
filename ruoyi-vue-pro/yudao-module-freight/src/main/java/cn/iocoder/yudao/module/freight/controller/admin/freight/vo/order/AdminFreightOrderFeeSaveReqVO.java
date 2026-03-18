package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Data
public class AdminFreightOrderFeeSaveReqVO {

    private Long id;

    @NotBlank(message = "feeType can not be blank")
    private String feeType;

    @NotBlank(message = "feeName can not be blank")
    private String feeName;

    private String currency;
    private String unitName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String remark;
}
