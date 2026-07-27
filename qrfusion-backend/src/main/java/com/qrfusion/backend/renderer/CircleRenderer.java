package com.qrfusion.backend.renderer;

import org.springframework.stereotype.Component;

import java.awt.Graphics2D;

@Component
public class CircleRenderer implements ModuleRenderer {

    @Override
    public RenderStyle getStyle() {
        return RenderStyle.CIRCLE;
    }

    @Override
    public void drawModule(
            Graphics2D graphics,
            int x,
            int y,
            int moduleSize,
            RenderOptions options
    ) {

        // Leave some spacing so the circles are clearly visible
        int padding = Math.max(1, moduleSize / 4);

        graphics.fillOval(
                x + padding,
                y + padding,
                moduleSize - padding * 2,
                moduleSize - padding * 2
        );
    }
}