package com.qrfusion.backend.renderer.safety;

import com.qrfusion.backend.renderer.logo.LogoOptions;
import com.qrfusion.backend.renderer.logo.LogoPlacement;
import com.qrfusion.backend.renderer.logo.LogoPlacementEngine;
import com.qrfusion.backend.renderer.logo.LogoPosition;
import com.qrfusion.backend.renderer.logo.LogoScaler;
import com.qrfusion.backend.renderer.logo.LogoShape;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.geom.Ellipse2D;

@Component
public class DefaultSafetyZoneRenderer implements SafetyZoneRenderer {

    private final LogoScaler logoScaler;
    private final LogoPlacementEngine placementEngine;

    public DefaultSafetyZoneRenderer(
            LogoScaler logoScaler,
            LogoPlacementEngine placementEngine
    ) {
        this.logoScaler = logoScaler;
        this.placementEngine = placementEngine;
    }

    @Override
    public void drawSafetyZone(
            Graphics2D g,
            LogoOptions options,
            int imageWidth,
            int imageHeight
    ) {

        if (!options.isSafetyZone() || options.getLogo() == null) {
            return;
        }

        // Corner/edge badge logos (like BOTTOM_RIGHT) render their own crisp white backing ring
        // inside the logo bounds, avoiding clunky white blobs that spill outside the canvas.
        if (options.getPosition() != null && options.getPosition() != LogoPosition.CENTER) {
            return;
        }

        LogoPlacement placement = logoScaler.scale(
                options.getLogo(),
                options.getSizeRatio(),
                imageWidth,
                imageHeight
        );

        placement = placementEngine.place(
                placement,
                options.getPosition(),
                imageWidth,
                imageHeight
        );

        int logoWidth = placement.getWidth();
        int logoHeight = placement.getHeight();

        int padding = logoWidth / 8;
        int plateWidth = logoWidth + padding * 2;
        int plateHeight = logoHeight + padding * 2;

        int centerX = placement.getX() + logoWidth / 2;
        int centerY = placement.getY() + logoHeight / 2;

        int plateX = centerX - plateWidth / 2;
        int plateY = centerY - plateHeight / 2;

        g.setColor(Color.WHITE);

        if (options.getShape() == LogoShape.CIRCLE) {
            int size = Math.max(plateWidth, plateHeight);
            int cx = centerX - size / 2;
            int cy = centerY - size / 2;
            g.fill(new Ellipse2D.Double(cx, cy, size, size));
        } else {
            g.fillRoundRect(plateX, plateY, plateWidth, plateHeight, 24, 24);
        }
    }
}