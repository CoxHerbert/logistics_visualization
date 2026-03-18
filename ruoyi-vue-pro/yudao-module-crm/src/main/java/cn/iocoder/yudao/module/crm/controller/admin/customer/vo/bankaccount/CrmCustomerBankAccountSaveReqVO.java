package cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Schema(description = "管理后台 - CRM 客户银行账户新增/修改 Request VO")
@Data
public class CrmCustomerBankAccountSaveReqVO {

    private Long id;

    @NotNull(message = "客户编号不能为空")
    private Long customerId;

    @NotBlank(message = "户名不能为空")
    private String accountName;

    @NotBlank(message = "开户行不能为空")
    private String bankName;

    @NotBlank(message = "银行账号不能为空")
    private String bankAccountNo;

    private String swiftCode;
    private String currency;
    private Boolean defaultStatus;
    private String remark;
}
