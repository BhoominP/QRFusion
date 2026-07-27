package com.qrfusion.backend.renderer.color;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.MultipleGradientPaint;
import java.awt.Point;
import java.awt.RadialGradientPaint;

@Component
public class RadialGradientPainter implements ColorPainter {

    @Override
    public ColorMode getMode() {
        return ColorMode.RADIAL_GRADIENT;
    }

    @Override
    public void prepare(
            Graphics2D graphics,
            RenderOptions options,
            int imageWidth,
            int imageHeight
    ) {

        // startColor at the center, endColor at the edge - radius reaches
        // the far corner so the gradient fully covers the image with no
        // hard endColor ring showing inside the QR code itself.
        float centerX = imageWidth / 2f;
        float centerY = imageHeight / 2f;

        float radius = (float) Math.sqrt(
                Math.pow(imageWidth / 2.0, 2) + Math.pow(imageHeight / 2.0, 2)
        );

        // Guard against a degenerate 0-radius image (shouldn't happen in
        // practice, but RadialGradientPaint throws on radius <= 0).
        if (radius <= 0f) {
            radius = 1f;
        }

        RadialGradientPaint gradient = new RadialGradientPaint(
                new Point((int) centerX, (int) centerY),
                radius,
                new float[]{0f, 1f},
                new java.awt.Color[]{
                        options.getStartColor(),
                        options.getEndColor()
                },
                MultipleGradientPaint.CycleMethod.NO_CYCLE
        );

        graphics.setPaint(gradient);
    }
}