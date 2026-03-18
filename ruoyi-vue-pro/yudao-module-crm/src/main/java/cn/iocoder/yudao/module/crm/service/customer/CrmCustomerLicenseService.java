package cn.iocoder.yudao.module.crm.service.customer;

import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license.CrmCustomerLicenseSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerLicenseDO;

import javax.validation.Valid;
import java.util.List;

public interface CrmCustomerLicenseService {

    Long createCustomerLicense(@Valid CrmCustomerLicenseSaveReqVO createReqVO);

    void updateCustomerLicense(@Valid CrmCustomerLicenseSaveReqVO updateReqVO);

    void deleteCustomerLicense(Long id);

    CrmCustomerLicenseDO getCustomerLicense(Long id);

    List<CrmCustomerLicenseDO> getCustomerLicenseListByCustomerId(Long customerId);
}
