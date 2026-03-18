package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@TableName("freight_order_fee")
@KeySequence("freight_order_fee_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightOrderFeeDO extends TenantBaseDO {

    private Long id;
    private Long orderId;
    private String feeType;
    private String feeName;
    private String currency;
    private String unitName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private String remark;
}
