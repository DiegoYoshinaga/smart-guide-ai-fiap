package com.smartguide.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.stream.Stream;

/**
 * Libera o acesso a API apenas para o frontend em desenvolvimento
 * (Live Server em localhost/127.0.0.1) e para origens extras configuradas
 * pela propriedade app.cors.allowed-origin-patterns.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private static final String[] PADROES_LOCAIS = {
            "http://localhost:[*]",
            "http://127.0.0.1:[*]"
    };

    private final String[] origensExtras;

    public CorsConfig(@Value("${app.cors.allowed-origin-patterns:}") String origensExtras) {
        this.origensExtras = Arrays.stream(origensExtras.split(","))
                .map(String::trim)
                .filter(origem -> !origem.isEmpty())
                .toArray(String[]::new);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origens = Stream.concat(Arrays.stream(PADROES_LOCAIS), Arrays.stream(origensExtras))
                .toArray(String[]::new);

        registry.addMapping("/api/**")
                .allowedOriginPatterns(origens)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept")
                .maxAge(3600);
    }
}
