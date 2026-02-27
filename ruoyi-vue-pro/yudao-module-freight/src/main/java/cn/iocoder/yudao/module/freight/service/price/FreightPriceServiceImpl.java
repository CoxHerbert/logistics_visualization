package cn.iocoder.yudao.module.freight.service.price;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPricePageReqVO;
import cn.iocoder.yudao.module.freight.controller.admin.price.vo.FreightPriceSaveReqVO;
import cn.iocoder.yudao.module.freight.dal.dataobject.price.FreightPriceDO;
import cn.iocoder.yudao.module.freight.dal.mysql.price.FreightPriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Service
@Validated
@RequiredArgsConstructor
public class FreightPriceServiceImpl implements FreightPriceService {

    private final FreightPriceMapper freightPriceMapper;

    @Override
    public Long create(FreightPriceSaveReqVO reqVO) {
        FreightPriceDO data = toDO(reqVO);
        data.setId(null);
        freightPriceMapper.insert(data);
        return data.getId();
    }

    @Override
    public void update(FreightPriceSaveReqVO reqVO) {
        FreightPriceDO exists = get(reqVO.getId());
        if (exists == null) {
            throw new IllegalArgumentException("运价不存在");
        }
        FreightPriceDO data = toDO(reqVO);
        freightPriceMapper.updateById(data);
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        FreightPriceDO exists = get(id);
        if (exists == null) {
            throw new IllegalArgumentException("运价不存在");
        }
        FreightPriceDO update = new FreightPriceDO();
        update.setId(id);
        update.setStatus(status);
        freightPriceMapper.updateById(update);
    }

    @Override
    public FreightPriceDO get(Long id) {
        return freightPriceMapper.selectById(id);
    }

    @Override
    public PageResult<FreightPriceDO> getPage(FreightPricePageReqVO reqVO) {
        return freightPriceMapper.selectPage(reqVO, freightPriceMapper.buildListQuery(
                reqVO.getTransportType(), reqVO.getOrigin(), reqVO.getDestination(), reqVO.getStatus()
        ));
    }

    @Override
    public FreightPriceDO matchPrice(Integer transportType, String origin, String destination, LocalDate onDate) {
        LambdaQueryWrapper<FreightPriceDO> qw = new LambdaQueryWrapperX<FreightPriceDO>()
                .eq(FreightPriceDO::getTransportType, transportType)
                .eq(FreightPriceDO::getOrigin, origin)
                .eq(FreightPriceDO::getDestination, destination)
                .eq(FreightPriceDO::getStatus, 0)
                .le(FreightPriceDO::getValidFrom, onDate)
                .ge(FreightPriceDO::getValidTo, onDate)
                .orderByDesc(FreightPriceDO::getId)
                .last("LIMIT 1");
        return freightPriceMapper.selectOne(qw);
    }

    private FreightPriceDO toDO(FreightPriceSaveReqVO reqVO) {
        FreightPriceDO data = new FreightPriceDO();
        data.setId(reqVO.getId());
        data.setTransportType(reqVO.getTransportType());
        data.setOrigin(reqVO.getOrigin());
        data.setDestination(reqVO.getDestination());
        data.setPriceMode(reqVO.getPriceMode());
        data.setUnitPrice(reqVO.getUnitPrice());
        data.setMinPrice(reqVO.getMinPrice());
        data.setCurrency(reqVO.getCurrency());
        data.setValidFrom(reqVO.getValidFrom());
        data.setValidTo(reqVO.getValidTo());
        data.setStatus(reqVO.getStatus());
        data.setRemark(reqVO.getRemark());
        return data;
    }
}
