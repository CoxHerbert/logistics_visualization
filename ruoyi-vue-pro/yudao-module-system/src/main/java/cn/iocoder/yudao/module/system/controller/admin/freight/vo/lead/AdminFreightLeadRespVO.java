package cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 货运线索 Response VO")
@Data
public class AdminFreightLeadRespVO {

    private Long id;
    private String contactName;
    private String contactPhone;
    private String departureCity;
    private String destinationCity;
    private Integer shipMode;
    private Integer cargoType;
    private Integer status;
    private Integer source;
    private String remark;
    private LocalDateTime createTime;

}
