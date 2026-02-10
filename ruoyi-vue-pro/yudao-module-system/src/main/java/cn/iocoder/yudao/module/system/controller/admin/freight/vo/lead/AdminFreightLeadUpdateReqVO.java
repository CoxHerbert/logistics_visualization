package cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Schema(description = "管理后台 - 货运线索更新 Request VO")
@Data
public class AdminFreightLeadUpdateReqVO {

    @Schema(description = "主键", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "id 不能为空")
    private Long id;

    @Schema(description = "线索状态", requiredMode = Schema.RequiredMode.REQUIRED, example = "20")
    @NotNull(message = "状态不能为空")
    private Integer status;

    @Schema(description = "备注")
    private String remark;

}
