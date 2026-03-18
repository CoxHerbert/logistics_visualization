package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminFreightOrderLogRespVO {

    private Long id;
    private Long orderId;
    private String actionType;
    private String fromStatus;
    private String toStatus;
    private Long operatorId;
    private String operatorName;
    private String content;
    private LocalDateTime createTime;
}
