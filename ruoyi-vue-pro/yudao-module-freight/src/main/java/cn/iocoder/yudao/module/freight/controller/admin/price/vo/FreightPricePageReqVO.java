package cn.iocoder.yudao.module.freight.controller.admin.price.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Schema(description = "管理后台 - 运价分页 Request VO")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightPricePageReqVO extends PageParam {

    @Schema(description = "运输类型：1海派 2海卡 3整柜 4美森", example = "1")
    private Integer transportType;

    @Schema(description = "始发地（模糊匹配）", example = "深圳")
    private String origin;

    @Schema(description = "目的地（模糊匹配）", example = "洛杉矶")
    private String destination;

    @Schema(description = "状态：0启用 1停用", example = "0")
    private Integer status;
}
