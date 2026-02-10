package cn.iocoder.yudao.module.system.controller.web.freight.vo.tool;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "Web 端 - 整箱报价计算 Request VO")
@Data
public class WebFreightToolFclCalcReqVO {

    @Schema(description = "起运港", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "起运港不能为空")
    private String origin;

    @Schema(description = "目的港", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "目的港不能为空")
    private String destination;

    @Schema(description = "箱型", requiredMode = Schema.RequiredMode.REQUIRED, example = "40HQ")
    @NotBlank(message = "箱型不能为空")
    private String containerType;

    @Schema(description = "箱量", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "箱量不能为空")
    @DecimalMin(value = "0", inclusive = false, message = "箱量必须大于 0")
    private BigDecimal containerCount;

}
