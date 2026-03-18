package cn.iocoder.yudao.module.crm.service.receivable;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.ObjUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.collection.CollectionUtils;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.common.util.object.ObjectUtils;
import cn.iocoder.yudao.module.bpm.api.task.BpmProcessInstanceApi;
import cn.iocoder.yudao.module.bpm.api.task.dto.BpmProcessInstanceCreateReqDTO;
import cn.iocoder.yudao.module.crm.controller.admin.receivable.vo.receivable.CrmReceivablePageReqVO;
import cn.iocoder.yudao.module.crm.controller.admin.receivable.vo.receivable.CrmReceivableSaveReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.contract.CrmContractDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.receivable.CrmReceivableDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.receivable.CrmReceivablePlanDO;
import cn.iocoder.yudao.module.crm.dal.mysql.receivable.CrmReceivableMapper;
import cn.iocoder.yudao.module.crm.dal.redis.no.CrmNoRedisDAO;
import cn.iocoder.yudao.module.crm.enums.common.CrmAuditStatusEnum;
import cn.iocoder.yudao.module.crm.enums.common.CrmBizTypeEnum;
import cn.iocoder.yudao.module.crm.enums.permission.CrmPermissionLevelEnum;
import cn.iocoder.yudao.module.crm.framework.permission.core.annotations.CrmPermission;
import cn.iocoder.yudao.module.crm.service.contract.CrmContractService;
import cn.iocoder.yudao.module.crm.service.customer.CrmCustomerBankAccountService;
import cn.iocoder.yudao.module.crm.service.permission.CrmPermissionService;
import cn.iocoder.yudao.module.crm.service.permission.bo.CrmPermissionCreateReqBO;
import cn.iocoder.yudao.module.system.api.user.AdminUserApi;
import com.mzt.logapi.context.LogRecordContext;
import com.mzt.logapi.service.impl.DiffParseFunction;
import com.mzt.logapi.starter.annotation.LogRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CUSTOMER_BANK_ACCOUNT_NOT_BELONG_TO_CUSTOMER;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CUSTOMER_BANK_ACCOUNT_NOT_EXISTS;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_CREATE_FAIL_CONTRACT_NOT_APPROVE;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_CREATE_FAIL_PRICE_EXCEEDS_LIMIT;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_DELETE_FAIL;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_DELETE_FAIL_IS_APPROVE;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_NO_EXISTS;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_NOT_EXISTS;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_PLAN_EXISTS_RECEIVABLE;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_PLAN_NOT_EXISTS;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_SUBMIT_FAIL_NOT_DRAFT;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_UPDATE_AUDIT_STATUS_FAIL_NOT_PROCESS;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.RECEIVABLE_UPDATE_FAIL_EDITING_PROHIBITED;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_CREATE_SUB_TYPE;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_CREATE_SUCCESS;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_DELETE_SUB_TYPE;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_DELETE_SUCCESS;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_SUBMIT_SUB_TYPE;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_SUBMIT_SUCCESS;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_TYPE;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_UPDATE_SUB_TYPE;
import static cn.iocoder.yudao.module.crm.enums.LogRecordConstants.CRM_RECEIVABLE_UPDATE_SUCCESS;
import static cn.iocoder.yudao.module.crm.util.CrmAuditStatusUtils.convertBpmResultToAuditStatus;

/**
 * CRM 回款 Service 实现类
 */
@Service
@Validated
@Slf4j
public class CrmReceivableServiceImpl implements CrmReceivableService {

    public static final String BPM_PROCESS_DEFINITION_KEY = "crm-receivable-audit";

