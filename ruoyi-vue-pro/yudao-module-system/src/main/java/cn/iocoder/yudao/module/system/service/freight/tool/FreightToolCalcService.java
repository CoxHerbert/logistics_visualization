package cn.iocoder.yudao.module.system.service.freight.tool;

import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolCalcRespVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolFclCalcReqVO;
import cn.iocoder.yudao.module.system.controller.web.freight.vo.tool.WebFreightToolLclCalcReqVO;

public interface FreightToolCalcService {

    WebFreightToolCalcRespVO calcLcl(WebFreightToolLclCalcReqVO reqVO);

    WebFreightToolCalcRespVO calcFcl(WebFreightToolFclCalcReqVO reqVO);


}
