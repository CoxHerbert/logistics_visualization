package cn.iocoder.yudao.module.system.dal.mysql.freight;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightQuoteDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FreightQuoteMapper extends BaseMapperX<FreightQuoteDO> {

    default List<FreightQuoteDO> selectListByLeadId(Long leadId) {
        return selectList(new LambdaQueryWrapperX<FreightQuoteDO>()
                .eq(FreightQuoteDO::getLeadId, leadId)
                .orderByDesc(FreightQuoteDO::getId));
    }

}