    @Resource
    private CrmReceivableMapper receivableMapper;
    @Resource
    private CrmNoRedisDAO noRedisDAO;
    @Resource
    private CrmContractService contractService;
    @Resource
    private CrmCustomerBankAccountService customerBankAccountService;
    @Resource
    @Lazy
    private CrmReceivablePlanService receivablePlanService;
    @Resource
    private CrmPermissionService permissionService;
    @Resource
    private AdminUserApi adminUserApi;
    @Resource
    private BpmProcessInstanceApi bpmProcessInstanceApi;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @LogRecord(type = CRM_RECEIVABLE_TYPE, subType = CRM_RECEIVABLE_CREATE_SUB_TYPE, bizNo = "{{#receivable.id}}",
            success = CRM_RECEIVABLE_CREATE_SUCCESS)
    public Long createReceivable(CrmReceivableSaveReqVO createReqVO) {
        validateReceivablePriceExceedsLimit(createReqVO);
        validateRelationDataExists(createReqVO);

        String no = noRedisDAO.generate(CrmNoRedisDAO.RECEIVABLE_PREFIX);
        if (receivableMapper.selectByNo(no) != null) {
            throw exception(RECEIVABLE_NO_EXISTS);
        }

        CrmReceivableDO receivable = BeanUtils.toBean(createReqVO, CrmReceivableDO.class)
                .setNo(no).setAuditStatus(CrmAuditStatusEnum.DRAFT.getStatus());
        receivableMapper.insert(receivable);

        permissionService.createPermission(new CrmPermissionCreateReqBO()
                .setBizType(CrmBizTypeEnum.CRM_RECEIVABLE.getType())
                .setBizId(receivable.getId())
                .setUserId(createReqVO.getOwnerUserId())
                .setLevel(CrmPermissionLevelEnum.OWNER.getLevel()));

        if (createReqVO.getPlanId() != null) {
            receivablePlanService.updateReceivablePlanReceivableId(receivable.getPlanId(), receivable.getId());
        }

        LogRecordContext.putVariable("receivable", receivable);
        LogRecordContext.putVariable("period", getReceivablePeriod(receivable.getPlanId()));
        return receivable.getId();
    }

    private void validateReceivablePriceExceedsLimit(CrmReceivableSaveReqVO reqVO) {
        CrmContractDO contract = contractService.validateContract(reqVO.getContractId());
        List<CrmReceivableDO> receivables = receivableMapper.selectListByContractIdAndStatus(reqVO.getContractId(),
                Arrays.asList(CrmAuditStatusEnum.APPROVE.getStatus(), CrmAuditStatusEnum.PROCESS.getStatus()));
        if (reqVO.getId() != null) {
            receivables.removeIf(receivable -> ObjectUtil.equal(receivable.getId(), reqVO.getId()));
        }
        BigDecimal notReceivablePrice = contract.getTotalPrice().subtract(
                CollectionUtils.getSumValue(receivables, CrmReceivableDO::getPrice, BigDecimal::add, BigDecimal.ZERO));
        if (reqVO.getPrice().compareTo(notReceivablePrice) > 0) {
            throw exception(RECEIVABLE_CREATE_FAIL_PRICE_EXCEEDS_LIMIT, notReceivablePrice);
        }
    }

