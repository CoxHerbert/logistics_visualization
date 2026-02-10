package cn.iocoder.yudao.module.system.dal.dataobject.freight;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 货运报价 DO
 */
@TableName("freight_quote")
@KeySequence("freight_quote_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightQuoteDO extends TenantBaseDO {

    private Long id;

    /** 线索编号 */
    private Long leadId;

    /** 币种 */
    private String currency;

    /** 单价 */
    private BigDecimal unitPrice;

    /** 数量 */
    private BigDecimal quantity;

    /** 附加费 */
    private BigDecimal surcharge;

    /** 总价 */
    private BigDecimal total;

    /** 备注 */
    private String remark;

}
