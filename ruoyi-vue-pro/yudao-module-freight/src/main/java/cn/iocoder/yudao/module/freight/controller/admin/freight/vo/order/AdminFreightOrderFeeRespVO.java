package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdminFreightOrderFeeRespVO {

    private Long id;
    private Long orderId;
    private String feeType;
    private String feeName;
    private String currency;
    private String unitName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String remark;
}
