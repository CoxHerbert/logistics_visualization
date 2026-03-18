package cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "管理后台 - CRM 客户资质 Response VO")
@Data
public class CrmCustomerLicenseRespVO {

    private Long id;
    private Long customerId;
    private String licenseType;
    private String licenseNo;
    private String companyName;
    private LocalDate expireDate;
    private String attachmentUrl;
    private String remark;
    private LocalDateTime createTime;
}
