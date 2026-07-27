package com.qrfusion.backend.renderer.finder;

/**
 * Centralizes the module-grid math shared by every finder-eye renderer.
 * A finder eye is always a 7x7 block: a 1-module-thick outer ring, a
 * 1-module white gap, and a solid 3x3 center - only the SHAPES drawn
 * within that grid differ between styles (square/rounded/circle/etc.).
 * Computed once per drawFinder() call and handed to each renderer.
 */
public class FinderGeometry {

    public final int startX;
    public final int startY;
    public final int moduleSize;

    public final int outerSize;   // 7 modules - the whole eye
    public final int holeSize;    // 5 modules - the gap punched out of the ring
    public final int holeInset;   // 1 module  - offset of the hole from startX/startY
    public final int centerSize;  // 3 modules - the solid center dot/square
    public final int centerInset; // 2 modules - offset of the center from startX/startY

    public FinderGeometry(int startX, int startY, int moduleSize) {
        this.startX = startX;
        this.startY = startY;
        this.moduleSize = moduleSize;

        this.outerSize = 7 * moduleSize;
        this.holeSize = 5 * moduleSize;
        this.holeInset = moduleSize;
        this.centerSize = 3 * moduleSize;
        this.centerInset = 2 * moduleSize;
    }
}
