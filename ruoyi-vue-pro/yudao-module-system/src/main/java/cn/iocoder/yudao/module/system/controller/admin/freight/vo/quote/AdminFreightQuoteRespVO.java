package cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - 货运报价 Response VO")
@Data
public class AdminFreightQuoteRespVO {

    private Long id;
    private Long leadId;
    private String currency;
    private BigDecimal unitPrice;
    private BigDecimal quantity;
    private BigDecimal surcharge;
    private BigDecimal total;
    private String remark;
    private LocalDateTime createTime;

}
