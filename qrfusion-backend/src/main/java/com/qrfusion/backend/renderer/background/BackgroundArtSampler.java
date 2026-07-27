package com.qrfusion.backend.renderer.background;

import org.springframework.stereotype.Component;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;

/**
 * Turns an uploaded illustration into per-module tint colors instead of
 * just pasting it behind the code. The art is scaled to cover the full
 * canvas (like CSS background-size: cover), then each module samples the
 * average color of the artwork under it and blends toward that color -
 * capped by a contrast floor so the result never gets so light that
 * scanners lose the module from the background.
 */
@Component
public class BackgroundArtSampler {

    private static final double MIN_CONTRAST_RATIO = 2.5;

    public BufferedImage prepare(BufferedImage art, int targetWidth, int targetHeight) {

        double scale = Math.max(
                (double) targetWidth / art.getWidth(),
                (double) targetHeight / art.getHeight()
        );

        int scaledWidth = Math.max(1, (int) Math.ceil(art.getWidth() * scale));
        int scaledHeight = Math.max(1, (int) Math.ceil(art.getHeight() * scale));

        Image scaled = art.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH);

        BufferedImage canvas = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = canvas.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);

        int offsetX = (targetWidth - scaledWidth) / 2;
        int offsetY = (targetHeight - scaledHeight) / 2;

        g.drawImage(scaled, offsetX, offsetY, null);
        g.dispose();

        return canvas;
    }

    public Color sample(BufferedImage preparedArt, int x, int y, int moduleSize) {

        int x0 = Math.max(0, x);
        int y0 = Math.max(0, y);
        int x1 = Math.min(preparedArt.getWidth(), x + moduleSize);
        int y1 = Math.min(preparedArt.getHeight(), y + moduleSize);

        if (x0 >= x1 || y0 >= y1) {
            return Color.BLACK;
        }

        long r = 0, g = 0, b = 0, count = 0;

        for (int py = y0; py < y1; py++) {
            for (int px = x0; px < x1; px++) {
                int rgb = preparedArt.getRGB(px, py);
                r += (rgb >> 16) & 0xff;
                g += (rgb >> 8) & 0xff;
                b += rgb & 0xff;
                count++;
            }
        }

        return new Color((int) (r / count), (int) (g / count), (int) (b / count));
    }

    /**
     * Blends the module's normal color toward the sampled art color,
     * then - if that blend drops contrast against the background below
     * a safe floor - pulls it back toward black/white until contrast is
     * restored. This is what lets modules take on the artwork's palette
     * without ever becoming unreadable to a scanner.
     */
    public Color blend(Color moduleColor, Color artColor, double blendFactor, Color backgroundColor) {

        Color blended = new Color(
                clamp(lerp(moduleColor.getRed(), artColor.getRed(), blendFactor)),
                clamp(lerp(moduleColor.getGreen(), artColor.getGreen(), blendFactor)),
                clamp(lerp(moduleColor.getBlue(), artColor.getBlue(), blendFactor))
        );

        return ensureContrast(blended, backgroundColor);
    }

    private Color ensureContrast(Color candidate, Color background) {

        double bgLum = luminance(background);

        if (contrastRatio(luminance(candidate), bgLum) >= MIN_CONTRAST_RATIO) {
            return candidate;
        }

        Color target = bgLum > 0.5 ? Color.BLACK : Color.WHITE;
        Color result = candidate;

        for (int i = 0; i < 12 && contrastRatio(luminance(result), bgLum) < MIN_CONTRAST_RATIO; i++) {
            result = new Color(
                    clamp((result.getRed() + target.getRed()) / 2),
                    clamp((result.getGreen() + target.getGreen()) / 2),
                    clamp((result.getBlue() + target.getBlue()) / 2)
            );
        }

        return result;
    }

    private double luminance(Color c) {
        return 0.2126 * channelToLinear(c.getRed())
                + 0.7152 * channelToLinear(c.getGreen())
                + 0.0722 * channelToLinear(c.getBlue());
    }

    private double channelToLinear(int channel) {
        double v = channel / 255.0;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }

    private double contrastRatio(double lum1, double lum2) {
        double lighter = Math.max(lum1, lum2);
        double darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    private int lerp(int a, int b, double t) {
        return (int) (a * (1 - t) + b * t);
    }

    private int clamp(int value) {
        return Math.max(0, Math.min(255, value));
    }
}