package cn.iocoder.yudao.module.system.enums.freight;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 线索状态枚举
 */
@Getter
@AllArgsConstructor
public enum LeadStatusEnum {

    NEW(10, "新建"),
    FOLLOWING(20, "跟进中"),
    WON(30, "已转化"),
    LOST(40, "已关闭");

    private final Integer status;
    private final String name;

}