    private void validateRelationDataExists(CrmReceivableSaveReqVO reqVO) {
        if (reqVO.getOwnerUserId() != null) {
            adminUserApi.validateUser(reqVO.getOwnerUserId());
        }
        if (reqVO.getContractId() != null) {
            CrmContractDO contract = contractService.validateContract(reqVO.getContractId());
            if (ObjectUtil.notEqual(contract.getAuditStatus(), CrmAuditStatusEnum.APPROVE.getStatus())) {
                throw exception(RECEIVABLE_CREATE_FAIL_CONTRACT_NOT_APPROVE);
            }
            reqVO.setCustomerId(contract.getCustomerId());
            if (reqVO.getBankAccountId() == null) {
                reqVO.setBankAccountId(contract.getBankAccountId());
                reqVO.setBankAccountName(contract.getBankAccountName());
                reqVO.setBankName(contract.getBankName());
                reqVO.setBankAccountNo(contract.getBankAccountNo());
            }
        }
        if (reqVO.getBankAccountId() != null) {
            CrmCustomerBankAccountDO bankAccount = customerBankAccountService.getCustomerBankAccount(reqVO.getBankAccountId());
            if (bankAccount == null) {
                throw exception(CUSTOMER_BANK_ACCOUNT_NOT_EXISTS);
            }
            if (!bankAccount.getCustomerId().equals(reqVO.getCustomerId())) {
                throw exception(CUSTOMER_BANK_ACCOUNT_NOT_BELONG_TO_CUSTOMER);
            }
            reqVO.setBankAccountName(bankAccount.getAccountName());
            reqVO.setBankName(bankAccount.getBankName());
            reqVO.setBankAccountNo(bankAccount.getBankAccountNo());
        } else {
            reqVO.setBankAccountName(null);
            reqVO.setBankName(null);
            reqVO.setBankAccountNo(null);
        }
        if (reqVO.getPlanId() != null) {
            CrmReceivablePlanDO receivablePlan = receivablePlanService.getReceivablePlan(reqVO.getPlanId());
            if (receivablePlan == null) {
                throw exception(RECEIVABLE_PLAN_NOT_EXISTS);
            }
            if (receivablePlan.getReceivableId() != null
                    && !ObjectUtil.equal(receivablePlan.getReceivableId(), reqVO.getId())) {
                throw exception(RECEIVABLE_PLAN_EXISTS_RECEIVABLE);
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @LogRecord(type = CRM_RECEIVABLE_TYPE, subType = CRM_RECEIVABLE_UPDATE_SUB_TYPE, bizNo = "{{#updateReqVO.id}}",
            success = CRM_RECEIVABLE_UPDATE_SUCCESS)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_RECEIVABLE, bizId = "#updateReqVO.id", level = CrmPermissionLevelEnum.WRITE)
    public void updateReceivable(CrmReceivableSaveReqVO updateReqVO) {
        Assert.notNull(updateReqVO.getId(), "回款编号不能为空");
        updateReqVO.setOwnerUserId(null).setCustomerId(null).setContractId(null).setPlanId(null);

        CrmReceivableDO oldReceivable = validateReceivableExists(updateReqVO.getId());
        updateReqVO.setOwnerUserId(oldReceivable.getOwnerUserId()).setCustomerId(oldReceivable.getCustomerId())
                .setContractId(oldReceivable.getContractId()).setPlanId(oldReceivable.getPlanId());
        validateRelationDataExists(updateReqVO);
        validateReceivablePriceExceedsLimit(updateReqVO);

        if (!ObjectUtils.equalsAny(oldReceivable.getAuditStatus(), CrmAuditStatusEnum.DRAFT.getStatus(),
                CrmAuditStatusEnum.PROCESS.getStatus())) {
            throw exception(RECEIVABLE_UPDATE_FAIL_EDITING_PROHIBITED);
        }

        CrmReceivableDO updateObj = BeanUtils.toBean(updateReqVO, CrmReceivableDO.class);
        receivableMapper.updateById(updateObj);

        updateReqVO.setOwnerUserId(oldReceivable.getOwnerUserId());
        LogRecordContext.putVariable("oldReceivable", oldReceivable);
        LogRecordContext.putVariable("period", getReceivablePeriod(oldReceivable.getPlanId()));
        LogRecordContext.putVariable(DiffParseFunction.OLD_OBJECT, BeanUtils.toBean(oldReceivable, CrmReceivableSaveReqVO.class));
    }

    private Integer getReceivablePeriod(Long planId) {
        if (Objects.isNull(planId)) {
            return null;
        }
        CrmReceivablePlanDO receivablePlan = receivablePlanService.getReceivablePlan(planId);
        return receivablePlan.getPeriod();
    }

    @Override
    public void updateReceivableAuditStatus(Long id, Integer bpmResult) {
        CrmReceivableDO receivable = validateReceivableExists(id);
        if (ObjUtil.notEqual(receivable.getAuditStatus(), CrmAuditStatusEnum.PROCESS.getStatus())) {
            log.error("[updateReceivableAuditStatus][receivable({}) is not in process, bpmResult({})]", receivable.getId(), bpmResult);
            throw exception(RECEIVABLE_UPDATE_AUDIT_STATUS_FAIL_NOT_PROCESS);
        }

        Integer auditStatus = convertBpmResultToAuditStatus(bpmResult);
        receivableMapper.updateById(new CrmReceivableDO().setId(id).setAuditStatus(auditStatus));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @LogRecord(type = CRM_RECEIVABLE_TYPE, subType = CRM_RECEIVABLE_DELETE_SUB_TYPE, bizNo = "{{#id}}",
            success = CRM_RECEIVABLE_DELETE_SUCCESS)
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_RECEIVABLE, bizId = "#id", level = CrmPermissionLevelEnum.OWNER)
    public void deleteReceivable(Long id) {
        CrmReceivableDO receivable = validateReceivableExists(id);
        if (receivable.getPlanId() != null && receivablePlanService.getReceivablePlan(receivable.getPlanId()) != null) {
            throw exception(RECEIVABLE_DELETE_FAIL);
        }
        if (ObjUtil.equal(receivable.getAuditStatus(), CrmAuditStatusEnum.APPROVE.getStatus())) {
            throw exception(RECEIVABLE_DELETE_FAIL_IS_APPROVE);
        }

        receivableMapper.deleteById(id);
        permissionService.deletePermission(CrmBizTypeEnum.CRM_RECEIVABLE.getType(), id);

        LogRecordContext.putVariable("receivable", receivable);
        LogRecordContext.putVariable("period", getReceivablePeriod(receivable.getPlanId()));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @LogRecord(type = CRM_RECEIVABLE_TYPE, subType = CRM_RECEIVABLE_SUBMIT_SUB_TYPE, bizNo = "{{#id}}",
            success = CRM_RECEIVABLE_SUBMIT_SUCCESS)
    public void submitReceivable(Long id, Long userId) {
        CrmReceivableDO receivable = validateReceivableExists(id);
        if (ObjUtil.notEqual(receivable.getAuditStatus(), CrmAuditStatusEnum.DRAFT.getStatus())) {
            throw exception(RECEIVABLE_SUBMIT_FAIL_NOT_DRAFT);
        }

        String processInstanceId = bpmProcessInstanceApi.createProcessInstance(userId, new BpmProcessInstanceCreateReqDTO()
                .setProcessDefinitionKey(BPM_PROCESS_DEFINITION_KEY).setBusinessKey(String.valueOf(id)));

        receivableMapper.updateById(new CrmReceivableDO().setId(id).setProcessInstanceId(processInstanceId)
                .setAuditStatus(CrmAuditStatusEnum.PROCESS.getStatus()));

        LogRecordContext.putVariable("receivableNo", receivable.getNo());
    }

    private CrmReceivableDO validateReceivableExists(Long id) {
        CrmReceivableDO receivable = receivableMapper.selectById(id);
        if (receivable == null) {
            throw exception(RECEIVABLE_NOT_EXISTS);
        }
        return receivable;
    }

    @Override
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_RECEIVABLE, bizId = "#id", level = CrmPermissionLevelEnum.READ)
    public CrmReceivableDO getReceivable(Long id) {
        return receivableMapper.selectById(id);
    }

    @Override
    public List<CrmReceivableDO> getReceivableList(Collection<Long> ids) {
        if (CollUtil.isEmpty(ids)) {
            return ListUtil.empty();
        }
        return receivableMapper.selectByIds(ids);
    }

    @Override
    public PageResult<CrmReceivableDO> getReceivablePage(CrmReceivablePageReqVO pageReqVO, Long userId) {
        return receivableMapper.selectPage(pageReqVO, userId);
    }

    @Override
    @CrmPermission(bizType = CrmBizTypeEnum.CRM_CUSTOMER, bizId = "#pageReqVO.customerId", level = CrmPermissionLevelEnum.READ)
    public PageResult<CrmReceivableDO> getReceivablePageByCustomerId(CrmReceivablePageReqVO pageReqVO) {
        return receivableMapper.selectPageByCustomerId(pageReqVO);
    }

    @Override
    public Long getAuditReceivableCount(Long userId) {
        return receivableMapper.selectCountByAudit(userId);
    }

    @Override
    public Map<Long, BigDecimal> getReceivablePriceMapByContractId(Collection<Long> contractIds) {
        return receivableMapper.selectReceivablePriceMapByContractId(contractIds);
    }

    @Override
    public Long getReceivableCountByContractId(Long contractId) {
        return receivableMapper.selectCountByContractId(contractId);
    }

}
