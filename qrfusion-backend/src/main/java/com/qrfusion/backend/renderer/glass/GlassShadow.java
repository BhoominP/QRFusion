package com.qrfusion.backend.renderer.glass;

import org.springframework.stereotype.Component;

import java.awt.*;

@Component
public class GlassShadow {

    /**
     * Configure rendering quality once.
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
     * Draws a soft shadow behind a glass module.
     */
    public void draw(
            Graphics2D g,
            int x,
            int y,
            int size
    ) {

        Composite oldComposite = g.getComposite();
        Paint oldPaint = g.getPaint();

        int radius = Math.max(4, size / 4);

        /*
         * Shadow Layer 1
         */
        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.10f
                )
        );

        g.setPaint(Color.BLACK);

        g.fillRoundRect(
                x + 2,
                y + 2,
                size,
                size,
                radius,
                radius
        );

        /*
         * Shadow Layer 2
         * (slightly larger and lighter)
         */
        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.05f
                )
        );

        g.fillRoundRect(
                x + 3,
                y + 3,
                size,
                size,
                radius,
                radius
        );

        /*
         * Shadow Layer 3
         */
        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.03f
                )
        );

        g.fillRoundRect(
                x + 4,
                y + 4,
                size,
                size,
                radius,
                radius
        );

        g.setPaint(oldPaint);
        g.setComposite(oldComposite);
    }
}