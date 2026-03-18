package cn.iocoder.yudao.module.crm.service.customer;

import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount.CrmCustomerBankAccountSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;
import cn.iocoder.yudao.module.crm.dal.mysql.customer.CrmCustomerBankAccountMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
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

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createCustomerBankAccount(CrmCustomerBankAccountSaveReqVO createReqVO) {
        customerService.validateCustomer(createReqVO.getCustomerId());
        CrmCustomerBankAccountDO bankAccount = BeanUtils.toBean(createReqVO, CrmCustomerBankAccountDO.class);
        normalizeDefaultStatus(bankAccount);
        customerBankAccountMapper.insert(bankAccount);
        return bankAccount.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateCustomerBankAccount(CrmCustomerBankAccountSaveReqVO updateReqVO) {
        validateCustomerBankAccountExists(updateReqVO.getId());
        customerService.validateCustomer(updateReqVO.getCustomerId());
        CrmCustomerBankAccountDO updateObj = BeanUtils.toBean(updateReqVO, CrmCustomerBankAccountDO.class);
        normalizeDefaultStatus(updateObj);
        customerBankAccountMapper.updateById(updateObj);
    }

    @Override
    public void deleteCustomerBankAccount(Long id) {
        validateCustomerBankAccountExists(id);
        customerBankAccountMapper.deleteById(id);
    }

    @Override
    public CrmCustomerBankAccountDO getCustomerBankAccount(Long id) {
        return customerBankAccountMapper.selectById(id);
    }

    @Override
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
