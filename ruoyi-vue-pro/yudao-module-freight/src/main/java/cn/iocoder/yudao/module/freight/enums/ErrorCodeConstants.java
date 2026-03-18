package cn.iocoder.yudao.module.freight.enums;

import cn.iocoder.yudao.framework.common.exception.ErrorCode;

public interface ErrorCodeConstants {

    ErrorCode FREIGHT_LEAD_NOT_EXISTS = new ErrorCode(1_031_000_000, "货运线索不存在");
    ErrorCode FREIGHT_QUOTE_NOT_EXISTS = new ErrorCode(1_031_000_001, "货运报价不存在");
    ErrorCode FREIGHT_LEAD_SUBMIT_TOO_FAST = new ErrorCode(1_031_000_002, "提交过于频繁，请 60 秒后再试");

    ErrorCode FREIGHT_ORDER_NOT_EXISTS = new ErrorCode(1_031_000_003, "国际货代业务单不存在");
    ErrorCode FREIGHT_ORDER_STATUS_INVALID = new ErrorCode(1_031_000_004, "业务单状态流转不合法");
    ErrorCode FREIGHT_ORDER_DATA_INCOMPLETE = new ErrorCode(1_031_000_005, "业务单当前阶段数据不完整，请先补充必填信息");

    ErrorCode FREIGHT_ORDER_CONTRACT_INVALID = new ErrorCode(1_031_000_006, "业务单关联合同不合法或与客户不匹配");

}
