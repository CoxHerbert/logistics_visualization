package cn.iocoder.yudao.module.system.dal.mysql.freight;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadActivityDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FreightLeadActivityMapper extends BaseMapperX<FreightLeadActivityDO> {

    default List<FreightLeadActivityDO> selectListByLeadId(Long leadId) {
        return selectList(new LambdaQueryWrapperX<FreightLeadActivityDO>()
                .eq(FreightLeadActivityDO::getLeadId, leadId)
                .orderByDesc(FreightLeadActivityDO::getId));
    }

}
