package com.qrfusion.backend.renderer.pattern;

import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import java.awt.Graphics2D;

@Component
public class DotPatternRenderer implements PatternRenderer {

    @Override
    public PatternStyle getStyle() {
        return PatternStyle.DOTS;
    }

    @Override
    public void draw(
            Graphics2D g,
            BitMatrix matrix,
            PatternOptions options,
            int moduleSize,
            int quietZone
    ) {

        g.setColor(options.getColor());

        int dot = options.getSize();

        int spacing = Math.max(2, options.getSpacing());

        int width = matrix.getWidth();
        int height = matrix.getHeight();

        for (int y = 0; y < height; y++) {

            for (int x = 0; x < width; x++) {

                // Don't decorate black QR modules
                if (matrix.get(x, y))
                    continue;

                // Don't decorate finder patterns
                if (isFinderZone(x, y, width, height))
                    continue;

                // Random spacing
                if ((x + y) % spacing != 0)
                    continue;

                int px = (x + quietZone) * moduleSize + moduleSize / 2;

                int py = (y + quietZone) * moduleSize + moduleSize / 2;

                g.fillOval(
                        px - dot / 2,
                        py - dot / 2,
                        dot,
                        dot
                );
            }
        }
    }

    private boolean isFinderZone(
            int x,
            int y,
            int width,
            int height
    ) {

        int zone = 9;

        return (x < zone && y < zone)
                || (x >= width - zone && y < zone)
                || (x < zone && y >= height - zone);
    }
}