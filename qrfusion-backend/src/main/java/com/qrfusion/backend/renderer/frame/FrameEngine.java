package com.qrfusion.backend.renderer.frame;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FrameEngine {

    private final List<FrameRenderer> renderers;

    public FrameEngine(List<FrameRenderer> renderers) {
        this.renderers = renderers;
    }

    public FrameRenderer getRenderer(FrameStyle style) {
        return renderers.stream()
                .filter(r -> r.getStyle() == style)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No FrameRenderer for " + style
                        ));
    }
}