package cn.iocoder.yudao.module.system.service.freight;

import cn.hutool.core.util.StrUtil;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 货运线索防刷服务（最小实现）：同一 IP + 联系方式，60 秒内仅允许一次提交。
 */
@Service
public class FreightLeadAntiBrushService {

    private static final Duration REPEAT_WINDOW = Duration.ofSeconds(60);

    private final Map<String, LocalDateTime> latestSubmitTime = new ConcurrentHashMap<>();

    public boolean isLimited(String ip, String contactValue) {
        if (StrUtil.isBlank(contactValue)) {
            return false;
        }
        String normalizedIp = StrUtil.blankToDefault(ip, "unknown");
        String key = normalizedIp + ":" + contactValue.trim();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastTime = latestSubmitTime.putIfAbsent(key, now);
        if (lastTime == null) {
            return false;
        }
        if (Duration.between(lastTime, now).compareTo(REPEAT_WINDOW) < 0) {
            return true;
        }
        latestSubmitTime.put(key, now);
        return false;
    }

}
