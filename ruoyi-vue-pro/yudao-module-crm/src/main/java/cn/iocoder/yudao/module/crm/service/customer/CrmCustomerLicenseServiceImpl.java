package cn.iocoder.yudao.module.crm.service.customer;

import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license.CrmCustomerLicenseSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerLicenseDO;
import cn.iocoder.yudao.module.crm.dal.mysql.customer.CrmCustomerLicenseMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CUSTOMER_LICENSE_NOT_EXISTS;

@Service
@Validated
public class CrmCustomerLicenseServiceImpl implements CrmCustomerLicenseService {

    @Resource
    private CrmCustomerLicenseMapper customerLicenseMapper;
    @Resource
    private CrmCustomerService customerService;

    @Override
    public Long createCustomerLicense(CrmCustomerLicenseSaveReqVO createReqVO) {
        customerService.validateCustomer(createReqVO.getCustomerId());
        CrmCustomerLicenseDO license = BeanUtils.toBean(createReqVO, CrmCustomerLicenseDO.class);
        customerLicenseMapper.insert(license);
        return license.getId();
    }

    @Override
    public void updateCustomerLicense(CrmCustomerLicenseSaveReqVO updateReqVO) {
        validateCustomerLicenseExists(updateReqVO.getId());
        customerService.validateCustomer(updateReqVO.getCustomerId());
        customerLicenseMapper.updateById(BeanUtils.toBean(updateReqVO, CrmCustomerLicenseDO.class));
    }

    @Override
    public void deleteCustomerLicense(Long id) {
        validateCustomerLicenseExists(id);
        customerLicenseMapper.deleteById(id);
    }

    @Override
    public CrmCustomerLicenseDO getCustomerLicense(Long id) {
        return customerLicenseMapper.selectById(id);
    }

    @Override
    public List<CrmCustomerLicenseDO> getCustomerLicenseListByCustomerId(Long customerId) {
        customerService.validateCustomer(customerId);
        return customerLicenseMapper.selectListByCustomerId(customerId);
    }

    private void validateCustomerLicenseExists(Long id) {
        if (customerLicenseMapper.selectById(id) == null) {
            throw exception(CUSTOMER_LICENSE_NOT_EXISTS);
        }
    }
}
