package cn.iocoder.yudao.module.system.controller.admin.freight.vo.quote;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "管理后台 - 货运报价创建 Request VO")
@Data
public class AdminFreightQuoteCreateReqVO {

    @Schema(description = "线索编号", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "线索编号不能为空")
    private Long leadId;

    @Schema(description = "币种", requiredMode = Schema.RequiredMode.REQUIRED, example = "USD")
    @NotBlank(message = "币种不能为空")
    private String currency;

    @Schema(description = "单价", requiredMode = Schema.RequiredMode.REQUIRED, example = "100.50")
    @NotNull(message = "单价不能为空")
    @DecimalMin(value = "0", inclusive = false, message = "单价必须大于 0")
    private BigDecimal unitPrice;

    @Schema(description = "数量", requiredMode = Schema.RequiredMode.REQUIRED, example = "2")
    @NotNull(message = "数量不能为空")
    @DecimalMin(value = "0", inclusive = false, message = "数量必须大于 0")
    private BigDecimal quantity;

    @Schema(description = "附加费", example = "10")
    @DecimalMin(value = "0", message = "附加费不能小于 0")
    private BigDecimal surcharge;

    @Schema(description = "备注")
    private String remark;

}
