package com.qrfusion.backend.renderer.watermark;

import com.qrfusion.backend.renderer.RenderOptions;
import com.qrfusion.backend.renderer.color.ColorUtils;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.geom.Path2D;
import java.awt.image.BufferedImage;

/**
 * WatermarkRenderer embeds the QrFusion_logo_2.svg watermark branding onto exported QR images
 * with automated color adaptation for high visibility and contrast against the QR background.
 */
@Component
public class WatermarkRenderer {

    public BufferedImage applyWatermark(BufferedImage image, RenderOptions options) {
        if (image == null) return null;

        int width = image.getWidth();
        int height = image.getHeight();

        // Create a working ARGB graphics context
        BufferedImage watermarked = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = watermarked.createGraphics();
        g2d.drawImage(image, 0, 0, null);

        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Determine watermark color based on QR foreground & background contrast
        Color watermarkColor = determineAdaptiveColor(image, options);

        // Scale watermark proportionally (roughly 8-10% of image width)
        double targetSize = Math.max(28, width * 0.09);
        double margin = Math.max(12, width * 0.03);

        double scale = targetSize / 887.77; // Original SVG viewBox width 887.77
        double drawX = width - margin - (887.77 * scale);
        double drawY = height - margin - (792.0 * scale);

        // Subtle background pill/plate behind watermark for guaranteed 100% legibility
        Color bgPlateColor = ColorUtils.getLuminance(watermarkColor) > 128
                ? new Color(10, 20, 32, 180)  // Dark semi-transparent pill for light watermark
                : new Color(245, 247, 250, 180); // Light semi-transparent pill for dark watermark

        double platePadding = Math.max(4, targetSize * 0.15);
        g2d.setColor(bgPlateColor);
        g2d.fillRoundRect(
                (int) (drawX - platePadding),
                (int) (drawY - platePadding),
                (int) (887.77 * scale + platePadding * 2),
                (int) (792.0 * scale + platePadding * 2),
                12, 12
        );

        // Draw Watermark Vector Paths
        g2d.setColor(watermarkColor);
        g2d.translate(drawX, drawY);
        g2d.scale(scale, scale);

        // Render QrFusion_logo_2.svg paths
        renderLogoPaths(g2d);

        g2d.dispose();
        return watermarked;
    }

    public Color determineAdaptiveColor(BufferedImage image, RenderOptions options) {
        Color fg = options.getForegroundColor();
        if (fg == null) fg = Color.BLACK;

        // Sample background pixels near bottom-right corner to check local background color
        int width = image.getWidth();
        int height = image.getHeight();
        int sampleX = Math.max(0, width - 30);
        int sampleY = Math.max(0, height - 30);
        
        int rgb = image.getRGB(sampleX, sampleY);
        Color bgColor = new Color(rgb, true);

        double contrast = ColorUtils.getContrastRatio(fg, bgColor);

        if (contrast >= 2.0) {
            return fg;
        }

        // If contrast is poor, pick a high-visibility fallback based on local background luminance
        return ColorUtils.getLuminance(bgColor) < 128 ? new Color(74, 154, 250) : new Color(16, 29, 46);
    }

    public String determineAdaptiveHexColor(RenderOptions options) {
        Color fg = options.getForegroundColor();
        if (fg == null) fg = Color.BLACK;
        Color bg = options.getBackgroundColor();
        if (bg == null) bg = Color.WHITE;

        double contrast = ColorUtils.getContrastRatio(fg, bg);

        Color result = contrast >= 2.0 ? fg : (ColorUtils.getLuminance(bg) < 128 ? new Color(74, 154, 250) : new Color(16, 29, 46));
        return ColorUtils.toHex(result);
    }

    /**
     * Draws exact path geometry of QrFusion_logo_2.svg (viewBox 0 0 887.77 792)
     */
    private void renderLogoPaths(Graphics2D g2d) {
        // Outer L-Frame Path
        Path2D.Double path1 = new Path2D.Double();
        path1.moveTo(742.09, 298.08);
        path1.lineTo(742.09, 695.00);
        path1.lineTo(360.11, 695.00);
        path1.lineTo(360.11, 728.54);
        path1.lineTo(779.88, 728.54);
        path1.lineTo(779.88, 298.08);
        path1.closePath();
        path1.moveTo(547.40, 63.46);
        path1.lineTo(107.90, 63.46);
        path1.lineTo(107.90, 491.67);
        path1.lineTo(146.42, 491.67);
        path1.lineTo(146.42, 99.33);
        path1.lineTo(547.40, 99.33);
        path1.closePath();
        g2d.fill(path1);

        // Top-Right Finder Eye
        Path2D.Double path2 = new Path2D.Double();
        path2.moveTo(574.09, 63.46);
        path2.lineTo(574.09, 269.69);
        path2.lineTo(778.20, 269.69);
        path2.lineTo(778.20, 63.46);
        path2.closePath();
        path2.moveTo(742.09, 234.62);
        path2.lineTo(610.67, 234.62);
        path2.lineTo(610.67, 99.33);
        path2.lineTo(742.09, 99.33);
        path2.closePath();
        g2d.fill(path2);
        g2d.fillRect(640, 130, 74, 75);

        // Bottom-Left Finder Eye
        Path2D.Double path3 = new Path2D.Double();
        path3.moveTo(107.90, 516.02);
        path3.lineTo(107.90, 728.53);
        path3.lineTo(322.85, 728.53);
        path3.lineTo(322.85, 516.02);
        path3.closePath();
        path3.moveTo(284.82, 692.38);
        path3.lineTo(146.42, 692.38);
        path3.lineTo(146.42, 552.97);
        path3.lineTo(284.82, 552.97);
        path3.closePath();
        g2d.fill(path3);
        g2d.fillRect(177, 584, 78, 77);

        // Inner Concentric Frames
        Path2D.Double path4 = new Path2D.Double();
        path4.moveTo(650.67, 298.08);
        path4.lineTo(650.67, 596.64);
        path4.lineTo(360.10, 596.64);
        path4.lineTo(360.10, 632.98);
        path4.lineTo(684.97, 632.98);
        path4.lineTo(684.97, 298.08);
        path4.closePath();
        path4.moveTo(547.40, 136.43);
        path4.lineTo(184.32, 136.43);
        path4.lineTo(184.32, 491.67);
        path4.lineTo(221.32, 491.67);
        path4.lineTo(221.32, 173.33);
        path4.lineTo(547.40, 173.33);
        path4.closePath();
        g2d.fill(path4);

        // Center L-Brackets
        Path2D.Double path5 = new Path2D.Double();
        path5.moveTo(556.88, 360.15);
        path5.lineTo(556.88, 512.63);
        path5.lineTo(407.08, 512.63);
        path5.lineTo(407.08, 549.30);
        path5.lineTo(592.69, 549.30);
        path5.lineTo(592.69, 360.15);
        path5.closePath();
        path5.moveTo(481.09, 242.58);
        path5.lineTo(295.23, 242.58);
        path5.lineTo(295.23, 447.35);
        path5.lineTo(332.33, 447.35);
        path5.lineTo(332.33, 279.05);
        path5.lineTo(481.09, 279.05);
        path5.closePath();
        g2d.fill(path5);

        // Central Compass Needle Arrow
        Path2D.Double needle = new Path2D.Double();
        needle.moveTo(398.74, 354.72);
        needle.lineTo(322.84, 516.02);
        needle.lineTo(485.88, 443.49);
        needle.lineTo(574.08, 269.71);
        needle.closePath();
        g2d.fill(needle);
    }
}
