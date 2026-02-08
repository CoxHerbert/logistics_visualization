package cn.iocoder.yudao.module.system.dal.dataobject.freight;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@TableName("freight_lead_activity")
@KeySequence("freight_lead_activity_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightLeadActivityDO extends TenantBaseDO {

    private Long id;
    private Long leadId;
    private String content;
    private LocalDateTime nextContactTime;
    private Integer creatorType;

}
