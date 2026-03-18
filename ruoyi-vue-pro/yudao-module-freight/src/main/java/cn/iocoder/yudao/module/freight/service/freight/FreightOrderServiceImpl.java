package cn.iocoder.yudao.module.freight.service.freight;

import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.IdUtil;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.security.core.util.SecurityFrameworkUtils;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerDO;
import cn.iocoder.yudao.module.crm.service.customer.CrmCustomerService;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeBatchSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderPageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderUpdateStatusReqVO;
import cn.iocoder.yudao.module.freight.convert.freight.FreightOrderConvert;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderFeeDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderLogDO;
import cn.iocoder.yudao.module.freight.dal.mysql.freight.FreightOrderFeeMapper;
import cn.iocoder.yudao.module.freight.dal.mysql.freight.FreightOrderLogMapper;
import cn.iocoder.yudao.module.freight.dal.mysql.freight.FreightOrderMapper;
import cn.iocoder.yudao.module.freight.enums.freight.FreightOrderStatusEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.freight.enums.ErrorCodeConstants.FREIGHT_ORDER_DATA_INCOMPLETE;
import static cn.iocoder.yudao.module.freight.enums.ErrorCodeConstants.FREIGHT_ORDER_NOT_EXISTS;
import static cn.iocoder.yudao.module.freight.enums.ErrorCodeConstants.FREIGHT_ORDER_STATUS_INVALID;

@Service
@Validated
public class FreightOrderServiceImpl implements FreightOrderService {

