package cn.iocoder.yudao.module.crm.service.permission;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjUtil;
import cn.iocoder.yudao.framework.common.util.collection.CollectionUtils;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.crm.controller.admin.permission.vo.CrmPermissionSaveReqVO;
import cn.iocoder.yudao.module.crm.controller.admin.permission.vo.CrmPermissionUpdateReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.business.CrmBusinessDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.contact.CrmContactDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.contract.CrmContractDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerLicenseDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.permission.CrmPermissionDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.receivable.CrmReceivableDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.receivable.CrmReceivablePlanDO;
import cn.iocoder.yudao.module.crm.dal.mysql.customer.CrmCustomerBankAccountMapper;
import cn.iocoder.yudao.module.crm.dal.mysql.customer.CrmCustomerLicenseMapper;
import cn.iocoder.yudao.module.crm.dal.mysql.permission.CrmPermissionMapper;
import cn.iocoder.yudao.module.crm.dal.mysql.receivable.CrmReceivableMapper;
import cn.iocoder.yudao.module.crm.dal.mysql.receivable.CrmReceivablePlanMapper;
import cn.iocoder.yudao.module.crm.enums.common.CrmBizTypeEnum;
import cn.iocoder.yudao.module.crm.enums.permission.CrmPermissionLevelEnum;
import cn.iocoder.yudao.module.crm.framework.permission.core.annotations.CrmPermission;
import cn.iocoder.yudao.module.crm.service.business.CrmBusinessService;
import cn.iocoder.yudao.module.crm.service.contact.CrmContactService;
import cn.iocoder.yudao.module.crm.service.contract.CrmContractService;
import cn.iocoder.yudao.module.crm.service.permission.bo.CrmPermissionCreateReqBO;
import cn.iocoder.yudao.module.crm.service.permission.bo.CrmPermissionTransferReqBO;
import cn.iocoder.yudao.module.crm.util.CrmPermissionUtils;
import cn.iocoder.yudao.module.system.api.user.AdminUserApi;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.framework.common.util.collection.CollectionUtils.anyMatch;
import static cn.iocoder.yudao.framework.common.util.collection.CollectionUtils.convertSet;
import static cn.iocoder.yudao.framework.common.util.collection.CollectionUtils.findFirst;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_CREATE_FAIL;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_DELETE_DENIED;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_DELETE_FAIL;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_DELETE_SELF_PERMISSION_FAIL_EXIST_OWNER;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_DENIED;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_MODEL_TRANSFER_FAIL_OWNER_USER_EXISTS;
import static cn.iocoder.yudao.module.crm.enums.ErrorCodeConstants.CRM_PERMISSION_NOT_EXISTS;
import static cn.iocoder.yudao.module.crm.enums.permission.CrmPermissionLevelEnum.isOwner;

@Service
@Validated
public class CrmPermissionServiceImpl implements CrmPermissionService {

    @Resource
    private CrmPermissionMapper permissionMapper;
    @Resource
    @Lazy
    private CrmContactService contactService;
    @Resource
    @Lazy
    private CrmBusinessService businessService;
    @Resource
    @Lazy
    private CrmContractService contractService;
    @Resource
    private CrmCustomerBankAccountMapper customerBankAccountMapper;
    @Resource
    private CrmCustomerLicenseMapper customerLicenseMapper;
    @Resource
    private CrmReceivableMapper receivableMapper;
    @Resource
    private CrmReceivablePlanMapper receivablePlanMapper;
    @Resource
    private AdminUserApi adminUserApi;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CrmPermission(bizTypeValue = "#reqVO.bizType", bizId = "#reqVO.bizId", level = CrmPermissionLevelEnum.OWNER)
    public void createPermission(CrmPermissionSaveReqVO reqVO, Long userId) {
        createPermission0(BeanUtils.toBean(reqVO, CrmPermissionCreateReqBO.class));
        if (CollUtil.isEmpty(reqVO.getToBizTypes())) {
            return;
        }
        List<CrmPermissionCreateReqBO> createPermissions = new ArrayList<>();
        buildContactPermissions(reqVO, userId, createPermissions);
        buildBusinessPermissions(reqVO, userId, createPermissions);
        buildContractPermissions(reqVO, userId, createPermissions);
        buildCustomerBankAccountPermissions(reqVO, createPermissions);
        buildCustomerLicensePermissions(reqVO, createPermissions);
        buildReceivablePlanPermissions(reqVO, createPermissions);
        buildReceivablePermissions(reqVO, createPermissions);
        if (CollUtil.isEmpty(createPermissions)) {
            return;
        }
        createPermissionBatch(createPermissions);
    }

