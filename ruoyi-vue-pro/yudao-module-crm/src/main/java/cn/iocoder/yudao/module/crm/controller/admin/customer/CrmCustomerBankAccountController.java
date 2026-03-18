package cn.iocoder.yudao.module.crm.controller.admin.customer;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount.CrmCustomerBankAccountRespVO;
import cn.iocoder.yudao.module.crm.controller.admin.customer.vo.bankaccount.CrmCustomerBankAccountSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;
import cn.iocoder.yudao.module.crm.service.customer.CrmCustomerBankAccountService;
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

@Tag(name = "管理后台 - CRM 客户银行账户")
@RestController
@RequestMapping("/crm/customer-bank-account")
@Validated
public class CrmCustomerBankAccountController {

    @Resource
    private CrmCustomerBankAccountService customerBankAccountService;

    @PostMapping("/create")
    @Operation(summary = "创建客户银行账户")
    @PreAuthorize("@ss.hasPermission('crm:customer-bank-account:create')")
    public CommonResult<Long> createCustomerBankAccount(@Valid @RequestBody CrmCustomerBankAccountSaveReqVO createReqVO) {
        return success(customerBankAccountService.createCustomerBankAccount(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新客户银行账户")
    @PreAuthorize("@ss.hasPermission('crm:customer-bank-account:update')")
    public CommonResult<Boolean> updateCustomerBankAccount(@Valid @RequestBody CrmCustomerBankAccountSaveReqVO updateReqVO) {
        customerBankAccountService.updateCustomerBankAccount(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除客户银行账户")
    @Parameter(name = "id", required = true)
    @PreAuthorize("@ss.hasPermission('crm:customer-bank-account:delete')")
    public CommonResult<Boolean> deleteCustomerBankAccount(@RequestParam("id") Long id) {
        customerBankAccountService.deleteCustomerBankAccount(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得客户银行账户")
    @Parameter(name = "id", required = true)
    @PreAuthorize("@ss.hasPermission('crm:customer-bank-account:query')")
    public CommonResult<CrmCustomerBankAccountRespVO> getCustomerBankAccount(@RequestParam("id") Long id) {
        CrmCustomerBankAccountDO bankAccount = customerBankAccountService.getCustomerBankAccount(id);
        return success(BeanUtils.toBean(bankAccount, CrmCustomerBankAccountRespVO.class));
    }

    @GetMapping("/list-by-customer")
    @Operation(summary = "按客户获得银行账户列表")
    @Parameter(name = "customerId", required = true)
    @PreAuthorize("@ss.hasPermission('crm:customer-bank-account:query')")
    public CommonResult<List<CrmCustomerBankAccountRespVO>> getCustomerBankAccountListByCustomer(@RequestParam("customerId") Long customerId) {
        List<CrmCustomerBankAccountDO> list = customerBankAccountService.getCustomerBankAccountListByCustomerId(customerId);
        return success(BeanUtils.toBean(list, CrmCustomerBankAccountRespVO.class));
    }
}
