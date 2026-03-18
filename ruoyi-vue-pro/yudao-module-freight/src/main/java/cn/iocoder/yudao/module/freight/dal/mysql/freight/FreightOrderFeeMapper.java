package cn.iocoder.yudao.module.freight.dal.mysql.freight;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderFeeDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FreightOrderFeeMapper extends BaseMapperX<FreightOrderFeeDO> {

    default List<FreightOrderFeeDO> selectListByOrderId(Long orderId) {
        return selectList(new LambdaQueryWrapperX<FreightOrderFeeDO>()
                .eq(FreightOrderFeeDO::getOrderId, orderId)
                .orderByAsc(FreightOrderFeeDO::getId));
    }

    default void deleteByOrderId(Long orderId) {
        delete(new LambdaQueryWrapperX<FreightOrderFeeDO>()
                .eq(FreightOrderFeeDO::getOrderId, orderId));
    }
}
