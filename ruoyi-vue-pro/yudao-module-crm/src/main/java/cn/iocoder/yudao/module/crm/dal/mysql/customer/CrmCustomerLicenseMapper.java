package cn.iocoder.yudao.module.crm.dal.mysql.customer;

import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.crm.dal.dataobject.customer.CrmCustomerLicenseDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CrmCustomerLicenseMapper extends BaseMapperX<CrmCustomerLicenseDO> {

    default List<CrmCustomerLicenseDO> selectListByCustomerId(Long customerId) {
        return selectList(new LambdaQueryWrapperX<CrmCustomerLicenseDO>()
                .eq(CrmCustomerLicenseDO::getCustomerId, customerId)
                .orderByDesc(CrmCustomerLicenseDO::getExpireDate)
                .orderByDesc(CrmCustomerLicenseDO::getId));
    }
}
