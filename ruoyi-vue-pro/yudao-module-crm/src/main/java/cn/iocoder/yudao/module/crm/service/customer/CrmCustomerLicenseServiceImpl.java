package cn.iocoder.yudao.module.crm.service.customer;

import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license.CrmCustomerLicenseSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerLicenseDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.permission.CrmPermissionDO;
import cn.iocoder.yudao.module.crm.dal.mysql.customer.CrmCustomerLicenseMapper;
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
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CUSTOMER_LICENSE_NOT_EXISTS;

@Service
@Validated
public class CrmCustomerLicenseServiceImpl implements CrmCustomerLicenseService {

    @Resource
    private CrmCustomerLicenseMapper customerLicenseMapper;
    @Resource
    private CrmCustomerService customerService;
    @Resource
    @Lazy
    private CrmPermissionService permissionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER, bizId = "#createReqVO.customerId", level = CrmPermissionLevelEnum.WRITE)
    public Long createCustomerLicense(CrmCustomerLicenseSaveReqVO createReqVO) {
        customerService.validateCustomer(createReqVO.getCustomerId());
        CrmCustomerLicenseDO license = BeanUtils.toBean(createReqVO, CrmCustomerLicenseDO.class);
        customerLicenseMapper.insert(license);
        List<CrmPermissionDO> customerPermissions = permissionService.getPermissionListByBiz(
                CrmBizTypeEnum.CRM_CUSTOMER.getType(), createReqVO.getCustomerId());
        List<CrmPermissionCreateReqBO> createReqBOs = new ArrayList<>();
        customerPermissions.forEach(item -> createReqBOs.add(new CrmPermissionCreateReqBO()
                .setBizType(CrmBizTypeEnum.CRM_CUSTOMER_LICENSE.getType())
                .setBizId(license.getId())
                .setUserId(item.getUserId())
                .setLevel(item.getLevel())));
        permissionService.createPermissionBatch(createReqBOs);
        return license.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER_LICENSE, bizId = "#updateReqVO.id", level = CrmPermissionLevelEnum.WRITE)
    public void updateCustomerLicense(CrmCustomerLicenseSaveReqVO updateReqVO) {
        validateCustomerLicenseExists(updateReqVO.getId());
        customerService.validateCustomer(updateReqVO.getCustomerId());
        customerLicenseMapper.updateById(BeanUtils.toBean(updateReqVO, CrmCustomerLicenseDO.class));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER_LICENSE, bizId = "#id", level = CrmPermissionLevelEnum.OWNER)
    public void deleteCustomerLicense(Long id) {
        validateCustomerLicenseExists(id);
        customerLicenseMapper.deleteById(id);
        permissionService.deletePermission(CrmBizTypeEnum.CRM_CUSTOMER_LICENSE.getType(), id);
    }

    @Override
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER_LICENSE, bizId = "#id", level = CrmPermissionLevelEnum.READ)
    public CrmCustomerLicenseDO getCustomerLicense(Long id) {
        return customerLicenseMapper.selectById(id);
    }

    @Override
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER, bizId = "#customerId", level = CrmPermissionLevelEnum.READ)
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
