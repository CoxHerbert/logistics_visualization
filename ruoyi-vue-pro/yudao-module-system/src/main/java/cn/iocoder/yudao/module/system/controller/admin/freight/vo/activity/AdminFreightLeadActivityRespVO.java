package cn.iocoder.yudao.module.system.controller.admin.freight.vo.activity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - 线索跟进记录 Response VO")
@Data
public class AdminFreightLeadActivityRespVO {

    private Long id;
    private Long leadId;
    private String content;
    private LocalDateTime nextContactTime;
    private Integer creatorType;
    private String creator;
    private LocalDateTime createTime;

}
