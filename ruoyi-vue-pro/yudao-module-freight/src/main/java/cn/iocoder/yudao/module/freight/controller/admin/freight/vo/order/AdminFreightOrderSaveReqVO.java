package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - 国际货代业务单新增/修改 Request VO")
@Data
public class AdminFreightOrderSaveReqVO {

    private Long id;

    @NotNull(message = "客户不能为空")
    private Long customerId;

    private String customerName;

    private String contactName;
    private String contactPhone;
    @NotBlank(message = "业务类型不能为空")
    private String bizType;
    @NotBlank(message = "运输方式不能为空")
    private String transportMode;
    private String incoterms;
    @NotBlank(message = "起运港不能为空")
    private String originPort;
    @NotBlank(message = "目的港不能为空")
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
    private Long salesUserId;
    private Long operatorUserId;
    private String remark;
}
