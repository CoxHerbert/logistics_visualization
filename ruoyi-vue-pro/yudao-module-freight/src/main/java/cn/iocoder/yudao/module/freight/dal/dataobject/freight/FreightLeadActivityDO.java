package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
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
    /**
     * 兼容旧表结构：创建来源字符串字段（例如 admin/app）
     */
    private String type;
    private LocalDateTime nextContactTime;
    private Integer creatorType;

}
