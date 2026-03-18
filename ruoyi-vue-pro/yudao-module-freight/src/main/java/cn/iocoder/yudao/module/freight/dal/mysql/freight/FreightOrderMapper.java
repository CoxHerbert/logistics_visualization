package cn.iocoder.yudao.module.freight.dal.mysql.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order.AdminFreightOrderPageReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FreightOrderMapper extends BaseMapperX<FreightOrderDO> {

    default PageResult<FreightOrderDO> selectPage(AdminFreightOrderPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<FreightOrderDO>()
                .likeIfPresent(FreightOrderDO::getOrderNo, reqVO.getOrderNo())
                .eqIfPresent(FreightOrderDO::getCustomerId, reqVO.getCustomerId())
                .eqIfPresent(FreightOrderDO::getContractId, reqVO.getContractId())
                .likeIfPresent(FreightOrderDO::getContractNo, reqVO.getContractNo())
                .likeIfPresent(FreightOrderDO::getContractName, reqVO.getContractName())
                .eqIfPresent(FreightOrderDO::getStatus, reqVO.getStatus())
                .eqIfPresent(FreightOrderDO::getTransportMode, reqVO.getTransportMode())
                .likeIfPresent(FreightOrderDO::getOriginPort, reqVO.getOriginPort())
                .likeIfPresent(FreightOrderDO::getDestinationPort, reqVO.getDestinationPort())
                .likeIfPresent(FreightOrderDO::getBookingNo, reqVO.getBookingNo())
                .likeIfPresent(FreightOrderDO::getBlNo, reqVO.getBlNo())
                .eqIfPresent(FreightOrderDO::getSalesUserId, reqVO.getSalesUserId())
                .betweenIfPresent(FreightOrderDO::getCreateTime, reqVO.getCreateTime())
                .orderByDesc(FreightOrderDO::getId));
    }
}
