package com.qrfusion.backend.renderer.decorative;

import org.springframework.stereotype.Component;

import java.awt.Color;
import java.awt.Graphics2D;
import java.util.Random;

/**
 * Purely decorative accent dots confined to the single outermost ring of
 * the canvas. With quietZone >= 4 this guarantees at least 3 full
 * modules of untouched blank margin between the dots and the actual
 * symbol - the margin scanners rely on to lock onto the finder patterns
 * is never touched.
 */
@Component
public class DecorativeDotsRenderer {

    private static final double DENSITY = 0.35;
    private static final double DOT_SCALE = 0.35;
    private static final int MIN_QUIET_ZONE = 4;

    public void render(
            Graphics2D g,
            int matrixWidth,
            int matrixHeight,
            int moduleSize,
            int quietZone,
            Color accentColor,
            String seed
    ) {

        if (quietZone < MIN_QUIET_ZONE) {
            return;
        }

        int totalWidth = matrixWidth + quietZone * 2;
        int totalHeight = matrixHeight + quietZone * 2;

        Random random = new Random((seed == null ? 0 : seed.hashCode()) ^ 0x5DEECE66DL);

        g.setColor(accentColor);

        for (int y = 0; y < totalHeight; y++) {
            for (int x = 0; x < totalWidth; x++) {

                boolean onOuterEdge = x == 0 || y == 0 || x == totalWidth - 1 || y == totalHeight - 1;

                if (!onOuterEdge || random.nextDouble() > DENSITY) {
                    continue;
                }

                double diameter = moduleSize * DOT_SCALE;
                double cx = x * moduleSize + moduleSize / 2.0;
                double cy = y * moduleSize + moduleSize / 2.0;

                g.fillOval(
                        (int) (cx - diameter / 2),
                        (int) (cy - diameter / 2),
                        (int) diameter,
                        (int) diameter
                );
            }
        }
    }
}