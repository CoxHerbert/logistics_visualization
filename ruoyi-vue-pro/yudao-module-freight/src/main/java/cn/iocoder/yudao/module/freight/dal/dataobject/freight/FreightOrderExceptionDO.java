package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@TableName("freight_order_exception")
@KeySequence("freight_order_exception_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightOrderExceptionDO extends TenantBaseDO {

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
}
