package cn.iocoder.yudao.module.freight.controller.admin.freight.vo.order;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class AdminFreightOrderFeeBatchSaveReqVO {

    @NotNull(message = "orderId can not be null")
    private Long orderId;

    @Valid
    private List<AdminFreightOrderFeeSaveReqVO> fees;
}
