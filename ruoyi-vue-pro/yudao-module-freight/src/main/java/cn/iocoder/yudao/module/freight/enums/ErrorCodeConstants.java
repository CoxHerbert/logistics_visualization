package cn.iocoder.yudao.module.freight.enums;

import cn.iocoder.yudao.framework.common.exception.ErrorCode;

/**
 * Freight 错误码枚举类
 *
 * freight 模块，使用 1-031-000-000 段
 */
public interface ErrorCodeConstants {

    // ========== 货运线索 ==========
    ErrorCode FREIGHT_LEAD_NOT_EXISTS = new ErrorCode(1_031_000_000, "货运线索不存在");
    ErrorCode FREIGHT_QUOTE_NOT_EXISTS = new ErrorCode(1_031_000_001, "货运报价不存在");
    ErrorCode FREIGHT_LEAD_SUBMIT_TOO_FAST = new ErrorCode(1_031_000_002, "提交过于频繁，请 60 秒后再试");

}
