package cn.iocoder.yudao.module.crm.service.customer;

import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount.CrmCustomerBankAccountSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.permission.CrmPermissionDO;
import cn.iocoder.yudao.module.crm.dal.mysql.customer.CrmCustomerBankAccountMapper;
import cn.iocoder.yudao.module.crm.enums.common.CrmBizTypeEnum;
import cn.iocoder.yudao.module.crm.enums.permission.CrmPermissionLevelEnum;
import cn.iocoder.yudao.module.crm.framework.permission.core.annotations.CrmPermission;
import cn.iocoder.yudao.module.crm.service.permission.CrmPermissionService;
import cn.iocoder.yudao.module.crm.service.permission.bo.CrmPermissionCreateReqBO;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CUSTOMER_BANK_ACCOUNT_NOT_EXISTS;

@Service
@Validated
public class CrmCustomerBankAccountServiceImpl implements CrmCustomerBankAccountService {

    @Resource
    private CrmCustomerBankAccountMapper customerBankAccountMapper;
    @Resource
    private CrmCustomerService customerService;
    @Resource
    @Lazy
    private CrmPermissionService permissionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER, bizId = "#createReqVO.customerId", level = CrmPermissionLevelEnum.WRITE)
    public Long createCustomerBankAccount(CrmCustomerBankAccountSaveReqVO createReqVO) {
        customerService.validateCustomer(createReqVO.getCustomerId());
        CrmCustomerBankAccountDO bankAccount = BeanUtils.toBean(createReqVO, CrmCustomerBankAccountDO.class);
        normalizeDefaultStatus(bankAccount);
        customerBankAccountMapper.insert(bankAccount);
        List<CrmPermissionDO> customerPermissions = permissionService.getPermissionListByBiz(
                CrmBizTypeEnum.CRM_CUSTOMER.getType(), createReqVO.getCustomerId());
        List<CrmPermissionCreateReqBO> createReqBOs = new ArrayList<>();
        customerPermissions.forEach(item -> createReqBOs.add(new CrmPermissionCreateReqBO()
                .setBizType(CrmBizTypeEnum.CRM_CUSTOMER_BANK_ACCOUNT.getType())
                .setBizId(bankAccount.getId())
                .setUserId(item.getUserId())
                .setLevel(item.getLevel())));
        permissionService.createPermissionBatch(createReqBOs);
        return bankAccount.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER_BANK_ACCOUNT, bizId = "#updateReqVO.id", level = CrmPermissionLevelEnum.WRITE)
    public void updateCustomerBankAccount(CrmCustomerBankAccountSaveReqVO updateReqVO) {
        validateCustomerBankAccountExists(updateReqVO.getId());
        customerService.validateCustomer(updateReqVO.getCustomerId());
        CrmCustomerBankAccountDO updateObj = BeanUtils.toBean(updateReqVO, CrmCustomerBankAccountDO.class);
        normalizeDefaultStatus(updateObj);
        customerBankAccountMapper.updateById(updateObj);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER_BANK_ACCOUNT, bizId = "#id", level = CrmPermissionLevelEnum.OWNER)
    public void deleteCustomerBankAccount(Long id) {
        validateCustomerBankAccountExists(id);
        customerBankAccountMapper.deleteById(id);
        permissionService.deletePermission(CrmBizTypeEnum.CRM_CUSTOMER_BANK_ACCOUNT.getType(), id);
    }

    @Override
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER_BANK_ACCOUNT, bizId = "#id", level = CrmPermissionLevelEnum.READ)
    public CrmCustomerBankAccountDO getCustomerBankAccount(Long id) {
        return customerBankAccountMapper.selectById(id);
    }

    @Override
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER, bizId = "#customerId", level = CrmPermissionLevelEnum.READ)
    public List<CrmCustomerBankAccountDO> getCustomerBankAccountListByCustomerId(Long customerId) {
        customerService.validateCustomer(customerId);
        return customerBankAccountMapper.selectListByCustomerId(customerId);
    }

    private void normalizeDefaultStatus(CrmCustomerBankAccountDO bankAccount) {
        if (bankAccount.getDefaultStatus() == null) {
            bankAccount.setDefaultStatus(Boolean.FALSE);
        }
    }

    private void validateCustomerBankAccountExists(Long id) {
        if (customerBankAccountMapper.selectById(id) == null) {
            throw exception(CUSTOMER_BANK_ACCOUNT_NOT_EXISTS);
        }
    }
}
