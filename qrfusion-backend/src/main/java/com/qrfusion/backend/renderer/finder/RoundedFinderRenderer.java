package com.qrfusion.backend.renderer.finder;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.geom.RoundRectangle2D;

@Component
public class RoundedFinderRenderer extends AbstractFinderRenderer {

    @Override
    public FinderStyle getStyle() {
        return FinderStyle.ROUNDED;
    }

    @Override
    protected void drawRing(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        double arc = Math.max(options.getCornerRadius() * 2.0, geo.moduleSize);

        fillRing(
                g,
                new RoundRectangle2D.Double(
                        geo.startX, geo.startY, geo.outerSize, geo.outerSize, arc, arc
                ),
                new RoundRectangle2D.Double(
                        geo.startX + geo.holeInset,
                        geo.startY + geo.holeInset,
                        geo.holeSize,
                        geo.holeSize,
                        arc,
                        arc
                )
        );
    }

    @Override
    protected void drawCenter(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        double arc = Math.max(options.getCornerRadius() * 2.0, geo.moduleSize);

        g.fill(new RoundRectangle2D.Double(
                geo.startX + geo.centerInset,
                geo.startY + geo.centerInset,
                geo.centerSize,
                geo.centerSize,
                arc,
                arc
        ));
    }
}
