package cn.iocoder.yudao.module.crm.enums.common;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjUtil;
import cn.iocoder.yudao.framework.common.core.ArrayValuable;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@RequiredArgsConstructor
@Getter
public enum CrmBizTypeEnum implements ArrayValuable<Integer> {

    CRM_CLUE(1, "线索"),
    CRM_CUSTOMER(2, "客户"),
    CRM_CONTACT(3, "联系人"),
    CRM_BUSINESS(4, "商机"),
    CRM_CONTRACT(5, "合同"),
    CRM_PRODUCT(6, "产品"),
    CRM_RECEIVABLE(7, "回款"),
    CRM_RECEIVABLE_PLAN(8, "回款计划"),
    CRM_CUSTOMER_BANK_ACCOUNT(9, "银行账户"),
    CRM_CUSTOMER_LICENSE(10, "营业执照/资质");

    public static final Integer[] ARRAYS =
            Arrays.stream(values()).map(CrmBizTypeEnum::getType).toArray(Integer[]::new);

    private final Integer type;
    private final String name;

    public static String getNameByType(Integer type) {
        CrmBizTypeEnum typeEnum = CollUtil.findOne(CollUtil.newArrayList(CrmBizTypeEnum.values()),
                item -> ObjUtil.equal(item.type, type));
        return typeEnum == null ? null : typeEnum.getName();
    }

    @Override
    public Integer[] array() {
        return ARRAYS;
    }
}
