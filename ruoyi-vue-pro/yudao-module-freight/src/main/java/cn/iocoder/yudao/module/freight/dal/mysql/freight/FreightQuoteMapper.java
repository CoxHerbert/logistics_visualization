package cn.iocoder.yudao.module.freight.dal.mysql.freight;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightQuoteDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FreightQuoteMapper extends BaseMapperX<FreightQuoteDO> {
}
