package com.qrfusion.backend.renderer.logo;

import org.springframework.stereotype.Component;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;

@Component
public class RoundedLogoRenderer implements LogoRenderer {

    private final LogoScaler logoScaler;
    private final LogoPlacementEngine placementEngine;
    private final LogoTransparencyUtil transparencyUtil;

    public RoundedLogoRenderer(
            LogoScaler logoScaler,
            LogoPlacementEngine placementEngine, LogoTransparencyUtil transparencyUtil
    ) {
        this.logoScaler = logoScaler;
        this.placementEngine = placementEngine;
        this.transparencyUtil = transparencyUtil;
    }

    @Override
    public LogoShape getShape() {
        return LogoShape.ROUNDED;
    }

    @Override
    public void drawLogo(
            Graphics2D g,
            LogoOptions options,
            int imageWidth,
            int imageHeight
    ) {

        BufferedImage logo = options.getLogo();

        if (logo == null) {
            return;
        }

        int targetSize = logoScaler.calculateSize(
                logo,
                imageWidth,
                imageHeight,
                options
        );

        Point location = placementEngine.getPlacement(
                options.getPosition(),
                targetSize,
                targetSize,
                imageWidth,
                imageHeight
        );

        int x = location.x;
        int y = location.y;

        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

        boolean isTransparent = options.isBorderTransparent();
        Color borderColor = options.getBorderColor() != null ? options.getBorderColor() : Color.WHITE;
        int cornerRadius = targetSize / 5;

        if (isTransparent) {
            Shape oldClip = g.getClip();
            g.setClip(new RoundRectangle2D.Double(x, y, targetSize, targetSize, cornerRadius, cornerRadius));

            double scale = Math.max((double) targetSize / logo.getWidth(), (double) targetSize / logo.getHeight());
            int newWidth = (int) Math.round(logo.getWidth() * scale);
            int newHeight = (int) Math.round(logo.getHeight() * scale);
            int offsetX = (targetSize - newWidth) / 2;
            int offsetY = (targetSize - newHeight) / 2;

            g.drawImage(logo, x + offsetX, y + offsetY, newWidth, newHeight, null);
            g.setClip(oldClip);
        } else {
            int borderThickness = Math.max(3, Math.min(8, targetSize / 16));

            g.setColor(borderColor);
            g.fill(new RoundRectangle2D.Double(x, y, targetSize, targetSize, cornerRadius, cornerRadius));

            int innerSize = targetSize - (borderThickness * 2);
            int innerX = x + borderThickness;
            int innerY = y + borderThickness;
            int innerRadius = Math.max(2, cornerRadius - borderThickness);

            double scale = Math.max((double) innerSize / logo.getWidth(), (double) innerSize / logo.getHeight());
            int newWidth = (int) Math.round(logo.getWidth() * scale);
            int newHeight = (int) Math.round(logo.getHeight() * scale);

            int offsetX = (innerSize - newWidth) / 2;
            int offsetY = (innerSize - newHeight) / 2;

            Shape oldClip = g.getClip();
            g.setClip(new RoundRectangle2D.Double(innerX, innerY, innerSize, innerSize, innerRadius, innerRadius));
            g.drawImage(logo, innerX + offsetX, innerY + offsetY, newWidth, newHeight, null);
            g.setClip(oldClip);
        }
    }
}