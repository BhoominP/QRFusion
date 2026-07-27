package com.qrfusion.backend.renderer.color;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.GradientPaint;
import java.awt.Graphics2D;

@Component
public class LinearGradientPainter implements ColorPainter {

    @Override
    public ColorMode getMode() {
        return ColorMode.LINEAR_GRADIENT;
    }

    @Override
    public void prepare(
            Graphics2D graphics,
            RenderOptions options,
            int imageWidth,
            int imageHeight
    ) {

        // Top-to-bottom gradient across the full image: startColor at the
        // top, endColor at the bottom. Java2D interpolates every pixel in
        // between automatically - no per-module work needed.
        GradientPaint gradient = new GradientPaint(
                0,
                0,
                options.getStartColor(),
                0,
                imageHeight,
                options.getEndColor()
        );

        graphics.setPaint(gradient);
    }
}