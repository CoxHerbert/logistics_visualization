package cn.iocoder.yudao.server.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 兼容历史配置中已经下线的微信自动配置类，避免 Spring Boot 因无效 exclude 启动失败。
 */
public class LegacyWxAutoConfigurationExcludeSanitizer implements EnvironmentPostProcessor, Ordered {

    private static final String EXCLUDE_PROPERTY = "spring.autoconfigure.exclude";

    private static final List<String> LEGACY_EXCLUDES = List.of(
            "com.binarywang.spring.starter.wxjava.mp.config.WxMpServiceAutoConfiguration",
            "com.binarywang.spring.starter.wxjava.miniapp.config.WxMaServiceAutoConfiguration"
    );

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        List<String> excludes = Binder.get(environment)
                .bind(EXCLUDE_PROPERTY, Bindable.listOf(String.class))
                .orElse(List.of());
        if (excludes.isEmpty()) {
            return;
        }

        List<String> sanitizedExcludes = new ArrayList<>(excludes);
        boolean modified = false;
        for (String legacyExclude : LEGACY_EXCLUDES) {
            if (sanitizedExcludes.contains(legacyExclude) && !isPresent(legacyExclude)) {
                sanitizedExcludes.removeIf(legacyExclude::equals);
                modified = true;
            }
        }
        if (!modified) {
            return;
        }

        Map<String, Object> source = new LinkedHashMap<>();
        source.put(EXCLUDE_PROPERTY, sanitizedExcludes);
        environment.getPropertySources().addFirst(new MapPropertySource("legacyWxExcludeSanitizer", source));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private boolean isPresent(String className) {
        try {
            Class.forName(className, false, getClass().getClassLoader());
            return true;
        } catch (ClassNotFoundException ex) {
            return false;
        }
    }

}
