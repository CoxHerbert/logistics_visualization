package cn.iocoder.yudao.module.freight.dal.dataobject.price;

import cn.iocoder.yudao.framework.mybatis.core.dataobject.BaseDO;
import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@TableName("freight_price")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FreightPriceDO extends BaseDO {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 租户编号
     */
    private Long tenantId;

    /** 运输类型：1海派 2海卡 3整柜 4美森 */
    private Integer transportType;

    private String origin;
    private String destination;

    /** 计价模式：1按CBM 2按KG 3整柜一口价 */
    private Integer priceMode;

    /** 单价（对应 priceMode） */
    private BigDecimal unitPrice;

    /** 最低收费 */
    private BigDecimal minPrice;

    /** 币种 */
    private String currency;

    private LocalDate validFrom;
    private LocalDate validTo;

    /** 状态：0启用 1停用 */
    private Integer status;

    private String remark;
}
