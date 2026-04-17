package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
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
public class FreightQuoteDO extends BaseDO {

    private Long id;

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
