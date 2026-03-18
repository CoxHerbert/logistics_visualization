package cn.iocoder.yudao.module.crm.dal.mysql.customer;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerBankAccountDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CrmCustomerBankAccountMapper extends BaseMapperX<CrmCustomerBankAccountDO> {

    default List<CrmCustomerBankAccountDO> selectListByCustomerId(Long customerId) {
        return selectList(new LambdaQueryWrapperX<CrmCustomerBankAccountDO>()
                .eq(CrmCustomerBankAccountDO::getCustomerId, customerId)
                .orderByDesc(CrmCustomerBankAccountDO::getDefaultStatus)
                .orderByDesc(CrmCustomerBankAccountDO::getId));
    }
}
