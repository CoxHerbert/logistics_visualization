package cn.iocoder.yudao.module.system.enums.freight;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 线索来源枚举
 */
@Getter
@AllArgsConstructor
public enum LeadSourceEnum {

    WEB(10, "Web"),
    ADMIN(20, "Admin");

    private final Integer source;
    private final String name;

}
