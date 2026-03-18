package cn.iocoder.yudao.module.crm.controller.admin.customer;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license.CrmCustomerLicenseRespVO;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.license.CrmCustomerLicenseSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerLicenseDO;
import cn.iocoder.yudao.module.crm.service.customer.CrmCustomerLicenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - CRM 客户资质")
@RestController
@RequestMapping("/crm/customer-license")
@Validated
public class CrmCustomerLicenseController {

    @Resource
    private CrmCustomerLicenseService customerLicenseService;

    @PostMapping("/create")
    @Operation(summary = "创建客户资质")
    @PreAuthorize("@ss.hasPermission('crm:customer-license:create')")
    public CommonResult<Long> createCustomerLicense(@Valid @RequestBody CrmCustomerLicenseSaveReqVO createReqVO) {
        return success(customerLicenseService.createCustomerLicense(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新客户资质")
    @PreAuthorize("@ss.hasPermission('crm:customer-license:update')")
    public CommonResult<Boolean> updateCustomerLicense(@Valid @RequestBody CrmCustomerLicenseSaveReqVO updateReqVO) {
        customerLicenseService.updateCustomerLicense(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除客户资质")
    @Parameter(name = "id", required = true)
    @PreAuthorize("@ss.hasPermission('crm:customer-license:delete')")
    public CommonResult<Boolean> deleteCustomerLicense(@RequestParam("id") Long id) {
        customerLicenseService.deleteCustomerLicense(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得客户资质")
    @Parameter(name = "id", required = true)
    @PreAuthorize("@ss.hasPermission('crm:customer-license:query')")
    public CommonResult<CrmCustomerLicenseRespVO> getCustomerLicense(@RequestParam("id") Long id) {
        CrmCustomerLicenseDO license = customerLicenseService.getCustomerLicense(id);
        return success(BeanUtils.toBean(license, CrmCustomerLicenseRespVO.class));
    }

    @GetMapping("/list-by-customer")
    @Operation(summary = "按客户获得资质列表")
    @Parameter(name = "customerId", required = true)
    @PreAuthorize("@ss.hasPermission('crm:customer-license:query')")
    public CommonResult<List<CrmCustomerLicenseRespVO>> getCustomerLicenseListByCustomer(@RequestParam("customerId") Long customerId) {
        List<CrmCustomerLicenseDO> list = customerLicenseService.getCustomerLicenseListByCustomerId(customerId);
        return success(BeanUtils.toBean(list, CrmCustomerLicenseRespVO.class));
    }
}
