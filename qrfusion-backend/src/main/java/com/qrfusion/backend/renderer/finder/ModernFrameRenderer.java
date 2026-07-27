package com.qrfusion.backend.renderer.finder;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.BasicStroke;
import java.awt.Graphics2D;
import java.awt.Stroke;
import java.awt.geom.Rectangle2D;

@Component
public class ModernFrameRenderer extends AbstractFinderRenderer {

    @Override
    public FinderStyle getStyle() {
        return FinderStyle.MODERN_FRAME;
    }

    @Override
    protected void drawRing(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        // This style doesn't use fillRing()'s Area-subtraction approach -
        // it draws a thin stroked outline instead of a thick filled ring,
        // which is what gives it the minimalist look.
        float strokeWidth = geo.moduleSize * 0.6f;
        Stroke originalStroke = g.getStroke();

        g.setStroke(new BasicStroke(strokeWidth));

        double inset = strokeWidth / 2;

        g.draw(new Rectangle2D.Double(
                geo.startX + inset,
                geo.startY + inset,
                geo.outerSize - strokeWidth,
                geo.outerSize - strokeWidth
        ));

        g.setStroke(originalStroke);
    }

    @Override
    protected void drawCenter(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        g.fillRect(
                geo.startX + geo.centerInset,
                geo.startY + geo.centerInset,
                geo.centerSize,
                geo.centerSize
        );
    }
}
