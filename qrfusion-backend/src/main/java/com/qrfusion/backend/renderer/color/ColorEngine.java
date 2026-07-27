package com.qrfusion.backend.renderer.color;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ColorEngine {

    private final List<ColorPainter> painters;

    public ColorEngine(List<ColorPainter> painters) {
        this.painters = painters;
    }

    public ColorPainter getPainter(ColorMode mode) {

        return painters.stream()
                .filter(p -> p.getMode() == mode)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No painter found for " + mode
                        ));

    }
}