package cn.iocoder.yudao.module.freight.enums.freight;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public enum FreightOrderStatusEnum {

    DRAFT("DRAFT", "草稿"),
    PENDING_REVIEW("PENDING_REVIEW", "待审核"),
    PENDING_QUOTE("PENDING_QUOTE", "待报价"),
    QUOTED("QUOTED", "已报价"),
    PENDING_BOOKING("PENDING_BOOKING", "待订舱"),
    BOOKED("BOOKED", "已订舱"),
    CUSTOMS_PROCESSING("CUSTOMS_PROCESSING", "报关中"),
    IN_TRANSIT("IN_TRANSIT", "运输中"),
    ARRIVED("ARRIVED", "已到港"),
    SIGNED("SIGNED", "已签收"),
    COMPLETED("COMPLETED", "已完成"),
    CANCELLED("CANCELLED", "已取消");

    private static final Map<String, FreightOrderStatusEnum> MAP = new HashMap<>();

    static {
        Arrays.stream(values()).forEach(item -> MAP.put(item.getStatus(), item));
    }

    private final String status;
    private final String name;

    public static FreightOrderStatusEnum valueOfStatus(String status) {
        return MAP.get(status);
    }
}
