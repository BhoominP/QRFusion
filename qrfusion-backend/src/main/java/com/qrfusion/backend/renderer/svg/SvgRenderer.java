package com.qrfusion.backend.renderer.svg;

import com.google.zxing.common.BitMatrix;
import com.qrfusion.backend.renderer.RenderOptions;
import com.qrfusion.backend.renderer.RenderStyle;
import com.qrfusion.backend.renderer.background.BackgroundOptions;
import com.qrfusion.backend.renderer.color.ColorMode;
import com.qrfusion.backend.renderer.color.ColorUtils;
import com.qrfusion.backend.renderer.finder.FinderStyle;
import com.qrfusion.backend.renderer.logo.LogoOptions;
import com.qrfusion.backend.renderer.logo.LogoShape;
import org.springframework.stereotype.Component;
import com.qrfusion.backend.renderer.logo.LogoPlacement;
import com.qrfusion.backend.renderer.logo.LogoScaler;
import com.qrfusion.backend.renderer.logo.LogoPlacementEngine;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

/**
 * Emits an SVG that mirrors QrRenderer's raster output as closely as
 * possible - same module style, finder style, color mode (incl.
 * gradients), art fusion background, and logo/safety-zone handling.
 */
@Component
public class SvgRenderer {

    private static final String GRADIENT_ID = "qrGradient";
    private static final String LOGO_CLIP_ID = "logoClip";
    private final LogoScaler logoScaler;
    private final LogoPlacementEngine placementEngine;

    public SvgRenderer(LogoScaler logoScaler, LogoPlacementEngine placementEngine) {
        this.logoScaler = logoScaler;
        this.placementEngine = placementEngine;
    }

