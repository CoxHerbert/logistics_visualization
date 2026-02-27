package cn.iocoder.yudao.module.freight.service.freight.tool;

import cn.iocoder.yudao.framework.test.core.ut.BaseMockitoUnitTest;
import cn.iocoder.yudao.module.infra.api.config.ConfigApi;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.tool.WebFreightToolCalcRespVO;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.tool.WebFreightToolFclCalcReqVO;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.tool.WebFreightToolLclCalcReqVO;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;

public class FreightToolCalcServiceImplTest extends BaseMockitoUnitTest {

    @InjectMocks
    private FreightToolCalcServiceImpl freightToolCalcService;

    @Mock
    private ConfigApi configApi;

    @Test
    public void testCalcLcl_defaultRules() {
        WebFreightToolLclCalcReqVO reqVO = new WebFreightToolLclCalcReqVO();
        reqVO.setOrigin("SHA");
        reqVO.setDestination("LAX");
        reqVO.setVolumeCbm(new BigDecimal("2"));
        reqVO.setWeightKg(new BigDecimal("500"));

        when(configApi.getConfigValueByKey("freight.tool.lcl.ratePerCbm")).thenReturn(null);
        when(configApi.getConfigValueByKey("freight.tool.lcl.ratePerKg")).thenReturn(null);
        when(configApi.getConfigValueByKey("freight.tool.lcl.docFee")).thenReturn(null);

        WebFreightToolCalcRespVO respVO = freightToolCalcService.calcLcl(reqVO);
        assertEquals(2, respVO.getCostBreakdown().size());
        assertEquals(new BigDecimal("920"), respVO.getTotal()); // max(2*420, 500*1.2) + 80 = 920
        assertFalse(respVO.getNotes().isEmpty());
    }

    @Test
    public void testCalcFcl_overrideRules() {
        WebFreightToolFclCalcReqVO reqVO = new WebFreightToolFclCalcReqVO();
        reqVO.setOrigin("NGB");
        reqVO.setDestination("NYC");
        reqVO.setContainerType("40HQ");
        reqVO.setContainerCount(new BigDecimal("3"));

        when(configApi.getConfigValueByKey("freight.tool.fcl.ratePerContainer")).thenReturn("1500");
        when(configApi.getConfigValueByKey("freight.tool.fcl.docFee")).thenReturn("200");

        WebFreightToolCalcRespVO respVO = freightToolCalcService.calcFcl(reqVO);
        assertEquals(2, respVO.getCostBreakdown().size());
        assertEquals(new BigDecimal("4700"), respVO.getTotal()); // 3 * 1500 + 200
        assertFalse(respVO.getNotes().isEmpty());
    }

}
