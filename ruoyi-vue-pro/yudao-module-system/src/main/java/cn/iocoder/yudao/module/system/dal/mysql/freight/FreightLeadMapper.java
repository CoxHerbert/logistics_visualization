package cn.iocoder.yudao.module.system.dal.mysql.freight;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.system.controller.admin.freight.vo.lead.AdminFreightLeadPageReqVO;
import cn.iocoder.yudao.module.system.dal.dataobject.freight.FreightLeadDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FreightLeadMapper extends BaseMapperX<FreightLeadDO> {

    default PageResult<FreightLeadDO> selectPage(AdminFreightLeadPageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<FreightLeadDO>()
                .eqIfPresent(FreightLeadDO::getStatus, reqVO.getStatus())
                .likeIfPresent(FreightLeadDO::getContactPhone, reqVO.getContactPhone())
                .betweenIfPresent(FreightLeadDO::getCreateTime, reqVO.getCreateTime())
                .orderByDesc(FreightLeadDO::getId));
    }

}
