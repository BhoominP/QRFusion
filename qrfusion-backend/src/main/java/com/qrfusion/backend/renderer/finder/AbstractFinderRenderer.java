package com.qrfusion.backend.renderer.finder;

import com.qrfusion.backend.renderer.RenderOptions;

import java.awt.Graphics2D;
import java.awt.Shape;
import java.awt.geom.Area;

/**
 * Base class for finder-eye renderers. Handles the one thing every eye
 * style shares - computing the 7/5/3-module geometry once via
 * FinderGeometry - and leaves each subclass to implement only its own
 * ring and center shapes. New styles are typically just two small
 * methods (drawRing + drawCenter), not a full drawFinder() rewrite.
 */
public abstract class AbstractFinderRenderer implements FinderRenderer {

    @Override
    public final void drawFinder(
            Graphics2D g,
            int startX,
            int startY,
            int moduleSize,
            RenderOptions options
    ) {

        FinderGeometry geometry = new FinderGeometry(startX, startY, moduleSize);

        drawRing(g, geometry, options);
        drawCenter(g, geometry, options);
    }

    /**
     * Draws the outer ring (the 7x7 eye minus its 5x5 hole, i.e. the
     * 1-module-thick border). Most styles can implement this in one line
     * via fillRing(g, outerShape, holeShape) below. Styles that don't
     * draw a filled ring at all (e.g. a stroked outline) can ignore
     * fillRing and draw directly here instead.
     */
    protected abstract void drawRing(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    );

    /**
     * Draws the solid 3x3 center dot/square.
     */
    protected abstract void drawCenter(
            Graphics2D g,
            FinderGeometry geo,
            RenderOptions options
    );

    /**
     * Convenience helper for the common case: ring = outerShape minus
     * holeShape, filled in one call. Subclasses only need to describe
     * their two shapes; the Area subtraction is handled once, here.
     */
    protected void fillRing(
            Graphics2D g,
            Shape outerShape,
            Shape holeShape
    ) {
        Area ring = new Area(outerShape);
        ring.subtract(new Area(holeShape));
        g.fill(ring);
    }
}
