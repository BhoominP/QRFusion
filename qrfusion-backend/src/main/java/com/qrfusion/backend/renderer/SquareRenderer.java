package com.qrfusion.backend.renderer;

import org.springframework.stereotype.Component;

import java.awt.Graphics2D;

@Component
public class SquareRenderer implements ModuleRenderer {

    @Override
    public RenderStyle getStyle() {
        return RenderStyle.SQUARE;
    }

    @Override
    public void drawModule(
            Graphics2D graphics,
            int x,
            int y,
            int moduleSize,
            RenderOptions options
    ) {

        graphics.fillRect(
                x,
                y,
                moduleSize,
                moduleSize
        );

    }
}