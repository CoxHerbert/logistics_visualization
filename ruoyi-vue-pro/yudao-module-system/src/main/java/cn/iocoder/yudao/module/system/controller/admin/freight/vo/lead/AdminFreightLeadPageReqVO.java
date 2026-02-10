package cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

import static cn.iocoder.yudao.framework.common.util.date.DateUtils.FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND;

@Schema(description = "管理后台 - 货运线索分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
public class AdminFreightLeadPageReqVO extends PageParam {

    @Schema(description = "线索状态", example = "10")
    private Integer status;

    @Schema(description = "联系电话（模糊匹配）", example = "138")
    private String contactPhone;

    @Schema(description = "创建时间", example = "[2025-01-01 00:00:00, 2025-01-31 23:59:59]")
    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY_HOUR_MINUTE_SECOND)
    private LocalDateTime[] createTime;

}
