package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@TableName("freight_lead_activity")
@KeySequence("freight_lead_activity_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightLeadActivityDO extends BaseDO {

    private Long id;
    private Long leadId;
    private String content;
    @TableField(exist = false)
    private LocalDateTime nextContactTime;
    @TableField(exist = false)
    private Integer creatorType;

}
