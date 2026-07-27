package com.qrfusion.backend.renderer.glass;

import org.springframework.stereotype.Component;

import java.awt.*;

@Component
public class GlassReflection {

    /**
     * Called once before rendering begins.
     * Reserved for future rendering configuration.
     */
    public void prepare(Graphics2D g) {

        g.setRenderingHint(
                RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON
        );

        g.setRenderingHint(
                RenderingHints.KEY_RENDERING,
                RenderingHints.VALUE_RENDER_QUALITY
        );

        g.setRenderingHint(
                RenderingHints.KEY_ALPHA_INTERPOLATION,
                RenderingHints.VALUE_ALPHA_INTERPOLATION_QUALITY
        );
    }

    /**
     * Draws the glossy reflection on top of a glass module.
     */
    public void draw(
            Graphics2D g,
            int x,
            int y,
            int size
    ) {

        Paint oldPaint = g.getPaint();
        Composite oldComposite = g.getComposite();

        // Reflection opacity
        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.85f
                )
        );

        // Vertical gradient
        GradientPaint gradient =
                new GradientPaint(
                        x,
                        y,
                        new Color(255, 255, 255, 140),

                        x,
                        y + size,
                        new Color(255, 255, 255, 0)
                );

        g.setPaint(gradient);

        int radius = Math.max(4, size / 4);

        g.fillRoundRect(
                x + 1,
                y + 1,
                size - 2,
                Math.max(2, size / 2),
                radius,
                radius
        );

        /*
         * Small specular highlight
         */

        g.setPaint(
                new Color(
                        255,
                        255,
                        255,
                        90
                )
        );

        int highlight = Math.max(2, size / 5);

        g.fillOval(
                x + size / 5,
                y + size / 5,
                highlight,
                highlight
        );

        g.setPaint(oldPaint);
        g.setComposite(oldComposite);
    }
}