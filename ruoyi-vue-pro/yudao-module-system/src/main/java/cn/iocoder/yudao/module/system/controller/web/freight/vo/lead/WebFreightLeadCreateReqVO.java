package cn.iocoder.yudao.module.system.controller.web.freight.vo.lead;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Schema(description = "Web 端 - 货运线索创建 Request VO")
@Data
public class WebFreightLeadCreateReqVO {

    @Schema(description = "联系人", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "联系人不能为空")
    private String contactName;

    @Schema(description = "联系电话", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "联系电话不能为空")
    private String contactPhone;

    @Schema(description = "出发地")
    private String departureCity;

    @Schema(description = "目的地")
    private String destinationCity;

    @Schema(description = "运输方式", requiredMode = Schema.RequiredMode.REQUIRED, example = "10")
    @NotNull(message = "运输方式不能为空")
    private Integer shipMode;

    @Schema(description = "货物类型", requiredMode = Schema.RequiredMode.REQUIRED, example = "10")
    @NotNull(message = "货物类型不能为空")
    private Integer cargoType;

    @Schema(description = "备注")
    private String remark;

}
