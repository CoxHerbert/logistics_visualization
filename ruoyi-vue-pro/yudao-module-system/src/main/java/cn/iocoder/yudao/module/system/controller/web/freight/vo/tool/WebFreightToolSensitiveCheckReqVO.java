package cn.iocoder.yudao.module.system.controller.web.freight.vo.tool;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Schema(description = "Web 端 - 敏感品检查 Request VO")
@Data
public class WebFreightToolSensitiveCheckReqVO {

    @Schema(description = "货物描述", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "货物描述不能为空")
    private String cargoDesc;

}
