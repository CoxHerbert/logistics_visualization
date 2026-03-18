package cn.iocoder.yudao.module.crm.dal.dataobject.customer;

import cn.iocoder.yudao.framework.tenant.core.db.TenantBaseDO;
import com.baomidou.mybatisplus.annotation.KeySequence;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@TableName("crm_customer_license")
@KeySequence("crm_customer_license_seq")
@Data
@EqualsAndHashCode(callSuper = true)
public class CrmCustomerLicenseDO extends TenantBaseDO {

    @TableId
    private Long id;

    private Long customerId;
    private String licenseType;
    private String licenseNo;
    private String companyName;
    private LocalDate expireDate;
    private String attachmentUrl;
    private String remark;
}
