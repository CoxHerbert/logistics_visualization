package cn.iocoder.yudao.module.system.dal.dataobject.freight;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import cn.iocoder.yudao.module.system.enums.freight.CargoTypeEnum;
import cn.iocoder.yudao.module.system.enums.freight.LeadSourceEnum;
import cn.iocoder.yudao.module.system.enums.freight.LeadStatusEnum;
import cn.iocoder.yudao.module.system.enums.freight.ShipModeEnum;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 货运线索 DO
 */
@TableName("freight_lead")
@KeySequence("freight_lead_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightLeadDO extends TenantBaseDO {

    private Long id;

    /** 联系人 */
    private String contactName;
    /** 联系电话 */
    private String contactPhone;
    /** 出发地 */
    private String departureCity;
    /** 目的地 */
    private String destinationCity;

    /** 枚举 {@link ShipModeEnum} */
    private Integer shipMode;
    /** 枚举 {@link CargoTypeEnum} */
    private Integer cargoType;
    /** 枚举 {@link LeadStatusEnum} */
    private Integer status;
    /** 枚举 {@link LeadSourceEnum} */
    private Integer source;

    private String remark;

}
