package com.qrfusion.backend.renderer.pattern;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PatternEngine {

    private final List<PatternRenderer> renderers;

    public PatternEngine(List<PatternRenderer> renderers) {
        this.renderers = renderers;
    }

    public PatternRenderer getRenderer(PatternStyle style) {

        return renderers.stream()
                .filter(r -> r.getStyle() == style)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No PatternRenderer for " + style
                        ));
    }
}