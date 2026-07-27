package com.qrfusion.backend.renderer.color;

import java.awt.Color;

/**
 * Shared color utility methods for hex string formatting, RGBA conversions,
 * and luminance calculations across rendering engines.
 */
public final class ColorUtils {

    private ColorUtils() {
        // Utility class
    }

    public static String toHex(Color color) {
        if (color == null || color.getAlpha() == 0) {
            return "none";
        }
        if (color.getAlpha() < 255) {
            return String.format("rgba(%d,%d,%d,%.2f)", color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha() / 255.0);
        }
        return String.format("#%02X%02X%02X", color.getRed(), color.getGreen(), color.getBlue());
    }

    public static double getLuminance(Color color) {
        if (color == null) return 255.0;
        return 0.299 * color.getRed() + 0.587 * color.getGreen() + 0.114 * color.getBlue();
    }

    public static double getContrastRatio(Color c1, Color c2) {
        double l1 = getLuminance(c1);
        double l2 = getLuminance(c2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }
}
