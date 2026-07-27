package com.qrfusion.backend.renderer.finder;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.geom.Ellipse2D;

@Component
public class CircleFinderRenderer extends AbstractFinderRenderer {

    @Override
    public FinderStyle getStyle() {
        return FinderStyle.CIRCLE;
    }

    @Override
    protected void drawRing(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        fillRing(
                g,
                new Ellipse2D.Double(
                        geo.startX, geo.startY, geo.outerSize, geo.outerSize
                ),
                new Ellipse2D.Double(
                        geo.startX + geo.holeInset,
                        geo.startY + geo.holeInset,
                        geo.holeSize,
                        geo.holeSize
                )
        );
    }

    @Override
    protected void drawCenter(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        g.fill(new Ellipse2D.Double(
                geo.startX + geo.centerInset,
                geo.startY + geo.centerInset,
                geo.centerSize,
                geo.centerSize
        ));
    }
}
