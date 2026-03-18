package cn.iocoder.yudao.module.freight.convert.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderFeeSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderExceptionRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderExceptionSaveReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderLogRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderRespVO;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderSaveReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderExceptionDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderFeeDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderDO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderLogDO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface FreightOrderConvert {

    FreightOrderConvert INSTANCE = Mappers.getMapper(FreightOrderConvert.class);

    @Mapping(target = "sensitiveFlag", source = "sensitive")
    @Mapping(target = "contractId", source = "contractId")
    @Mapping(target = "contractNo", source = "contractNo")
    @Mapping(target = "contractName", source = "contractName")
    @Mapping(target = "deliveryType", source = "deliveryType")
    @Mapping(target = "deliveryWarehouseCode", source = "deliveryWarehouseCode")
    @Mapping(target = "deliveryWarehouseName", source = "deliveryWarehouseName")
    @Mapping(target = "amazonShipmentId", source = "amazonShipmentId")
    @Mapping(target = "amazonReferenceNo", source = "amazonReferenceNo")
    FreightOrderDO convert(AdminFreightOrderSaveReqVO bean);

    @Mapping(target = "sensitive", source = "sensitiveFlag")
    @Mapping(target = "contractId", source = "contractId")
    @Mapping(target = "contractNo", source = "contractNo")
    @Mapping(target = "contractName", source = "contractName")
    @Mapping(target = "deliveryType", source = "deliveryType")
    @Mapping(target = "deliveryWarehouseCode", source = "deliveryWarehouseCode")
    @Mapping(target = "deliveryWarehouseName", source = "deliveryWarehouseName")
    @Mapping(target = "amazonShipmentId", source = "amazonShipmentId")
    @Mapping(target = "amazonReferenceNo", source = "amazonReferenceNo")
    AdminFreightOrderRespVO convert(FreightOrderDO bean);

    PageResult<AdminFreightOrderRespVO> convertPage(PageResult<FreightOrderDO> page);

    FreightOrderFeeDO convert(AdminFreightOrderFeeSaveReqVO bean);

    List<AdminFreightOrderFeeRespVO> convertFeeList(List<FreightOrderFeeDO> list);

    FreightOrderExceptionDO convert(AdminFreightOrderExceptionSaveReqVO bean);

    List<AdminFreightOrderExceptionRespVO> convertExceptionList(List<FreightOrderExceptionDO> list);

    List<AdminFreightOrderLogRespVO> convertLogList(List<FreightOrderLogDO> list);
}
