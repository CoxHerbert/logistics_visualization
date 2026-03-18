package cn.iocoder.yudao.module.freight.dal.mysql.freight;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightOrderLogDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FreightOrderLogMapper extends BaseMapperX<FreightOrderLogDO> {

    default List<FreightOrderLogDO> selectListByOrderId(Long orderId) {
        return selectList(new LambdaQueryWrapperX<FreightOrderLogDO>()
                .eq(FreightOrderLogDO::getOrderId, orderId)
                .orderByDesc(FreightOrderLogDO::getId));
    }
}
