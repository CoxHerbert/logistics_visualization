package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class AdminFreightOrderExceptionSaveReqVO {

    private Long id;

    @NotNull(message = "orderId can not be null")
    private Long orderId;

    @NotBlank(message = "exceptionType can not be blank")
    private String exceptionType;

    private String exceptionStage;
    private String severity;

    @NotBlank(message = "title can not be blank")
    private String title;

    private String content;
    private String solution;
    private Long responsibleUserId;
    private LocalDateTime occurTime;
    private Boolean closed;
    private LocalDateTime closedTime;
}
