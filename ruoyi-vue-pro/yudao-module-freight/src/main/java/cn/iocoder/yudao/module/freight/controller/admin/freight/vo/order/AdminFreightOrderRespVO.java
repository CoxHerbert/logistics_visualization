package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - 国际货代业务单 Response VO")
@Data
public class AdminFreightOrderRespVO {

    private Long id;
    private String orderNo;
    private Long customerId;
    private String customerName;
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
    private Boolean sensitive;
    private String customsType;
    private String shippingMark;
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
    private LocalDateTime createTime;
}