    private void buildContactPermissions(CrmPermissionSaveReqVO reqVO, Long userId,
                                         List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_CONTACT.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmContactDO> contactList =
                contactService.getContactListByCustomerIdOwnerUserId(reqVO.getBizId(), userId);
        contactList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), item.getName(), createPermissions));
    }

    private void buildBusinessPermissions(CrmPermissionSaveReqVO reqVO, Long userId,
                                          List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_BUSINESS.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmBusinessDO> businessList =
                businessService.getBusinessListByCustomerIdOwnerUserId(reqVO.getBizId(), userId);
        businessList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), item.getName(), createPermissions));
    }

    private void buildContractPermissions(CrmPermissionSaveReqVO reqVO, Long userId,
                                          List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_CONTRACT.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmContractDO> contractList =
                contractService.getContractListByCustomerIdOwnerUserId(reqVO.getBizId(), userId);
        contractList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), item.getName(), createPermissions));
    }

    private void buildCustomerBankAccountPermissions(CrmPermissionSaveReqVO reqVO,
                                                     List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_CUSTOMER_BANK_ACCOUNT.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmCustomerBankAccountDO> bankAccountList =
                customerBankAccountMapper.selectListByCustomerId(reqVO.getBizId());
        bankAccountList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), item.getAccountName(), createPermissions));
    }

    private void buildCustomerLicensePermissions(CrmPermissionSaveReqVO reqVO,
                                                 List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_CUSTOMER_LICENSE.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmCustomerLicenseDO> licenseList =
                customerLicenseMapper.selectListByCustomerId(reqVO.getBizId());
        licenseList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), item.getLicenseNo(), createPermissions));
    }

    private void buildReceivablePlanPermissions(CrmPermissionSaveReqVO reqVO,
                                                List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_RECEIVABLE_PLAN.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmReceivablePlanDO> planList =
                receivablePlanMapper.selectListByCustomerId(reqVO.getBizId());
        planList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), "PLAN-" + item.getPeriod(), createPermissions));
    }

    private void buildReceivablePermissions(CrmPermissionSaveReqVO reqVO,
                                            List<CrmPermissionCreateReqBO> createPermissions) {
        Integer type = CrmBizTypeEnum.CRM_RECEIVABLE.getType();
        if (!reqVO.getToBizTypes().contains(type)) {
            return;
        }
        List<CrmReceivableDO> receivableList =
                receivableMapper.selectListByCustomerId(reqVO.getBizId());
        receivableList.forEach(item ->
                createBizTypePermissions(reqVO, type, item.getId(), item.getNo(), createPermissions));
    }

    private void createBizTypePermissions(CrmPermissionSaveReqVO reqVO, Integer type, Long bizId, String name,
                                          List<CrmPermissionCreateReqBO> createPermissions) {
        CrmPermissionDO permission = hasAnyPermission(type, bizId, reqVO.getUserId());
        if (ObjUtil.isNotNull(permission)) {
            if (!ObjUtil.equal(permission.getLevel(), reqVO.getLevel())) {
                permissionMapper.updateById(new CrmPermissionDO()
                        .setId(permission.getId())
                        .setLevel(reqVO.getLevel()));
            }
            return;
        }
        createPermissions.add(new CrmPermissionCreateReqBO()
                .setBizType(type)
                .setBizId(bizId)
                .setUserId(reqVO.getUserId())
                .setLevel(reqVO.getLevel()));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createPermission(CrmPermissionCreateReqBO createReqBO) {
        return createPermission0(createReqBO);
    }

    private Long createPermission0(CrmPermissionCreateReqBO createReqBO) {
        validatePermissionNotExists(Collections.singletonList(createReqBO));
        adminUserApi.validateUserList(Collections.singletonList(createReqBO.getUserId()));
        CrmPermissionDO permission = BeanUtils.toBean(createReqBO, CrmPermissionDO.class);
        permissionMapper.insert(permission);
        return permission.getId();
    }

    @Override
    public void createPermissionBatch(List<CrmPermissionCreateReqBO> createReqBOs) {
        validatePermissionNotExists(createReqBOs);
        adminUserApi.validateUserList(convertSet(createReqBOs, CrmPermissionCreateReqBO::getUserId));
        List<CrmPermissionDO> permissions = BeanUtils.toBean(createReqBOs, CrmPermissionDO.class);
        permissionMapper.insertBatch(permissions);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePermission(CrmPermissionUpdateReqVO updateReqVO) {
        validatePermissionExists(updateReqVO.getIds());
        List<CrmPermissionDO> updateList = CollectionUtils.convertList(updateReqVO.getIds(),
                id -> new CrmPermissionDO().setId(id).setLevel(updateReqVO.getLevel()));
        permissionMapper.updateBatch(updateList);
    }

    private void validatePermissionExists(Collection<Long> ids) {
        List<CrmPermissionDO> permissionList = permissionMapper.selectByIds(ids);
        if (ObjUtil.notEqual(permissionList.size(), ids.size())) {
            throw exception(CRM_PERMISSION_NOT_EXISTS);
        }
    }

    private void validatePermissionNotExists(Collection<CrmPermissionCreateReqBO> createReqBOs) {
        if (CollUtil.isEmpty(createReqBOs)) {
            return;
        }
        Set<Integer> bizTypes = convertSet(createReqBOs, CrmPermissionCreateReqBO::getBizType);
        Set<Long> bizIds = convertSet(createReqBOs, CrmPermissionCreateReqBO::getBizId);
        Set<Long> userIds = convertSet(createReqBOs, CrmPermissionCreateReqBO::getUserId);
        Long count = permissionMapper.selectListByBiz(bizTypes, bizIds, userIds);
        if (count > 0) {
            throw exception(CRM_PERMISSION_CREATE_FAIL);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void transferPermission(CrmPermissionTransferReqBO transferReqBO) {
        CrmPermissionDO oldPermission = permissionMapper.selectByBizTypeAndBizIdByUserId(
                transferReqBO.getBizType(), transferReqBO.getBizId(), transferReqBO.getUserId());
        String bizTypeName = CrmBizTypeEnum.getNameByType(transferReqBO.getBizType());
        if ((oldPermission == null || !isOwner(oldPermission.getLevel()))
                && !CrmPermissionUtils.isCrmAdmin()) {
            throw exception(CRM_PERMISSION_DENIED, bizTypeName);
        }
        if (oldPermission != null && ObjUtil.equal(transferReqBO.getNewOwnerUserId(), oldPermission.getUserId())) {
            throw exception(CRM_PERMISSION_MODEL_TRANSFER_FAIL_OWNER_USER_EXISTS, bizTypeName);
        }
        adminUserApi.validateUserList(Collections.singletonList(transferReqBO.getNewOwnerUserId()));

        List<CrmPermissionDO> permissions = permissionMapper.selectByBizTypeAndBizId(
                transferReqBO.getBizType(), transferReqBO.getBizId());
        CrmPermissionDO permission = CollUtil.findOne(permissions,
                item -> ObjUtil.equal(item.getUserId(), transferReqBO.getNewOwnerUserId()));
        if (permission == null) {
            permissionMapper.insert(new CrmPermissionDO()
                    .setBizType(transferReqBO.getBizType())
                    .setBizId(transferReqBO.getBizId())
                    .setUserId(transferReqBO.getNewOwnerUserId())
                    .setLevel(CrmPermissionLevelEnum.OWNER.getLevel()));
        } else {
            permissionMapper.updateById(new CrmPermissionDO()
                    .setId(permission.getId())
                    .setLevel(CrmPermissionLevelEnum.OWNER.getLevel()));
        }

        if (transferReqBO.getOldOwnerPermissionLevel() != null) {
            permissionMapper.updateById(new CrmPermissionDO()
                    .setId(oldPermission.getId())
                    .setLevel(transferReqBO.getOldOwnerPermissionLevel()));
        } else {
            permissionMapper.deleteById(oldPermission.getId());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deletePermission(Integer bizType, Long bizId, Integer level) {
        List<CrmPermissionDO> permissions =
                permissionMapper.selectListByBizTypeAndBizIdAndLevel(bizType, bizId, level);
        if (CollUtil.isEmpty(permissions)) {
            throw exception(CRM_PERMISSION_NOT_EXISTS);
        }
        permissionMapper.deleteByIds(convertSet(permissions, CrmPermissionDO::getId));
    }

    @Override
    public void deletePermission(Integer bizType, Long bizId) {
        int deletedCount = permissionMapper.deletePermission(bizType, bizId);
        if (deletedCount == 0) {
            throw exception(CRM_PERMISSION_NOT_EXISTS);
        }
    }

    @Override
    public void deletePermissionBatch(Collection<Long> ids, Long userId) {
        List<CrmPermissionDO> permissions = permissionMapper.selectByIds(ids);
        if (CollUtil.isEmpty(permissions)) {
            throw exception(CRM_PERMISSION_NOT_EXISTS);
        }
        if (convertSet(permissions, CrmPermissionDO::getBizId).size() > 1) {
            throw exception(CRM_PERMISSION_DELETE_FAIL);
        }
        CrmPermissionDO permission = permissionMapper.selectByBizAndUserId(
                permissions.get(0).getBizType(), permissions.get(0).getBizId(), userId);
        if (permission == null || !CrmPermissionLevelEnum.isOwner(permission.getLevel())) {
            throw exception(CRM_PERMISSION_DELETE_DENIED);
        }
        permissionMapper.deleteByIds(ids);
    }

    @Override
    public void deleteSelfPermission(Long id, Long userId) {
        CrmPermissionDO permission = permissionMapper.selectByIdAndUserId(id, userId);
        if (permission == null) {
            throw exception(CRM_PERMISSION_NOT_EXISTS);
        }
        if (CrmPermissionLevelEnum.isOwner(permission.getLevel())) {
            throw exception(CRM_PERMISSION_DELETE_SELF_PERMISSION_FAIL_EXIST_OWNER);
        }
        permissionMapper.deleteById(id);
    }

    @Override
    public List<CrmPermissionDO> getPermissionListByBiz(Integer bizType, Long bizId) {
        return permissionMapper.selectByBizTypeAndBizId(bizType, bizId);
    }

    @Override
    public List<CrmPermissionDO> getPermissionListByBiz(Integer bizType, Collection<Long> bizIds) {
        return permissionMapper.selectByBizTypeAndBizIds(bizType, bizIds);
    }

    @Override
    public List<CrmPermissionDO> getPermissionListByBizTypeAndUserId(Integer bizType, Long userId) {
        return permissionMapper.selectListByBizTypeAndUserId(bizType, userId);
    }

    @Override
    public boolean hasPermission(Integer bizType, Long bizId, Long userId, CrmPermissionLevelEnum level) {
        List<CrmPermissionDO> permissionList = permissionMapper.selectByBizTypeAndBizId(bizType, bizId);
        return anyMatch(permissionList, permission ->
                ObjUtil.equal(permission.getUserId(), userId)
                        && ObjUtil.equal(permission.getLevel(), level.getLevel()));
    }

    public CrmPermissionDO hasAnyPermission(Integer bizType, Long bizId, Long userId) {
        List<CrmPermissionDO> permissionList = permissionMapper.selectByBizTypeAndBizId(bizType, bizId);
        return findFirst(permissionList, permission -> ObjUtil.equal(permission.getUserId(), userId));
    }
}
