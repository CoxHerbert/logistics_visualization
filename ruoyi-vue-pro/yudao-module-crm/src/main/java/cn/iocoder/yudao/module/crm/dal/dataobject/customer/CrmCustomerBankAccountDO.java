package cn.iocoder.yudao.module.crm.dal.dataobject.customer;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@TableName("crm_customer_bank_account")
@KeySequence("crm_customer_bank_account_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class CrmCustomerBankAccountDO extends TenantBaseDO {

    @TableId
    private Long id;

    private Long customerId;
    private String accountName;
    private String bankName;
    private String bankAccountNo;
    private String swiftCode;
    private String currency;
    @TableField("is_default")
    private Boolean defaultStatus;
    private String remark;
}
