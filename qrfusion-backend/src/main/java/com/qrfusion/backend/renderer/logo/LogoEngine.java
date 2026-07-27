package com.qrfusion.backend.renderer.logo;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LogoEngine {

    private final List<LogoRenderer> renderers;

    public LogoEngine(List<LogoRenderer> renderers) {
        this.renderers = renderers;
    }

    public LogoRenderer getRenderer(
            LogoShape shape
    ) {

        return renderers.stream()
                .filter(r -> r.getShape() == shape)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No LogoRenderer for " + shape
                        ));

    }

}