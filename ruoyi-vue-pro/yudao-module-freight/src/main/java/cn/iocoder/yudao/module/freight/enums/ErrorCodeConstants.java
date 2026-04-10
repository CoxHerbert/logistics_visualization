package cn.iocoder.yudao.module.freight.enums;

import cn.iocoder.yudao.framework.common.exception.ErrorCode;

public interface ErrorCodeConstants {

    ErrorCode FREIGHT_LEAD_NOT_EXISTS = new ErrorCode(1_031_000_000, "货运线索不存在");
    ErrorCode FREIGHT_QUOTE_NOT_EXISTS = new ErrorCode(1_031_000_001, "货运报价不存在");
    ErrorCode FREIGHT_LEAD_SUBMIT_TOO_FAST = new ErrorCode(1_031_000_002, "提交过于频繁，请 60 秒后再试");

}
