package cn.iocoder.yudao.module.system.controller.app.freight.vo.activity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Schema(description = "用户 App - 线索跟进记录创建 Request VO")
@Data
public class AppFreightLeadActivityCreateReqVO {

    @Schema(description = "线索编号", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    @NotNull(message = "线索编号不能为空")
    private Long leadId;

    @Schema(description = "跟进内容", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "跟进内容不能为空")
    private String content;

    @Schema(description = "下次联系时间")
    private LocalDateTime nextContactTime;

}
