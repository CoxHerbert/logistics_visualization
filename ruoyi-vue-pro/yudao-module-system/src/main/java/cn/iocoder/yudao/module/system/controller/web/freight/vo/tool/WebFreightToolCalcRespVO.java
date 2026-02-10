package cn.iocoder.yudao.module.system.controller.web.freight.vo.tool;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "Web 端 - 工具计算 Response VO")
@Data
public class WebFreightToolCalcRespVO {

    @Schema(description = "费用明细")
    private List<CostItem> costBreakdown;

    @Schema(description = "总价")
    private BigDecimal total;

    @Schema(description = "备注")
    private List<String> notes;

    @Data
    public static class CostItem {
        private String name;
        private BigDecimal amount;
    }

}
