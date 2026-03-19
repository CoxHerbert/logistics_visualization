package cn.iocoder.yudao.module.crm.dal.mysql.receivable;

import cn.hutool.core.date.LocalDateTimeUtil;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.MPJLambdaWrapperX;
import cn.iocoder.yudao.module.crm.controller.admin.receivable.vo.plan.CrmReceivablePlanPageReqVO;
import cn.iocoder.yudao.module.crm.dal.dataobject.contract.CrmContractDO;
import cn.iocoder.yudao.module.crm.dal.dataobject.receivable.CrmReceivablePlanDO;
import cn.iocoder.yudao.module.crm.enums.common.CrmBizTypeEnum;
import cn.iocoder.yudao.module.crm.enums.common.CrmSceneTypeEnum;
import cn.iocoder.yudao.module.crm.util.CrmPermissionUtils;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Mapper
public interface CrmReceivablePlanMapper extends BaseMapperX<CrmReceivablePlanDO> {

    default CrmReceivablePlanDO selectMaxPeriodByContractId(Long contractId) {
        return selectOne(new MPJLambdaWrapperX<CrmReceivablePlanDO>()
                .eq(CrmReceivablePlanDO::getContractId, contractId)
                .orderByDesc(CrmReceivablePlanDO::getPeriod)
                .last("LIMIT 1"));
    }

    default PageResult<CrmReceivablePlanDO> selectPageByCustomerId(CrmReceivablePlanPageReqVO reqVO) {
        MPJLambdaWrapperX<CrmReceivablePlanDO> query = new MPJLambdaWrapperX<>();
        if (Objects.nonNull(reqVO.getContractNo())) {
            query.innerJoin(CrmContractDO.class, on -> on.like(CrmContractDO::getNo, reqVO.getContractNo())
                    .eq(CrmContractDO::getId, CrmReceivablePlanDO::getContractId));
        }
        query.eq(CrmReceivablePlanDO::getCustomerId, reqVO.getCustomerId())
                .eqIfPresent(CrmReceivablePlanDO::getContractId, reqVO.getContractId())
                .orderByDesc(CrmReceivablePlanDO::getPeriod);
        return selectJoinPage(reqVO, CrmReceivablePlanDO.class, query);
    }

    default List<CrmReceivablePlanDO> selectListByCustomerId(Long customerId) {
        return selectList(new MPJLambdaWrapperX<CrmReceivablePlanDO>()
                .eq(CrmReceivablePlanDO::getCustomerId, customerId)
                .orderByDesc(CrmReceivablePlanDO::getPeriod)
                .orderByDesc(CrmReceivablePlanDO::getId));
    }

    default PageResult<CrmReceivablePlanDO> selectPage(CrmReceivablePlanPageReqVO pageReqVO, Long userId) {
        MPJLambdaWrapperX<CrmReceivablePlanDO> query = new MPJLambdaWrapperX<>();
        CrmPermissionUtils.appendPermissionCondition(query, CrmBizTypeEnum.CRM_RECEIVABLE_PLAN.getType(),
                CrmReceivablePlanDO::getId, userId, pageReqVO.getSceneType());
        query.selectAll(CrmReceivablePlanDO.class)
                .eqIfPresent(CrmReceivablePlanDO::getCustomerId, pageReqVO.getCustomerId())
                .eqIfPresent(CrmReceivablePlanDO::getContractId, pageReqVO.getContractId())
                .orderByDesc(CrmReceivablePlanDO::getPeriod);
        if (Objects.nonNull(pageReqVO.getContractNo())) {
            query.innerJoin(CrmContractDO.class, on -> on.like(CrmContractDO::getNo, pageReqVO.getContractNo())
                    .eq(CrmContractDO::getId, CrmReceivablePlanDO::getContractId));
        }

        LocalDateTime beginOfToday = LocalDateTimeUtil.beginOfDay(LocalDateTime.now());
        if (CrmReceivablePlanPageReqVO.REMIND_TYPE_NEEDED.equals(pageReqVO.getRemindType())) {
            query.isNull(CrmReceivablePlanDO::getReceivableId)
                    .le(CrmReceivablePlanDO::getRemindTime, beginOfToday);
        } else if (CrmReceivablePlanPageReqVO.REMIND_TYPE_EXPIRED.equals(pageReqVO.getRemindType())) {
            query.isNull(CrmReceivablePlanDO::getReceivableId)
                    .lt(CrmReceivablePlanDO::getReturnTime, beginOfToday);
        } else if (CrmReceivablePlanPageReqVO.REMIND_TYPE_RECEIVED.equals(pageReqVO.getRemindType())) {
            query.isNotNull(CrmReceivablePlanDO::getReceivableId);
        }
        return selectJoinPage(pageReqVO, CrmReceivablePlanDO.class, query);
    }

    default Long selectReceivablePlanCountByRemind(Long userId) {
        MPJLambdaWrapperX<CrmReceivablePlanDO> query = new MPJLambdaWrapperX<>();
        CrmPermissionUtils.appendPermissionCondition(query, CrmBizTypeEnum.CRM_RECEIVABLE_PLAN.getType(),
                CrmReceivablePlanDO::getId, userId, CrmSceneTypeEnum.OWNER.getType());
        LocalDateTime beginOfToday = LocalDateTimeUtil.beginOfDay(LocalDateTime.now());
        query.isNull(CrmReceivablePlanDO::getReceivableId)
                .lt(CrmReceivablePlanDO::getReturnTime, beginOfToday)
                .lt(CrmReceivablePlanDO::getRemindTime, beginOfToday);
        return selectCount(query);
    }
}