    @Resource
    private FreightOrderMapper freightOrderMapper;
    @Resource
    private FreightOrderFeeMapper freightOrderFeeMapper;
    @Resource
    private FreightOrderLogMapper freightOrderLogMapper;
    @Resource
    private CrmCustomerService crmCustomerService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createOrder(@Valid AdminFreightOrderSaveReqVO createReqVO) {
        FreightOrderDO order = FreightOrderConvert.INSTANCE.convert(createReqVO);
        fillCustomerInfo(order);
        fillDefaultValues(order);
        order.setOrderNo(generateOrderNo());
        order.setStatus(FreightOrderStatusEnum.DRAFT.getStatus());
        freightOrderMapper.insert(order);
        createLog(order.getId(), "CREATE", null, order.getStatus(), "Create freight order");
        return order.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOrder(@Valid AdminFreightOrderSaveReqVO updateReqVO) {
        FreightOrderDO dbOrder = validateOrderExists(updateReqVO.getId());
        FreightOrderDO updateObj = FreightOrderConvert.INSTANCE.convert(updateReqVO);
        fillCustomerInfo(updateObj);
        fillDefaultValues(updateObj);
        updateObj.setId(dbOrder.getId());
        updateObj.setOrderNo(dbOrder.getOrderNo());
        updateObj.setStatus(dbOrder.getStatus());
        freightOrderMapper.updateById(updateObj);
        createLog(dbOrder.getId(), "UPDATE", dbOrder.getStatus(), dbOrder.getStatus(), "Update freight order");
    }

    @Override
    public FreightOrderDO getOrder(Long id) {
        return freightOrderMapper.selectById(id);
    }

    @Override
    public PageResult<FreightOrderDO> getOrderPage(AdminFreightOrderPageReqVO pageReqVO) {
        return freightOrderMapper.selectPage(pageReqVO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOrderStatus(@Valid AdminFreightOrderUpdateStatusReqVO reqVO) {
        FreightOrderDO order = validateOrderExists(reqVO.getId());
        FreightOrderStatusEnum fromStatus = FreightOrderStatusEnum.valueOfStatus(order.getStatus());
        FreightOrderStatusEnum toStatus = FreightOrderStatusEnum.valueOfStatus(reqVO.getToStatus());
        if (fromStatus == null || toStatus == null || !canTransit(fromStatus, toStatus)) {
            throw exception(FREIGHT_ORDER_STATUS_INVALID);
        }
        validateFieldsBeforeStatusChange(order, toStatus);
        FreightOrderDO updateObj = new FreightOrderDO();
        updateObj.setId(order.getId());
        updateObj.setStatus(toStatus.getStatus());
        freightOrderMapper.updateById(updateObj);
        createLog(order.getId(), "STATUS_CHANGE", fromStatus.getStatus(), toStatus.getStatus(), reqVO.getRemark());
    }

    @Override
    public List<FreightOrderFeeDO> getOrderFeeList(Long orderId) {
        validateOrderExists(orderId);
        return freightOrderFeeMapper.selectListByOrderId(orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOrderFees(@Valid AdminFreightOrderFeeBatchSaveReqVO reqVO) {
        FreightOrderDO order = validateOrderExists(reqVO.getOrderId());
        freightOrderFeeMapper.deleteByOrderId(order.getId());
        BigDecimal receivableAmount = BigDecimal.ZERO;
        BigDecimal payableAmount = BigDecimal.ZERO;
        if (reqVO.getFees() != null) {
            for (AdminFreightOrderFeeSaveReqVO feeReq : reqVO.getFees()) {
                FreightOrderFeeDO fee = FreightOrderConvert.INSTANCE.convert(feeReq);
                fee.setOrderId(order.getId());
                if (fee.getCurrency() == null || fee.getCurrency().trim().isEmpty()) {
                    fee.setCurrency(order.getCurrency());
                }
                if (fee.getQuantity() == null) {
                    fee.setQuantity(BigDecimal.ZERO);
                }
                if (fee.getUnitPrice() == null) {
                    fee.setUnitPrice(BigDecimal.ZERO);
                }
                if (fee.getAmount() == null) {
                    fee.setAmount(fee.getUnitPrice().multiply(fee.getQuantity()));
                }
                freightOrderFeeMapper.insert(fee);
                if ("RECEIVABLE".equalsIgnoreCase(fee.getFeeType())) {
                    receivableAmount = receivableAmount.add(fee.getAmount());
                } else if ("PAYABLE".equalsIgnoreCase(fee.getFeeType())) {
                    payableAmount = payableAmount.add(fee.getAmount());
                }
            }
        }
        FreightOrderDO updateObj = new FreightOrderDO();
        updateObj.setId(order.getId());
        updateObj.setReceivableAmount(receivableAmount);
        updateObj.setPayableAmount(payableAmount);
        updateObj.setProfitAmount(receivableAmount.subtract(payableAmount));
        freightOrderMapper.updateById(updateObj);
        createLog(order.getId(), "FEE_SAVE", order.getStatus(), order.getStatus(), "Save freight order fees");
    }

    @Override
    public List<FreightOrderLogDO> getOrderLogList(Long orderId) {
        validateOrderExists(orderId);
        return freightOrderLogMapper.selectListByOrderId(orderId);
    }

    private FreightOrderDO validateOrderExists(Long id) {
        FreightOrderDO order = freightOrderMapper.selectById(id);
        if (order == null) {
            throw exception(FREIGHT_ORDER_NOT_EXISTS);
        }
        return order;
    }

    private void fillDefaultValues(FreightOrderDO order) {
        if (order.getPackageCount() == null) {
            order.setPackageCount(0);
        }
        if (order.getGrossWeightKg() == null) {
            order.setGrossWeightKg(BigDecimal.ZERO);
        }
        if (order.getVolumeCbm() == null) {
            order.setVolumeCbm(BigDecimal.ZERO);
        }
        if (order.getReceivableAmount() == null) {
            order.setReceivableAmount(BigDecimal.ZERO);
        }
        if (order.getPayableAmount() == null) {
            order.setPayableAmount(BigDecimal.ZERO);
        }
        if (order.getProfitAmount() == null) {
            order.setProfitAmount(BigDecimal.ZERO);
        }
        if (order.getHasBattery() == null) {
            order.setHasBattery(Boolean.FALSE);
        }
        if (order.getSensitiveFlag() == null) {
            order.setSensitiveFlag(Boolean.FALSE);
        }
        if (order.getCurrency() == null || order.getCurrency().trim().isEmpty()) {
            order.setCurrency("USD");
        }
    }

    private void fillCustomerInfo(FreightOrderDO order) {
        if (order.getCustomerId() == null) {
            return;
        }
        crmCustomerService.validateCustomer(order.getCustomerId());
        CrmCustomerDO customer = crmCustomerService.getCustomer(order.getCustomerId());
        if (customer != null) {
            order.setCustomerName(customer.getName());
        }
    }

    private String generateOrderNo() {
        String seq = IdUtil.getSnowflakeNextIdStr();
        return "FO" + seq.substring(Math.max(0, seq.length() - 12));
    }

    private boolean canTransit(FreightOrderStatusEnum from, FreightOrderStatusEnum to) {
        if (to == FreightOrderStatusEnum.CANCELLED) {
            return from != FreightOrderStatusEnum.COMPLETED && from != FreightOrderStatusEnum.CANCELLED;
        }
        switch (from) {
            case DRAFT:
                return to == FreightOrderStatusEnum.PENDING_REVIEW;
            case PENDING_REVIEW:
                return Arrays.asList(FreightOrderStatusEnum.DRAFT, FreightOrderStatusEnum.PENDING_QUOTE).contains(to);
            case PENDING_QUOTE:
                return to == FreightOrderStatusEnum.QUOTED;
            case QUOTED:
                return to == FreightOrderStatusEnum.PENDING_BOOKING;
            case PENDING_BOOKING:
                return to == FreightOrderStatusEnum.BOOKED;
            case BOOKED:
                return to == FreightOrderStatusEnum.CUSTOMS_PROCESSING;
            case CUSTOMS_PROCESSING:
                return to == FreightOrderStatusEnum.IN_TRANSIT;
            case IN_TRANSIT:
                return to == FreightOrderStatusEnum.ARRIVED;
            case ARRIVED:
                return to == FreightOrderStatusEnum.SIGNED;
            case SIGNED:
                return to == FreightOrderStatusEnum.COMPLETED;
            default:
                return false;
        }
    }

    private void validateFieldsBeforeStatusChange(FreightOrderDO order, FreightOrderStatusEnum toStatus) {
        switch (toStatus) {
            case PENDING_REVIEW:
                requireBasicFields(order);
                break;
            case BOOKED:
                requireBookingFields(order);
                break;
            case CUSTOMS_PROCESSING:
                requireCustomsFields(order);
                break;
            case IN_TRANSIT:
                requireTransitFields(order);
                break;
            case SIGNED:
                requireSignedFields(order);
                break;
            default:
                break;
        }
    }

    private void requireBasicFields(FreightOrderDO order) {
        if (order.getCustomerId() == null
                || StrUtil.isBlank(order.getCustomerName())
                || StrUtil.isBlank(order.getBizType())
                || StrUtil.isBlank(order.getTransportMode())
                || StrUtil.isBlank(order.getOriginPort())
                || StrUtil.isBlank(order.getDestinationPort())) {
            throw exception(FREIGHT_ORDER_DATA_INCOMPLETE);
        }
    }

    private void requireBookingFields(FreightOrderDO order) {
        requireBasicFields(order);
        if (StrUtil.isBlank(order.getBookingNo())
                || order.getEtd() == null
                || order.getEta() == null) {
            throw exception(FREIGHT_ORDER_DATA_INCOMPLETE);
        }
    }

    private void requireCustomsFields(FreightOrderDO order) {
        requireBookingFields(order);
        if (StrUtil.isBlank(order.getCustomsType())) {
            throw exception(FREIGHT_ORDER_DATA_INCOMPLETE);
        }
    }

    private void requireTransitFields(FreightOrderDO order) {
        requireCustomsFields(order);
        if (StrUtil.isBlank(order.getBlNo())) {
            throw exception(FREIGHT_ORDER_DATA_INCOMPLETE);
        }
    }

    private void requireSignedFields(FreightOrderDO order) {
        if (order.getSignTime() == null) {
            throw exception(FREIGHT_ORDER_DATA_INCOMPLETE);
        }
    }

    private void createLog(Long orderId, String actionType, String fromStatus, String toStatus, String content) {
        FreightOrderLogDO log = new FreightOrderLogDO();
        log.setOrderId(orderId);
        log.setActionType(actionType);
        log.setFromStatus(fromStatus);
        log.setToStatus(toStatus);
        log.setOperatorId(SecurityFrameworkUtils.getLoginUserId());
        log.setOperatorName(SecurityFrameworkUtils.getLoginUserNickname());
        log.setContent(content == null || content.trim().isEmpty() ? actionType : content);
        freightOrderLogMapper.insert(log);
    }
}
