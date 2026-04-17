package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.module.freight.controller.admin.freight.vo.quote.AdminFreightQuoteCreateReqVO;
import cn.iocoder.yudao.module.freight.convert.freight.FreightQuoteConvert;
import cn.iocoder.yudao.module.freight.dal.dataobject.freight.FreightQuoteDO;
import cn.iocoder.yudao.module.freight.dal.mysql.freight.FreightQuoteMapper;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.math.BigDecimal;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.freight.enums.ErrorCodeConstants.FREIGHT_QUOTE_NOT_EXISTS;

@Service
@Validated
public class FreightQuoteServiceImpl implements FreightQuoteService {

    @Resource
    private FreightQuoteMapper freightQuoteMapper;

    @Override
    public Long createQuote(@Valid AdminFreightQuoteCreateReqVO createReqVO) {
        FreightQuoteDO quote = FreightQuoteConvert.INSTANCE.convert(createReqVO);
        quote.setSurcharge(defaultNumber(createReqVO.getSurcharge()));
        quote.setTotal(calculateTotal(quote.getUnitPrice(), quote.getQuantity(), quote.getSurcharge()));
        freightQuoteMapper.insert(quote);
        return quote.getId();
    }

    @Override
    public FreightQuoteDO getQuote(Long id) {
        FreightQuoteDO quote = freightQuoteMapper.selectById(id);
        if (quote == null) {
            throw exception(FREIGHT_QUOTE_NOT_EXISTS);
        }
        return quote;
    }

    private BigDecimal calculateTotal(BigDecimal unitPrice, BigDecimal quantity, BigDecimal surcharge) {
        return unitPrice.multiply(quantity).add(surcharge);
    }

    private BigDecimal defaultNumber(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

}
