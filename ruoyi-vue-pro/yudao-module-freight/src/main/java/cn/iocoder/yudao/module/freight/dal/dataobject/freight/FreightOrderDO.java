package cn.iocoder.yudao.module.freight.dal.dataobject.freight;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@TableName("freight_order")
@KeySequence("freight_order_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class FreightOrderDO extends TenantBaseDO {

    private Long id;
    private String orderNo;
    private Long customerId;
    private String customerName;
    private Long contractId;
    private String contractNo;
    private String contractName;
    private String contactName;
    private String contactPhone;
    private String bizType;
    private String transportMode;
    private String incoterms;
    private String originPort;
    private String destinationPort;
    private String pickupAddress;
    private String deliveryAddress;
    private String carrierName;
    private String cargoName;
    private String hsCode;
    private Integer packageCount;
    private String packageType;
    private BigDecimal grossWeightKg;
    private BigDecimal volumeCbm;
    private String containerInfo;
    private Boolean hasBattery;
    @TableField("is_sensitive")
    private Boolean sensitiveFlag;
    private String customsType;
    private String shippingMark;
    private String deliveryType;
    private String deliveryWarehouseCode;
    private String deliveryWarehouseName;
    private String amazonShipmentId;
    private String amazonReferenceNo;
    private String bookingNo;
    private String soNo;
    private String blNo;
    private String containerNo;
    private String sealNo;
    private String customsNo;
    private LocalDateTime pickupTime;
    private LocalDateTime etd;
    private LocalDateTime eta;
    private LocalDateTime atd;
    private LocalDateTime ata;
    private LocalDateTime signTime;
    private String currency;
    private BigDecimal receivableAmount;
    private BigDecimal payableAmount;
    private BigDecimal profitAmount;
    private String status;
    private Long salesUserId;
    private Long operatorUserId;
    private String remark;
}
