package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Schema(description = "管理后台 - 国际货代业务单状态流转 Request VO")
@Data
public class AdminFreightOrderUpdateStatusReqVO {

    @NotNull(message = "编号不能为空")
    private Long id;

    @NotBlank(message = "目标状态不能为空")
    private String toStatus;

    private String remark;
}
