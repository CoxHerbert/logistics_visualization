package cn.iocoder.yudao.module.freight.dal.mysql.freight;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderExceptionDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FreightOrderExceptionMapper extends BaseMapperX<FreightOrderExceptionDO> {

    default List<FreightOrderExceptionDO> selectListByOrderId(Long orderId) {
        return selectList(new LambdaQueryWrapperX<FreightOrderExceptionDO>()
                .eq(FreightOrderExceptionDO::getOrderId, orderId)
                .orderByDesc(FreightOrderExceptionDO::getOccurTime)
                .orderByDesc(FreightOrderExceptionDO::getId));
    }
}
