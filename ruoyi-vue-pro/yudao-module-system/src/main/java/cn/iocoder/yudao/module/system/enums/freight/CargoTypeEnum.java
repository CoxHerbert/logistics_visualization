package cn.iocoder.yudao.module.system.enums.freight;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 货物类型枚举
 */
@Getter
@AllArgsConstructor
public enum CargoTypeEnum {

    GENERAL(10, "普货"),
    FRAGILE(20, "易碎"),
    COLD_CHAIN(30, "冷链");

    private final Integer type;
    private final String name;

}