    public String render(
            BitMatrix bitMatrix,
            RenderOptions options
    ) {

        int matrixWidth = bitMatrix.getWidth();
        int matrixHeight = bitMatrix.getHeight();

        int scaledImageSize =
                options.getImageSize()
                        * options.getExportScale().getMultiplier();

        int moduleSize = Math.max(
                1,
                scaledImageSize / (matrixWidth + options.getQuietZone() * 2)
        );

        int imageWidth = (matrixWidth + options.getQuietZone() * 2) * moduleSize;
        int imageHeight = (matrixHeight + options.getQuietZone() * 2) * moduleSize;

        boolean gradient = options.getColorMode() != ColorMode.SOLID;
        String fillRef = gradient ? "url(#" + GRADIENT_ID + ")" : ColorUtils.toHex(options.getForegroundColor());

        StringBuilder svg = new StringBuilder();

        svg.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        svg.append("<svg xmlns=\"http://www.w3.org/2000/svg\" ")
                .append("xmlns:xlink=\"http://www.w3.org/1999/xlink\" ")
                .append("width=\"").append(imageWidth).append("\" ")
                .append("height=\"").append(imageHeight).append("\" ")
                .append("viewBox=\"0 0 ").append(imageWidth).append(" ").append(imageHeight)
                .append("\">\n");

        if (gradient || options.isNeonGlowEnabled()) {
            svg.append("<defs>\n");
            if (gradient) {
                svg.append(buildGradientDef(options, imageWidth, imageHeight));
            }
            if (options.isNeonGlowEnabled()) {
                svg.append("  <filter id=\"neonGlowFilter\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">\n")
                        .append("    <feGaussianBlur stdDeviation=\"4\" result=\"blur\"/>\n")
                        .append("    <feMerge>\n")
                        .append("      <feMergeNode in=\"blur\"/>\n")
                        .append("      <feMergeNode in=\"blur\"/>\n")
                        .append("      <feMergeNode in=\"SourceGraphic\"/>\n")
                        .append("    </feMerge>\n")
                        .append("  </filter>\n");
            }
            svg.append("</defs>\n");
        }

        // ---- Background ----
        if (options.isNeonGlowEnabled()) {
            Color neonBg = options.getNeonBackgroundColor() != null ? options.getNeonBackgroundColor() : new Color(0x0A, 0x0A, 0x14);
            svg.append("<rect width=\"100%\" height=\"100%\" fill=\"")
                    .append(ColorUtils.toHex(neonBg)).append("\"/>\n");
        } else if (options.getBackgroundColor() != null && options.getBackgroundColor().getAlpha() > 0) {
            svg.append("<rect width=\"100%\" height=\"100%\" fill=\"")
                    .append(ColorUtils.toHex(options.getBackgroundColor())).append("\"/>\n");
        }

        // ---- Art Fusion Background Image ----
        BackgroundOptions bgArt = options.getBackgroundOptions();
        if (bgArt != null && bgArt.getImage() != null) {
            try {
                BufferedImage artImg = bgArt.getImage();
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(artImg, "PNG", baos);
                String artBase64 = Base64.getEncoder().encodeToString(baos.toByteArray());

                double opacity = bgArt.getOpacity();
                if (opacity <= 0) opacity = 1.0;

                svg.append("<image width=\"100%\" height=\"100%\" ")
                        .append("preserveAspectRatio=\"xMidYMid slice\" ")
                        .append("opacity=\"").append(fmt(opacity)).append("\" ")
                        .append("xlink:href=\"data:image/png;base64,").append(artBase64).append("\"/>\n");
            } catch (Exception ignored) {}
        }

        // ---- Finder eyes, drawn as whole shapes before the module loop ----
        int quietZone = options.getQuietZone();

        appendFinder(svg, quietZone * moduleSize, quietZone * moduleSize, moduleSize, options, fillRef);
        appendFinder(svg, (matrixWidth - 7 + quietZone) * moduleSize, quietZone * moduleSize, moduleSize, options, fillRef);
        appendFinder(svg, quietZone * moduleSize, (matrixHeight - 7 + quietZone) * moduleSize, moduleSize, options, fillRef);

        // ---- Data modules (finder zone skipped, same 8x8 rule as QrRenderer) ----
        if (options.isNeonGlowEnabled()) {
            svg.append("<g fill=\"").append(fillRef).append("\" filter=\"url(#neonGlowFilter)\">\n");
        } else {
            svg.append("<g fill=\"").append(fillRef).append("\">\n");
        }

        for (int y = 0; y < matrixHeight; y++) {
            for (int x = 0; x < matrixWidth; x++) {

                if (!bitMatrix.get(x, y) || isFinderPatternZone(x, y, matrixWidth, matrixHeight)) {
                    continue;
                }

                int drawX = (x + quietZone) * moduleSize;
                int drawY = (y + quietZone) * moduleSize;

                appendModule(svg, drawX, drawY, moduleSize, options.getStyle(), options.getCornerRadius());
            }
        }

        svg.append("</g>\n");

        // ---- Logo + safety zone ----
        LogoOptions logoOptions = options.getLogoOptions();
        if (logoOptions != null && logoOptions.getLogo() != null) {
            appendLogo(svg, logoOptions, imageWidth, imageHeight);
        }

        // ---- Adaptive Watermark (QrFusion_logo_2.svg) ----
        String watermarkHex = determineWatermarkHexColor(options);
        double watermarkSize = Math.max(28, imageWidth * 0.09);
        double margin = Math.max(12, imageWidth * 0.03);
        double scale = watermarkSize / 887.77;
        double drawX = imageWidth - margin - (887.77 * scale);
        double drawY = imageHeight - margin - (792.0 * scale);

        svg.append("<g id=\"qrfusion-watermark\" transform=\"translate(")
                .append(fmt(drawX)).append(",").append(fmt(drawY))
                .append(") scale(").append(fmt(scale)).append(")\" fill=\"")
                .append(watermarkHex).append("\" opacity=\"0.95\">\n")
                .append("<path d=\"M742.09,298.08v396.92h-381.98v33.54h419.77v-430.46h-37.78ZM547.4,63.46H107.9v428.21h38.52V99.33h400.99v-35.86Z\"/>\n")
                .append("<path d=\"M574.09,63.46v206.23h204.11V63.46h-204.11ZM742.09,234.62h-131.42V99.33h131.42v135.29Z\"/>\n")
                .append("<rect x=\"639.8\" y=\"129.87\" width=\"73.56\" height=\"74.64\"/>\n")
                .append("<path d=\"M107.9,516.02v212.51h214.95v-212.51H107.9ZM284.82,692.38h-138.4v-139.41h138.4v139.41Z\"/>\n")
                .append("<rect x=\"177.1\" y=\"584.45\" width=\"77.47\" height=\"76.91\"/>\n")
                .append("<path d=\"M650.67,298.08v298.56h-290.57v36.34h324.87v-334.9h-34.3ZM547.4,136.43H184.32v355.24h37V173.33h326.08v-36.9Z\"/>\n")
                .append("<path d=\"M556.88,360.15v152.48h-149.8v36.67h185.61v-189.15h-35.81ZM481.09,242.58h-185.86v204.77h37.1v-168.3h148.76v-36.47Z\"/>\n")
                .append("<path d=\"M398.74,354.72c-25.3,53.76-50.6,107.54-75.9,161.3,54.36-24.16,108.7-48.35,163.04-72.53,29.42-57.93,58.81-115.85,88.2-173.78-58.46,28.33-116.89,56.69-175.35,85.02ZM462.76,417.55c-23.33,10.39-46.65,20.77-69.96,31.14,10.84-23.07,21.71-46.15,32.55-69.22,25.07-12.16,50.17-24.31,75.24-36.47-12.61,24.84-25.22,49.71-37.83,74.56Z\"/>\n")
                .append("</g>\n");

        svg.append("</svg>");

        return svg.toString();
    }

    private String determineWatermarkHexColor(RenderOptions options) {
        Color fg = options.getForegroundColor();
        if (fg == null) fg = Color.BLACK;
        Color bg = options.getBackgroundColor();
        if (bg == null) bg = Color.WHITE;

        double contrast = ColorUtils.getContrastRatio(fg, bg);

        Color result = contrast >= 2.0 ? fg : (ColorUtils.getLuminance(bg) < 128 ? new Color(74, 154, 250) : new Color(16, 29, 46));
        return ColorUtils.toHex(result);
    }

    // -----------------------------------------------------------------
    // Gradients - matches LinearGradientPainter / RadialGradientPainter
    // -----------------------------------------------------------------

    private String buildGradientDef(RenderOptions options, int imageWidth, int imageHeight) {

        if (options.getColorMode() == ColorMode.RADIAL_GRADIENT) {

            double cx = imageWidth / 2.0;
            double cy = imageHeight / 2.0;
            double r = Math.sqrt(Math.pow(imageWidth / 2.0, 2) + Math.pow(imageHeight / 2.0, 2));

            return "<radialGradient id=\"" + GRADIENT_ID + "\" gradientUnits=\"userSpaceOnUse\" "
                    + "cx=\"" + fmt(cx) + "\" cy=\"" + fmt(cy) + "\" r=\"" + fmt(r) + "\">\n"
                    + "<stop offset=\"0%\" stop-color=\"" + ColorUtils.toHex(options.getStartColor()) + "\"/>\n"
                    + "<stop offset=\"100%\" stop-color=\"" + ColorUtils.toHex(options.getEndColor()) + "\"/>\n"
                    + "</radialGradient>\n";
        }

        // LINEAR_GRADIENT - top-to-bottom across the full image
        return "<linearGradient id=\"" + GRADIENT_ID + "\" gradientUnits=\"userSpaceOnUse\" "
                + "x1=\"0\" y1=\"0\" x2=\"0\" y2=\"" + imageHeight + "\">\n"
                + "<stop offset=\"0%\" stop-color=\"" + ColorUtils.toHex(options.getStartColor()) + "\"/>\n"
                + "<stop offset=\"100%\" stop-color=\"" + ColorUtils.toHex(options.getEndColor()) + "\"/>\n"
                + "</linearGradient>\n";
    }

    // -----------------------------------------------------------------
    // Data modules - matches SquareRenderer / RoundedRenderer / CircleRenderer
    // -----------------------------------------------------------------

    private void appendModule(StringBuilder svg, int x, int y, int moduleSize, RenderStyle style, int cornerRadius) {

        switch (style) {

            case CIRCLE -> {
                int padding = Math.max(1, moduleSize / 4);
                double diameter = moduleSize - padding * 2.0;
                appendCircleShape(svg, x + moduleSize / 2.0, y + moduleSize / 2.0, diameter, null);
            }

            case ROUNDED -> {
                double arc = Math.min(moduleSize, Math.max(cornerRadius, moduleSize * 0.4));
                appendRectShape(svg, x, y, moduleSize, moduleSize, arc / 2.0, null);
            }

            default -> appendRectShape(svg, x, y, moduleSize, moduleSize, 0, null);
        }
    }

    // -----------------------------------------------------------------
    // Finder eyes - matches Classic/Rounded/Circle/Instagram/ModernFrame renderers
    // -----------------------------------------------------------------

    private void appendFinder(StringBuilder svg, int startX, int startY, int moduleSize, RenderOptions options, String fillRef) {

        int outer = moduleSize * 7;
        int hole = moduleSize * 5;
        int holeInset = moduleSize;
        int center = moduleSize * 3;
        int centerInset = moduleSize * 2;

        String bgHex = ColorUtils.toHex(options.getBackgroundColor());
        FinderStyle style = options.getFinderStyle();

        switch (style) {

            case CIRCLE -> {
                appendCircleShape(svg, startX + outer / 2.0, startY + outer / 2.0, outer, fillRef);
                appendCircleShape(svg, startX + outer / 2.0, startY + outer / 2.0, hole, bgHex);
                appendCircleShape(svg, startX + outer / 2.0, startY + outer / 2.0, center, fillRef);
            }

            case ROUNDED -> {
                double arc = Math.max(options.getCornerRadius() * 2.0, moduleSize);
                double rx = arc / 2.0;
                appendRectShape(svg, startX, startY, outer, outer, rx, fillRef);
                appendRectShape(svg, startX + holeInset, startY + holeInset, hole, hole, rx, bgHex);
                appendRectShape(svg, startX + centerInset, startY + centerInset, center, center, rx, fillRef);
            }

            case INSTAGRAM -> {
                double rx = (moduleSize * 4) / 2.0;
                appendRectShape(svg, startX, startY, outer, outer, rx, fillRef);
                appendRectShape(svg, startX + moduleSize, startY + moduleSize, hole, hole, rx, bgHex);
                appendCircleShape(svg, startX + outer / 2.0, startY + outer / 2.0, center, fillRef);
            }

            case MODERN_FRAME -> {
                double strokeWidth = moduleSize * 0.6;
                double inset = strokeWidth / 2;
                svg.append("<rect x=\"").append(fmt(startX + inset)).append("\" y=\"").append(fmt(startY + inset))
                        .append("\" width=\"").append(fmt(outer - strokeWidth)).append("\" height=\"").append(fmt(outer - strokeWidth))
                        .append("\" fill=\"none\" stroke=\"").append(fillRef)
                        .append("\" stroke-width=\"").append(fmt(strokeWidth)).append("\"/>\n");
                appendRectShape(svg, startX + centerInset, startY + centerInset, center, center, 0, fillRef);
            }

            default -> { // CLASSIC
                appendRectShape(svg, startX, startY, outer, outer, 0, fillRef);
                appendRectShape(svg, startX + holeInset, startY + holeInset, hole, hole, 0, bgHex);
                appendRectShape(svg, startX + centerInset, startY + centerInset, center, center, 0, fillRef);
            }
        }
    }

    // -----------------------------------------------------------------
    // Logo + safety zone - matches SquareLogoRenderer / RoundedLogoRenderer /
    // CircleLogoRenderer / DefaultSafetyZoneRenderer
    // -----------------------------------------------------------------

    private void appendLogo(StringBuilder svg, LogoOptions logoOptions, int imageWidth, int imageHeight) {

        BufferedImage logo = logoOptions.getLogo();

        LogoPlacement placement = logoScaler.scale(
                logo, logoOptions.getSizeRatio(), imageWidth, imageHeight
        );
        placement = placementEngine.place(
                placement, logoOptions.getPosition(), imageWidth, imageHeight
        );

        int x = placement.getX();
        int y = placement.getY();
        int targetWidth = placement.getWidth();
        int targetHeight = placement.getHeight();

        if (logoOptions.isSafetyZone()) {
            int padding = targetWidth / 8;
            int plateWidth = targetWidth + padding * 2;
            int plateHeight = targetHeight + padding * 2;

            int centerX = x + targetWidth / 2;
            int centerY = y + targetHeight / 2;

            if (logoOptions.getShape() == LogoShape.CIRCLE) {
                int size = Math.max(plateWidth, plateHeight);
                appendCircleShape(svg, centerX, centerY, size, "#FFFFFF");
            } else {
                int plateX = centerX - plateWidth / 2;
                int plateY = centerY - plateHeight / 2;
                appendRectShape(svg, plateX, plateY, plateWidth, plateHeight, 24, "#FFFFFF");
            }
        }

        String base64;
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(logo, "PNG", baos);
            base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (IOException e) {
            throw new IllegalStateException("Failed to embed logo image in SVG export", e);
        }

        String clipAttr = "";

        if (logoOptions.getShape() == LogoShape.ROUNDED || logoOptions.getShape() == LogoShape.CIRCLE) {

            svg.append("<defs><clipPath id=\"").append(LOGO_CLIP_ID).append("\">\n");

            if (logoOptions.getShape() == LogoShape.CIRCLE) {
                double r = Math.min(targetWidth, targetHeight) / 2.0;
                svg.append("<circle cx=\"").append(fmt(x + targetWidth / 2.0))
                        .append("\" cy=\"").append(fmt(y + targetHeight / 2.0))
                        .append("\" r=\"").append(fmt(r)).append("\"/>\n");
            } else {
                double arc = Math.min(targetWidth, targetHeight) * 0.25;
                svg.append("<rect x=\"").append(x).append("\" y=\"").append(y)
                        .append("\" width=\"").append(targetWidth).append("\" height=\"").append(targetHeight)
                        .append("\" rx=\"").append(fmt(arc)).append("\" ry=\"").append(fmt(arc)).append("\"/>\n");
            }

            svg.append("</clipPath></defs>\n");
            clipAttr = " clip-path=\"url(#" + LOGO_CLIP_ID + ")\"";
        }

        svg.append("<image x=\"").append(x).append("\" y=\"").append(y)
                .append("\" width=\"").append(targetWidth).append("\" height=\"").append(targetHeight)
                .append("\"").append(clipAttr)
                .append(" preserveAspectRatio=\"xMidYMid slice\"")
                .append(" xlink:href=\"data:image/png;base64,").append(base64).append("\"/>\n");
    }

    // -----------------------------------------------------------------
    // Shared shape helpers
    // -----------------------------------------------------------------

    private void appendRectShape(StringBuilder svg, double x, double y, double w, double h, double rx, String fill) {
        svg.append("<rect x=\"").append(fmt(x)).append("\" y=\"").append(fmt(y))
                .append("\" width=\"").append(fmt(w)).append("\" height=\"").append(fmt(h));
        if (rx > 0) {
            svg.append("\" rx=\"").append(fmt(rx)).append("\" ry=\"").append(fmt(rx));
        }
        svg.append("\"");
        if (fill != null) {
            svg.append(" fill=\"").append(fill).append("\"");
        }
        svg.append("/>\n");
    }

    private void appendCircleShape(StringBuilder svg, double cx, double cy, double diameter, String fill) {
        svg.append("<circle cx=\"").append(fmt(cx)).append("\" cy=\"").append(fmt(cy))
                .append("\" r=\"").append(fmt(diameter / 2.0)).append("\"");
        if (fill != null) {
            svg.append(" fill=\"").append(fill).append("\"");
        }
        svg.append("/>\n");
    }

    // -----------------------------------------------------------------
    // Finder-zone skip - identical rule to QrRenderer.isFinderPatternZone
    // -----------------------------------------------------------------

    private boolean isFinderPatternZone(int x, int y, int matrixWidth, int matrixHeight) {
        int zone = 8;
        boolean topLeft = x < zone && y < zone;
        boolean topRight = x >= matrixWidth - zone && y < zone;
        boolean bottomLeft = x < zone && y >= matrixHeight - zone;
        return topLeft || topRight || bottomLeft;
    }

    private String fmt(double v) {
        return (v == Math.floor(v)) ? String.valueOf((long) v) : String.format("%.2f", v);
    }
}