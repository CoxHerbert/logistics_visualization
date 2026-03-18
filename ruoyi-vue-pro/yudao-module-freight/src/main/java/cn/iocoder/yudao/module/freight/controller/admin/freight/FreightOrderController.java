package cn.iocoder.yudao.module.freight.controller.admin.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeBatchSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderLogRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderPageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderUpdateStatusReqVO;
import cn.iocoder.yudao.module.freight.convert.freight.FreightOrderConvert;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderFeeDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderLogDO;
import cn.iocoder.yudao.module.freight.service.freight.FreightOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "Admin - Freight Order")
@RestController
@RequestMapping("/freight/order")
@Validated
public class FreightOrderController {

    @Resource
    private FreightOrderService freightOrderService;

    @PostMapping("/create")
    @Operation(summary = "Create freight order")
    @PreAuthorize("@ss.hasPermission('freight:order:create')")
    public CommonResult<Long> createOrder(@Valid @RequestBody AdminFreightOrderSaveReqVO createReqVO) {
        return success(freightOrderService.createOrder(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "Update freight order")
    @PreAuthorize("@ss.hasPermission('freight:order:update')")
    public CommonResult<Boolean> updateOrder(@Valid @RequestBody AdminFreightOrderSaveReqVO updateReqVO) {
        freightOrderService.updateOrder(updateReqVO);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "Get freight order detail")
    @Parameter(name = "id", description = "id", required = true)
    @PreAuthorize("@ss.hasPermission('freight:order:query')")
    public CommonResult<AdminFreightOrderRespVO> getOrder(@RequestParam("id") Long id) {
        FreightOrderDO order = freightOrderService.getOrder(id);
        return success(FreightOrderConvert.INSTANCE.convert(order));
    }

    @GetMapping("/page")
    @Operation(summary = "Get freight order page")
    @PreAuthorize("@ss.hasPermission('freight:order:query')")
    public CommonResult<PageResult<AdminFreightOrderRespVO>> getOrderPage(@Valid AdminFreightOrderPageReqVO pageReqVO) {
        PageResult<FreightOrderDO> pageResult = freightOrderService.getOrderPage(pageReqVO);
        return success(FreightOrderConvert.INSTANCE.convertPage(pageResult));
    }

    @PutMapping("/update-status")
    @Operation(summary = "Update freight order status")
    @PreAuthorize("@ss.hasPermission('freight:order:update')")
    public CommonResult<Boolean> updateOrderStatus(@Valid @RequestBody AdminFreightOrderUpdateStatusReqVO reqVO) {
        freightOrderService.updateOrderStatus(reqVO);
        return success(true);
    }

    @GetMapping("/fee/list")
    @Operation(summary = "Get freight order fee list")
    @Parameter(name = "orderId", description = "freight order id", required = true)
    @PreAuthorize("@ss.hasPermission('freight:order:query')")
    public CommonResult<List<AdminFreightOrderFeeRespVO>> getOrderFeeList(@RequestParam("orderId") Long orderId) {
        List<FreightOrderFeeDO> fees = freightOrderService.getOrderFeeList(orderId);
        return success(FreightOrderConvert.INSTANCE.convertFeeList(fees));
    }

    @PostMapping("/fee/save")
    @Operation(summary = "Save freight order fees")
    @PreAuthorize("@ss.hasPermission('freight:order:update')")
    public CommonResult<Boolean> saveOrderFees(@Valid @RequestBody AdminFreightOrderFeeBatchSaveReqVO reqVO) {
        freightOrderService.saveOrderFees(reqVO);
        return success(true);
    }

    @GetMapping("/log/list")
    @Operation(summary = "Get freight order logs")
    @Parameter(name = "orderId", description = "freight order id", required = true)
    @PreAuthorize("@ss.hasPermission('freight:order:query')")
    public CommonResult<List<AdminFreightOrderLogRespVO>> getOrderLogList(@RequestParam("orderId") Long orderId) {
        List<FreightOrderLogDO> logs = freightOrderService.getOrderLogList(orderId);
        return success(FreightOrderConvert.INSTANCE.convertLogList(logs));
    }
}
