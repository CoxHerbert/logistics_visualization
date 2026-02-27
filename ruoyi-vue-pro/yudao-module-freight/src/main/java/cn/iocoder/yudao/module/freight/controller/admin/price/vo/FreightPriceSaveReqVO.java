package cn.iocoder.yudao.module.freight.controller.admin.price.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "管理后台 - 运价新增/修改 Request VO")
@Data
public class FreightPriceSaveReqVO {

    @Schema(description = "编号，更新时传", example = "1024")
    private Long id;

    @NotNull
    @Schema(description = "运输类型：1海派 2海卡 3整柜 4美森", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Integer transportType;

    @NotBlank
    @Schema(description = "始发地", requiredMode = Schema.RequiredMode.REQUIRED, example = "深圳")
    private String origin;

    @NotBlank
    @Schema(description = "目的地", requiredMode = Schema.RequiredMode.REQUIRED, example = "洛杉矶")
    private String destination;

    @NotNull
    @Schema(description = "计价模式：1按CBM 2按KG 3整柜一口价", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Integer priceMode;

    @NotNull
    @Schema(description = "单价", requiredMode = Schema.RequiredMode.REQUIRED, example = "120.50")
    private BigDecimal unitPrice;

    @NotNull
    @Schema(description = "最低收费", requiredMode = Schema.RequiredMode.REQUIRED, example = "300.00")
    private BigDecimal minPrice;

    @NotBlank
    @Schema(description = "币种", requiredMode = Schema.RequiredMode.REQUIRED, example = "USD")
    private String currency;

    @NotNull
    @Schema(description = "生效日期", requiredMode = Schema.RequiredMode.REQUIRED, example = "2026-01-01")
    private LocalDate validFrom;

    @NotNull
    @Schema(description = "失效日期", requiredMode = Schema.RequiredMode.REQUIRED, example = "2026-12-31")
    private LocalDate validTo;

    @NotNull
    @Schema(description = "状态：0启用 1停用", requiredMode = Schema.RequiredMode.REQUIRED, example = "0")
    private Integer status;

    @Schema(description = "备注", example = "常规周班")
    private String remark;
}
