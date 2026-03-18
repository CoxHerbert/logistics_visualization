package cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static cn.iocoder.yudao.framework.common.util.date.DateUtils.FORMAT_YEAR_MONTH_DAY;

@Schema(description = "管理后台 - CRM 客户资质新增/修改 Request VO")
@Data
public class CrmCustomerLicenseSaveReqVO {

    private Long id;

    @NotNull(message = "客户编号不能为空")
    private Long customerId;

    @NotBlank(message = "资质类型不能为空")
    private String licenseType;

    private String licenseNo;
    private String companyName;

    @DateTimeFormat(pattern = FORMAT_YEAR_MONTH_DAY)
    private LocalDate expireDate;

    private String attachmentUrl;
    private String remark;
}
