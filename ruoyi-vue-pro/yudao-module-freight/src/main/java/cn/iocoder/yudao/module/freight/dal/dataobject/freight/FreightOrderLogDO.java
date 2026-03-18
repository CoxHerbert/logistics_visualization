package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@TableName("freight_order_log")
@KeySequence("freight_order_log_seq")
@Data
public class FreightOrderLogDO {

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
