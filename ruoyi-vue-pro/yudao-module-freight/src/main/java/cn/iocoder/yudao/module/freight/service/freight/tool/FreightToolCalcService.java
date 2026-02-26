package cn.iocoder.yudao.module.freight.service.freight.tool;

import cn.iocoder.yudao.module.freight.controller.web.freight.vo.tool.WebFreightToolCalcRespVO;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.tool.WebFreightToolFclCalcReqVO;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.tool.WebFreightToolLclCalcReqVO;

public interface FreightToolCalcService {

    WebFreightToolCalcRespVO calcLcl(WebFreightToolLclCalcReqVO reqVO);

    WebFreightToolCalcRespVO calcFcl(WebFreightToolFclCalcReqVO reqVO);


}
