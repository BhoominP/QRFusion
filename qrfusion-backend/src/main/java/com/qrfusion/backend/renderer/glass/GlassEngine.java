package com.qrfusion.backend.renderer.glass;

import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

@Component
public class GlassEngine {

    private final GlassBlur blur;
    private final GlassReflection reflection;
    private final GlassShadow shadow;

    public GlassEngine(
            GlassBlur blur,
            GlassReflection reflection,
            GlassShadow shadow
    ) {
        this.blur = blur;
        this.reflection = reflection;
        this.shadow = shadow;
    }

    /**
     * Prepare graphics before drawing glass modules.
     */
    public void prepare(
            Graphics2D g,
            BufferedImage background,
            int width,
            int height
    ) {

        // Draw blurred background (if provided)
        if (background != null) {
            blur.draw(
                    g,
                    background,
                    width,
                    height
            );
        }

        // Enable rendering hints
        shadow.prepare(g);
        reflection.prepare(g);
    }

    /**
     * Draw module shadow.
     */
    public void drawShadow(
            Graphics2D g,
            int x,
            int y,
            int size
    ) {
        shadow.draw(
                g,
                x,
                y,
                size
        );
    }

    /**
     * Draw glass highlight.
     */
    public void drawReflection(
            Graphics2D g,
            int x,
            int y,
            int size
    ) {
        reflection.draw(
                g,
                x,
                y,
                size
        );
    }
}