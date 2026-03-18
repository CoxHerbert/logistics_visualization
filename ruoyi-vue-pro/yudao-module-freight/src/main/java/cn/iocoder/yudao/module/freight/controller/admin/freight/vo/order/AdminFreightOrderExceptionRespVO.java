package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminFreightOrderExceptionRespVO {

    private Long id;
    private Long orderId;
    private String exceptionType;
    private String exceptionStage;
    private String severity;
    private String title;
    private String content;
    private String solution;
    private Long responsibleUserId;
    private LocalDateTime occurTime;
    private Boolean closed;
    private LocalDateTime closedTime;
    private LocalDateTime createTime;
}
