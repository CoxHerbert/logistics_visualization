package cn.iocoder.yudao.module.freight.controller.admin.price.vo;

import cn.iocoder.yudao.framework.common.pojo.PageParam;
import lombok.Data;

@Data
public class FreightPricePageReqVO extends PageParam {
    private Integer transportType;
    private String origin;
    private String destination;
    private Integer status;
}
