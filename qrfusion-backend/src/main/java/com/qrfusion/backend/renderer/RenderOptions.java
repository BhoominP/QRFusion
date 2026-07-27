package com.qrfusion.backend.renderer;

import com.qrfusion.backend.renderer.background.BackgroundOptions;
import com.qrfusion.backend.renderer.color.ColorMode;
import com.qrfusion.backend.renderer.export.ExportFormat;
import com.qrfusion.backend.renderer.export.ExportScale;
import com.qrfusion.backend.renderer.finder.FinderStyle;
import com.qrfusion.backend.renderer.logo.LogoOptions;
import com.qrfusion.backend.renderer.pattern.PatternOptions;

import java.awt.Color;
import java.awt.image.BufferedImage;

public class RenderOptions {

    /*
     * -----------------------------------------
     * Image
     * -----------------------------------------
     */

    private int imageSize = 400;
    private int quietZone = 4;
    private int cornerRadius = 4;

    /*
     * -----------------------------------------
     * Colors
     * -----------------------------------------
     */

    private Color foregroundColor = Color.BLACK;
    private Color backgroundColor = Color.WHITE;

    private ColorMode colorMode = ColorMode.SOLID;

    private Color startColor = Color.BLACK;
    private Color endColor = Color.BLUE;

    /*
     * -----------------------------------------
     * QR Style
     * -----------------------------------------
     */

    private RenderStyle style = RenderStyle.SQUARE;
    private FinderStyle finderStyle = FinderStyle.CLASSIC;

    /*
     * -----------------------------------------
     * Logo
     * -----------------------------------------
     */

    private LogoOptions logoOptions;

    /*
     * -----------------------------------------
     * Background Image
     * -----------------------------------------
     */

    private BackgroundOptions backgroundOptions;

    /*
     * -----------------------------------------
     * Pattern
     * -----------------------------------------
     */

    private boolean patternEnabled = false;
    private BufferedImage halftoneSource;
    private PatternOptions patternOptions;

    /*
     * -----------------------------------------
     * Export
     * -----------------------------------------
     */

    private ExportScale exportScale = ExportScale.X1;
    private ExportFormat format = ExportFormat.PNG;

    /*
     * -----------------------------------------
     * Feature 5 - Background Art
     * -----------------------------------------
     */

    private BufferedImage backgroundArt;
    private double backgroundArtBlend = 0.55;

    /*
     * -----------------------------------------
     * Feature 6 - Hidden Modules
     * -----------------------------------------
     */

    private boolean hiddenModulesEnabled = false;
    private double hiddenModuleRatio = 0.12;

    /*
     * -----------------------------------------
     * Feature 7 - Decorative Dots
     * -----------------------------------------
     */

    private boolean decorativeDotsEnabled = false;
    private Color accentColor = Color.BLACK;

    /*
     * Used as deterministic random seed
     */

    private String seed = "";

    public RenderOptions() {
    }

    // =====================================================
    // Image
    // =====================================================

    public int getImageSize() {
        return imageSize;
    }

    public void setImageSize(int imageSize) {
        this.imageSize = imageSize;
    }

    public int getQuietZone() {
        return quietZone;
    }

    public void setQuietZone(int quietZone) {
        this.quietZone = quietZone;
    }

    public int getCornerRadius() {
        return cornerRadius;
    }

    public void setCornerRadius(int cornerRadius) {
        this.cornerRadius = cornerRadius;
    }

    // =====================================================
    // Colors
    // =====================================================

    public Color getForegroundColor() {
        return foregroundColor;
    }

    public void setForegroundColor(Color foregroundColor) {
        this.foregroundColor = foregroundColor;
    }

    public Color getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(Color backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public ColorMode getColorMode() {
        return colorMode;
    }

    public void setColorMode(ColorMode colorMode) {
        this.colorMode = colorMode;
    }

    public Color getStartColor() {
        return startColor;
    }

    public void setStartColor(Color startColor) {
        this.startColor = startColor;
    }

    public Color getEndColor() {
        return endColor;
    }

    public void setEndColor(Color endColor) {
        this.endColor = endColor;
    }

    // =====================================================
    // Style
    // =====================================================

    public RenderStyle getStyle() {
        return style;
    }

    public void setStyle(RenderStyle style) {
        this.style = style;
    }

    public FinderStyle getFinderStyle() {
        return finderStyle;
    }

    public void setFinderStyle(FinderStyle finderStyle) {
        this.finderStyle = finderStyle;
    }

    // =====================================================
    // Logo
    // =====================================================

    public LogoOptions getLogoOptions() {
        return logoOptions;
    }

    public void setLogoOptions(LogoOptions logoOptions) {
        this.logoOptions = logoOptions;
    }

    // =====================================================
    // Background Image
    // =====================================================

    public BackgroundOptions getBackgroundOptions() {
        return backgroundOptions;
    }

    public void setBackgroundOptions(BackgroundOptions backgroundOptions) {
        this.backgroundOptions = backgroundOptions;
    }

    // =====================================================
    // Pattern
    // =====================================================

    public boolean isPatternEnabled() {
        return patternEnabled;
    }

    public void setPatternEnabled(boolean patternEnabled) {
        this.patternEnabled = patternEnabled;
    }

    public BufferedImage getHalftoneSource() {
        return halftoneSource;
    }

    public void setHalftoneSource(BufferedImage halftoneSource) {
        this.halftoneSource = halftoneSource;
    }

    public PatternOptions getPatternOptions() {
        return patternOptions;
    }

    public void setPatternOptions(PatternOptions patternOptions) {
        this.patternOptions = patternOptions;
    }

    // =====================================================
    // Export
    // =====================================================

    public ExportScale getExportScale() {
        return exportScale;
    }

    public void setExportScale(ExportScale exportScale) {
        this.exportScale = exportScale;
    }

    public ExportFormat getFormat() {
        return format;
    }

    public void setFormat(ExportFormat format) {
        this.format = format;
    }

    // =====================================================
    // Background Art
    // =====================================================

    public BufferedImage getBackgroundArt() {
        return backgroundArt;
    }

    public void setBackgroundArt(BufferedImage backgroundArt) {
        this.backgroundArt = backgroundArt;
    }

    public double getBackgroundArtBlend() {
        return backgroundArtBlend;
    }

    public void setBackgroundArtBlend(double backgroundArtBlend) {
        this.backgroundArtBlend = backgroundArtBlend;
    }

    // =====================================================
    // Hidden Modules
    // =====================================================

    public boolean isHiddenModulesEnabled() {
        return hiddenModulesEnabled;
    }

    public void setHiddenModulesEnabled(boolean hiddenModulesEnabled) {
        this.hiddenModulesEnabled = hiddenModulesEnabled;
    }

    public double getHiddenModuleRatio() {
        return hiddenModuleRatio;
    }

    public void setHiddenModuleRatio(double hiddenModuleRatio) {
        this.hiddenModuleRatio = hiddenModuleRatio;
    }

    // =====================================================
    // Decorative Dots
    // =====================================================

    public boolean isDecorativeDotsEnabled() {
        return decorativeDotsEnabled;
    }

    public void setDecorativeDotsEnabled(boolean decorativeDotsEnabled) {
        this.decorativeDotsEnabled = decorativeDotsEnabled;
    }

    public Color getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(Color accentColor) {
        this.accentColor = accentColor;
    }

    // =====================================================
    // Seed
    // =====================================================

    public String getSeed() {
        return seed;
    }

    public void setSeed(String seed) {
        this.seed = seed;
    }
}