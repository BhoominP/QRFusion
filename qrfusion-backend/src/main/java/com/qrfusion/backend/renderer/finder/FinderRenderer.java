package com.qrfusion.backend.renderer.finder;

import com.qrfusion.backend.renderer.RenderOptions;

import java.awt.Graphics2D;

public interface FinderRenderer {

    FinderStyle getStyle();

    /**
     * Draws one complete finder-pattern "eye" (the 7x7 position detection
     * square) in a single call, given the pixel coordinates of its
     * top-left module. Called exactly 3 times per QR code - once per
     * corner - rather than once per module, so eye styles (circle,
     * rounded, instagram, etc.) render as one clean unified shape instead
     * of a grid of disconnected pieces.
     */
    void drawFinder(
            Graphics2D g,
            int startX,
            int startY,
            int moduleSize,
            RenderOptions options
    );

}