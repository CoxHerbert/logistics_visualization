package cn.iocoder.yudao.module.freight.controller.admin.price.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - 运价 Response VO")
@Data
public class FreightPriceRespVO {

    @Schema(description = "编号", example = "1024")
    private Long id;

    @Schema(description = "运输类型：1海派 2海卡 3整柜 4美森", example = "1")
    private Integer transportType;

    @Schema(description = "始发地", example = "深圳")
    private String origin;

    @Schema(description = "目的地", example = "洛杉矶")
    private String destination;

    @Schema(description = "计价模式：1按CBM 2按KG 3整柜一口价", example = "1")
    private Integer priceMode;

    @Schema(description = "单价", example = "120.50")
    private BigDecimal unitPrice;

    @Schema(description = "最低收费", example = "300.00")
    private BigDecimal minPrice;

    @Schema(description = "币种", example = "USD")
    private String currency;

    @Schema(description = "生效日期", example = "2026-01-01")
    private LocalDate validFrom;

    @Schema(description = "失效日期", example = "2026-12-31")
    private LocalDate validTo;

    @Schema(description = "状态：0启用 1停用", example = "0")
    private Integer status;

    @Schema(description = "备注", example = "常规周班")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
