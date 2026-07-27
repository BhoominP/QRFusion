package com.qrfusion.backend.renderer.color;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;

@Component
public class SolidColorPainter implements ColorPainter {

    @Override
    public ColorMode getMode() {
        return ColorMode.SOLID;
    }

    @Override
    public void prepare(
            Graphics2D graphics,
            RenderOptions options,
            int imageWidth,
            int imageHeight
    ) {

        graphics.setColor(options.getForegroundColor());

    }
}