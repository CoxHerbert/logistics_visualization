package cn.iocoder.yudao.module.freight.controller.web.freight;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.ratelimiter.core.annotation.RateLimiter;
import cn.iocoder.yudao.framework.ratelimiter.core.keyresolver.impl.ClientIpRateLimiterKeyResolver;
import cn.iocoder.yudao.module.freight.controller.web.freight.vo.clue.WebFreightPortalClueCreateReqVO;
import cn.iocoder.yudao.module.freight.service.freight.FreightPortalClueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.annotation.security.PermitAll;
import javax.validation.Valid;
import java.util.concurrent.TimeUnit;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "门户端 - 货运线索")
@RestController
@RequestMapping("/freight/portal-clue")
@Validated
public class FreightPortalClueController {

    @Resource
    private FreightPortalClueService freightPortalClueService;

    @PostMapping("/create")
    @PermitAll
    @Operation(summary = "门户端提交货运线索")
    @RateLimiter(time = 1, timeUnit = TimeUnit.HOURS, count = 3,
            keyResolver = ClientIpRateLimiterKeyResolver.class,
            message = "提交过于频繁，请 1 小时后再试")
    public CommonResult<Long> createClue(@Valid @RequestBody WebFreightPortalClueCreateReqVO createReqVO) {
        return success(freightPortalClueService.createClue(createReqVO));
    }

}
