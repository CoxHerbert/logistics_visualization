package cn.iocoder.yudao.module.crm.service.customer;

import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount.CrmCustomerBankAccountSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;

import javax.validation.Valid;
import java.util.List;

public interface CrmCustomerBankAccountService {

    Long createCustomerBankAccount(@Valid CrmCustomerBankAccountSaveReqVO createReqVO);

    void updateCustomerBankAccount(@Valid CrmCustomerBankAccountSaveReqVO updateReqVO);

    void deleteCustomerBankAccount(Long id);

    CrmCustomerBankAccountDO getCustomerBankAccount(Long id);

    List<CrmCustomerBankAccountDO> getCustomerBankAccountListByCustomerId(Long customerId);
}
