package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeBatchSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderExceptionSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderPageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderUpdateStatusReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderExceptionDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderFeeDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderLogDO;

import javax.validation.Valid;
import java.util.List;

public interface FreightOrderService {

    Long createOrder(@Valid AdminFreightOrderSaveReqVO createReqVO);

    void updateOrder(@Valid AdminFreightOrderSaveReqVO updateReqVO);

    FreightOrderDO getOrder(Long id);

    PageResult<FreightOrderDO> getOrderPage(AdminFreightOrderPageReqVO pageReqVO);

    void updateOrderStatus(@Valid AdminFreightOrderUpdateStatusReqVO reqVO);

    List<FreightOrderFeeDO> getOrderFeeList(Long orderId);

    void saveOrderFees(@Valid AdminFreightOrderFeeBatchSaveReqVO reqVO);

    Long saveOrderException(@Valid AdminFreightOrderExceptionSaveReqVO reqVO);

    void deleteOrderException(Long id);

    List<FreightOrderExceptionDO> getOrderExceptionList(Long orderId);

    List<FreightOrderLogDO> getOrderLogList(Long orderId);
}
