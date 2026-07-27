package com.qrfusion.backend.renderer.color;

import com.qrfusion.backend.renderer.RenderOptions;

import java.awt.Graphics2D;

public interface ColorPainter {

    ColorMode getMode();

    /**
     * Configures the Graphics2D's active Paint/Color once, before any
     * modules are drawn. For SOLID this is just graphics.setColor(...).
     * For gradients this sets graphics.setPaint(new GradientPaint(...)).
     * Every fillRect/fillOval/etc. drawn afterward (finder patterns and
     * data modules alike) automatically picks up whatever Paint is
     * configured here - no per-module work required.
     */
    void prepare(
            Graphics2D graphics,
            RenderOptions options,
            int imageWidth,
            int imageHeight
    );

}