package cn.iocoder.yudao.module.freight.service.freight;

import cn.iocoder.yudao.module.freight.controller.web.freight.vo.clue.WebFreightPortalClueCreateReqVO;

import javax.validation.Valid;

public interface FreightPortalClueService {

    Long createClue(@Valid WebFreightPortalClueCreateReqVO createReqVO);

}
