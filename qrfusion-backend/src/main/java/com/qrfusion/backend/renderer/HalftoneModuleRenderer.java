package com.qrfusion.backend.renderer;

import org.springframework.stereotype.Component;

import java.awt.Graphics2D;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;

@Component
public class HalftoneModuleRenderer implements ModuleRenderer {

    // Never let a module shrink below this fraction of moduleSize, or the
    // overall QR contrast drops too far and scanners stop reading it
    // reliably - even in visually "light" regions of the source image.
    private static final double MIN_DOT_RATIO = 0.45;

    @Override
    public RenderStyle getStyle() {
        return RenderStyle.HALFTONE;
    }

    @Override
    public void drawModule(
            Graphics2D g,
            int x,
            int y,
            int moduleSize,
            RenderOptions options
    ) {

        double brightness = sampleBrightness(x, y, moduleSize, options);

        // Darker source pixels -> bigger dot. Lighter source pixels ->
        // smaller dot, clamped at MIN_DOT_RATIO to protect scanability.
        double sizeRatio = MIN_DOT_RATIO
                + (1.0 - MIN_DOT_RATIO) * (1.0 - brightness);

        int dotSize = (int) Math.round(moduleSize * sizeRatio);
        int offset = (moduleSize - dotSize) / 2;

        g.fill(new Ellipse2D.Double(
                x + offset,
                y + offset,
                dotSize,
                dotSize
        ));
    }

    /**
     * Average brightness (0 = black, 1 = white) of the halftone source
     * image under this module's footprint. QrRenderer pre-scales the
     * source image to the exact canvas size before rendering starts, so
     * (x, y) here are already in the same pixel space as the source.
     */
    private double sampleBrightness(
            int x,
            int y,
            int moduleSize,
            RenderOptions options
    ) {

        BufferedImage source = options.getHalftoneSource();

        if (source == null) {
            return 1.0; // no source image -> behaves like a full-size dot
        }

        long total = 0;
        int count = 0;

        int maxX = Math.min(x + moduleSize, source.getWidth());
        int maxY = Math.min(y + moduleSize, source.getHeight());

        for (int sy = Math.max(y, 0); sy < maxY; sy++) {
            for (int sx = Math.max(x, 0); sx < maxX; sx++) {

                int rgb = source.getRGB(sx, sy);

                int r = (rgb >> 16) & 0xFF;
                int g2 = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                total += (r + g2 + b) / 3;
                count++;
            }
        }

        if (count == 0) {
            return 1.0;
        }

        return (total / (double) count) / 255.0;
    }
}