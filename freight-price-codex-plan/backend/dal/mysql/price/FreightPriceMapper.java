package cn.iocoder.yudao.module.freight.dal.mysql.price;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FreightPriceMapper extends BaseMapperX<FreightPriceDO> {

    default LambdaQueryWrapperX<FreightPriceDO> buildListQuery(Integer transportType, String origin, String destination,
                                                               Integer status) {
        return new LambdaQueryWrapperX<FreightPriceDO>()
                .eqIfPresent(FreightPriceDO::getTransportType, transportType)
                .likeIfPresent(FreightPriceDO::getOrigin, origin)
                .likeIfPresent(FreightPriceDO::getDestination, destination)
                .eqIfPresent(FreightPriceDO::getStatus, status)
                .orderByDesc(FreightPriceDO::getId);
    }
}
