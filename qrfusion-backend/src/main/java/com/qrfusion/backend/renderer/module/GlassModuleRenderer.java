package com.qrfusion.backend.renderer.module;

import com.qrfusion.backend.renderer.ModuleRenderer;
import com.qrfusion.backend.renderer.RenderOptions;
import com.qrfusion.backend.renderer.RenderStyle;
import org.springframework.stereotype.Component;

import java.awt.*;

@Component
public class GlassModuleRenderer implements ModuleRenderer {

    @Override
    public RenderStyle getStyle() {
        return RenderStyle.GLASS;
    }

    @Override
    public void drawModule(
            Graphics2D g,
            int x,
            int y,
            int size,
            RenderOptions options
    ) {

        Composite originalComposite = g.getComposite();
        Stroke originalStroke = g.getStroke();

        g.setRenderingHint(
                RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON
        );

        /*
         * -------------------------------------
         * Shadow
         * -------------------------------------
         */

        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.12f
                )
        );

        g.setColor(Color.BLACK);

        g.fillRoundRect(
                x + 2,
                y + 2,
                size,
                size,
                size / 2,
                size / 2
        );

        /*
         * -------------------------------------
         * Glass Body
         * -------------------------------------
         */

        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.55f
                )
        );

        g.setColor(options.getForegroundColor());

        g.fillRoundRect(
                x,
                y,
                size,
                size,
                size / 2,
                size / 2
        );

        /*
         * -------------------------------------
         * White Glass Border
         * -------------------------------------
         */

        g.setComposite(AlphaComposite.SrcOver);

        g.setStroke(new BasicStroke(1.2f));

        g.setColor(
                new Color(
                        255,
                        255,
                        255,
                        170
                )
        );

        g.drawRoundRect(
                x,
                y,
                size,
                size,
                size / 2,
                size / 2
        );

        /*
         * -------------------------------------
         * Glass Shine
         * -------------------------------------
         */

        g.setColor(
                new Color(
                        255,
                        255,
                        255,
                        90
                )
        );

        g.fillRoundRect(
                x + 1,
                y + 1,
                size - 2,
                Math.max(2, size / 3),
                size / 2,
                size / 2
        );

        /*
         * -------------------------------------
         * Tiny Specular Highlight
         * -------------------------------------
         */

        g.setColor(
                new Color(
                        255,
                        255,
                        255,
                        60
                )
        );

        g.fillOval(
                x + size / 5,
                y + size / 5,
                Math.max(2, size / 6),
                Math.max(2, size / 6)
        );

        /*
         * -------------------------------------
         * Restore Graphics State
         * -------------------------------------
         */

        g.setComposite(originalComposite);
        g.setStroke(originalStroke);
    }
}