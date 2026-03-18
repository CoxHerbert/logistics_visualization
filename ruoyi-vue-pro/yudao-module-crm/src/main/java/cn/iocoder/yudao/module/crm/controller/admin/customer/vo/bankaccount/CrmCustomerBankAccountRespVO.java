package cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Schema(description = "管理后台 - CRM 客户银行账户 Response VO")
@Data
public class CrmCustomerBankAccountRespVO {

    private Long id;
    private Long customerId;
    private String accountName;
    private String bankName;
    private String bankAccountNo;
    private String swiftCode;
    private String currency;
    private Boolean defaultStatus;
    private String remark;
    private LocalDateTime createTime;
}
