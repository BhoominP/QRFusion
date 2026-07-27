package com.qrfusion.backend.renderer.finder;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FinderEngine {

    private final List<FinderRenderer> renderers;

    public FinderEngine(List<FinderRenderer> renderers) {
        this.renderers = renderers;
    }

    public FinderRenderer getRenderer(
            FinderStyle style
    ) {

        return renderers.stream()
                .filter(r -> r.getStyle() == style)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No finder renderer: " + style
                        ));

    }

}