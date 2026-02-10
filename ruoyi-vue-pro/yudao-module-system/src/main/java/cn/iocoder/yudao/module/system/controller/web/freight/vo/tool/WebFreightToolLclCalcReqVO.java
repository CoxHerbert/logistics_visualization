package cn.iocoder.yudao.module.system.controller.web.freight.vo.tool;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "Web 端 - 拼箱报价计算 Request VO")
@Data
public class WebFreightToolLclCalcReqVO {

    @Schema(description = "起运港", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "起运港不能为空")
    private String origin;

    @Schema(description = "目的港", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "目的港不能为空")
    private String destination;

    @Schema(description = "体积（CBM）", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "体积不能为空")
    @DecimalMin(value = "0", inclusive = false, message = "体积必须大于 0")
    private BigDecimal volumeCbm;

    @Schema(description = "重量（KG）", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "重量不能为空")
    @DecimalMin(value = "0", inclusive = false, message = "重量必须大于 0")
    private BigDecimal weightKg;

}
