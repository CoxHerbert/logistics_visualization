package cn.iocoder.yudao.module.system.enums.freight;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 运输方式枚举
 */
@Getter
@AllArgsConstructor
public enum ShipModeEnum {

    EXPRESS(10, "快递"),
    LESS_THAN_TRUCKLOAD(20, "零担"),
    FULL_TRUCKLOAD(30, "整车");

    private final Integer mode;
    private final String name;

}
