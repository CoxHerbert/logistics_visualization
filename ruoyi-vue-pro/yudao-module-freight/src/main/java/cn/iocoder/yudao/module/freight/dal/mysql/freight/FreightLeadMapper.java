package cn.iocoder.yudao.module.freight.dal.mysql.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.lead.AdminFreightLeadPageReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightLeadDO;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@InterceptorIgnore(tenantLine = "true")
public interface FreightLeadMapper extends BaseMapperX<FreightLeadDO> {

    default PageResult<FreightLeadDO> selectPage(AdminFreightLeadPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<FreightLeadDO>()
                .eqIfPresent(FreightLeadDO::getStatus, reqVO.getStatus())
                .likeIfPresent(FreightLeadDO::getContactPhone, reqVO.getContactPhone())
                .betweenIfPresent(FreightLeadDO::getCreateTime, reqVO.getCreateTime())
                .orderByDesc(FreightLeadDO::getId));
    }

}
