package cn.iocoder.yudao.module.freight.controller.web.freight.vo.clue;

import cn.iocoder.yudao.framework.common.validation.Mobile;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Schema(description = "门户端 - 货运线索创建 Request VO")
@Data
public class WebFreightPortalClueCreateReqVO {

    @Schema(description = "名称", requiredMode = Schema.RequiredMode.REQUIRED, example = "宁波雷之声")
    @NotEmpty(message = "名称不能为空")
    @Size(max = 255, message = "名称长度不能超过 255 个字符")
    private String name;

    @Schema(description = "手机号", requiredMode = Schema.RequiredMode.REQUIRED, example = "15824223890")
    @NotEmpty(message = "手机号不能为空")
    @Mobile
    private String mobile;

    @Schema(description = "电话", example = "15824223890")
    private String telephone;

    @Schema(description = "邮箱", example = "coxherbert98@gmail.com")
    @Email(message = "邮箱格式不正确")
    @Size(max = 255, message = "邮箱长度不能超过 255 个字符")
    private String email;

    @Schema(description = "微信", example = "15824223890")
    @Size(max = 255, message = "微信长度不能超过 255 个字符")
    private String wechat;

    @Schema(description = "QQ", example = "15867533754")
    @Size(max = 20, message = "QQ 长度不能超过 20 个字符")
    private String qq;

    @Schema(description = "备注", example = "需要提供 FBA 头程报价")
    @Size(max = 500, message = "备注长度不能超过 500 个字符")
    private String remark;

}
