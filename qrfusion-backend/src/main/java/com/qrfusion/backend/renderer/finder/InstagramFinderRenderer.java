package com.qrfusion.backend.renderer.finder;

import com.qrfusion.backend.renderer.RenderOptions;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.geom.Ellipse2D;
import java.awt.geom.RoundRectangle2D;

@Component
public class InstagramFinderRenderer extends AbstractFinderRenderer {

    @Override
    public FinderStyle getStyle() {
        return FinderStyle.INSTAGRAM;
    }

    @Override
    protected void drawRing(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    ) {
        double arc = geo.moduleSize * 3.5;

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
        g.fill(new Ellipse2D.Double(
                geo.startX + geo.centerInset,
                geo.startY + geo.centerInset,
                geo.centerSize,
                geo.centerSize
        ));
    }
}