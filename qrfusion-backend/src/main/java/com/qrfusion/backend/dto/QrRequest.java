package com.qrfusion.backend.dto;

import com.qrfusion.backend.renderer.RenderStyle;
import com.qrfusion.backend.renderer.background.BlendMode;
import com.qrfusion.backend.renderer.color.ColorMode;
import com.qrfusion.backend.renderer.finder.FinderStyle;
import com.qrfusion.backend.renderer.logo.LogoPosition;
import com.qrfusion.backend.renderer.logo.LogoShape;
import com.qrfusion.backend.renderer.pattern.PatternOptions;
import com.qrfusion.backend.renderer.pattern.PatternStyle;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import com.qrfusion.backend.renderer.export.ExportScale;
import com.qrfusion.backend.renderer.export.ExportFormat;
import com.qrfusion.backend.renderer.frame.FrameStyle;

public class QrRequest {

    @NotBlank(message = "Content cannot be empty")
    private String content;

    @Min(value = 100, message = "Size must be at least 100")
    @Max(value = 2000, message = "Size must not exceed 2000")
    private int size;

    private RenderStyle style = RenderStyle.SQUARE;

    private ColorMode colorMode = ColorMode.SOLID;

    private FinderStyle finderStyle = FinderStyle.CLASSIC;

    // Logo

    private LogoShape logoShape = LogoShape.SQUARE;

    private LogoPosition logoPosition = LogoPosition.CENTER;

    private double logoSizeRatio = 0.20;

    private boolean safetyZone = true;

    private boolean transparentLogoBackground = false;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "logoBorderColor must be a hex color like #FFFFFF")
    private String logoBorderColor = "#FFFFFF";

    private boolean logoBorderTransparent = false;

    private ExportScale exportScale = ExportScale.X1;
    private ExportFormat format = ExportFormat.PNG;

    // Colors

    private double backgroundOpacity = 0.30;

    private BlendMode blendMode = BlendMode.NORMAL;

    // Frame

    private FrameStyle frameStyle = FrameStyle.NONE;

    private String frameCaptionText = "SCAN ME";
    private String frameCaptionPosition = "TOP";
    private int frameCaptionSize = 24;
    private String frameCaptionFont = "SANS";
    private boolean glassPlateTransparent = false;
    private boolean artFusionEnabled = false;

    //pattern
    private PatternStyle patternStyle = PatternStyle.NONE;

    private String patternColor = "#000000";

    @Max(value = 6, message = "patternSize must not exceed 6px to avoid bleeding into neighboring modules")
    private int patternSize = 3;

    @Min(value = 4, message = "patternSpacing must be at least 4 to stay safely outside dense data regions")
    private int patternSpacing = 10;

    private PatternOptions patternOptions;

    @Min(value = 50, message = "frameDelayMs must be at least 50")
    @Max(value = 2000, message = "frameDelayMs must not exceed 2000")
    private int frameDelayMs = 150;

    public int getFrameDelayMs() { return frameDelayMs; }
    public void setFrameDelayMs(int frameDelayMs) { this.frameDelayMs = frameDelayMs; }

    @Pattern(
            regexp = "^#([A-Fa-f0-9]{6})$",
            message = "frameColor must be a hex color like #000000"
    )
    private String frameColor = "#000000";

    @Pattern(
            regexp = "^#([A-Fa-f0-9]{6})$",
            message = "frameCaptionTextColor must be a hex color like #FFFFFF"
    )
    private String frameCaptionTextColor = "#FFFFFF";

    @Pattern(
            regexp = "^#([A-Fa-f0-9]{6})$",
            message = "foregroundColor must be a hex color like #000000"
    )
    private String foregroundColor = "#000000";

    @Pattern(
            regexp = "^#([A-Fa-f0-9]{6})$",
            message = "backgroundColor must be a hex color like #FFFFFF"
    )
    private String backgroundColor = "#FFFFFF";

    @Pattern(
            regexp = "^#([A-Fa-f0-9]{6})$",
            message = "startColor must be a hex color like #7C3AED"
    )
    private String startColor = "#7C3AED";

    @Pattern(
            regexp = "^#([A-Fa-f0-9]{6})$",
            message = "endColor must be a hex color like #3B82F6"
    )
    private String endColor = "#3B82F6";

    public QrRequest() {
    }

    public QrRequest(String content, int size, RenderStyle style) {
        this.content = content;
        this.size = size;
        this.style = style;
    }

    // ------------------------
    // Content
    // ------------------------

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // ------------------------
    // Size
    // ------------------------

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    // ------------------------
    // Style
    // ------------------------

    public RenderStyle getStyle() {
        return style;
    }

    public void setStyle(RenderStyle style) {
        this.style = style;
    }

    // ------------------------
    // Color Mode
    // ------------------------

    public ColorMode getColorMode() {
        return colorMode;
    }

    public void setColorMode(ColorMode colorMode) {
        this.colorMode = colorMode;
    }

    // ------------------------
    // Finder
    // ------------------------

    public FinderStyle getFinderStyle() {
        return finderStyle;
    }

    public void setFinderStyle(FinderStyle finderStyle) {
        this.finderStyle = finderStyle;
    }

    // ------------------------
    // Logo
    // ------------------------

    public LogoShape getLogoShape() {
        return logoShape;
    }

    public void setLogoShape(LogoShape logoShape) {
        this.logoShape = logoShape;
    }

    public LogoPosition getLogoPosition() {
        return logoPosition;
    }

    public void setLogoPosition(LogoPosition logoPosition) {
        this.logoPosition = logoPosition;
    }

    public String getLogoBorderColor() {
        return logoBorderColor;
    }

    public void setLogoBorderColor(String logoBorderColor) {
        this.logoBorderColor = logoBorderColor;
    }

    public boolean isLogoBorderTransparent() {
        return logoBorderTransparent;
    }

    public void setLogoBorderTransparent(boolean logoBorderTransparent) {
        this.logoBorderTransparent = logoBorderTransparent;
    }

    // ------------------------
    // Foreground
    // ------------------------

    public String getForegroundColor() {
        return foregroundColor;
    }

    public void setForegroundColor(String foregroundColor) {
        this.foregroundColor = foregroundColor;
    }

    // ------------------------
    // Background
    // ------------------------

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    // ------------------------
    // Gradient Start
    // ------------------------

    public String getStartColor() {
        return startColor;
    }

    public void setStartColor(String startColor) {
        this.startColor = startColor;
    }

    // ------------------------
    // Gradient End
    // ------------------------

    public String getEndColor() {
        return endColor;
    }

    public void setEndColor(String endColor) {
        this.endColor = endColor;
    }

    public double getLogoSizeRatio() {
        return logoSizeRatio;
    }

    public void setLogoSizeRatio(double logoSizeRatio) {
        this.logoSizeRatio = logoSizeRatio;
    }

    public boolean isSafetyZone() {
        return safetyZone;
    }

    public void setSafetyZone(boolean safetyZone) {
        this.safetyZone = safetyZone;
    }

    public boolean isTransparentLogoBackground() {
        return transparentLogoBackground;
    }

    public void setTransparentLogoBackground(boolean transparentLogoBackground) {
        this.transparentLogoBackground = transparentLogoBackground;
    }

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

    public BlendMode getBlendMode() {
        return blendMode;
    }

    public void setBlendMode(BlendMode blendMode) {
        this.blendMode = blendMode;
    }

    public double getBackgroundOpacity() {
        return backgroundOpacity;
    }

    public void setBackgroundOpacity(double backgroundOpacity) {
        this.backgroundOpacity = backgroundOpacity;
    }

    // ------------------------
    // Frame
    // ------------------------

    public FrameStyle getFrameStyle() {
        return frameStyle;
    }

    public void setFrameStyle(FrameStyle frameStyle) {
        this.frameStyle = frameStyle;
    }

    public String getFrameCaptionText() {
        return frameCaptionText;
    }

    public void setFrameCaptionText(String frameCaptionText) {
        this.frameCaptionText = frameCaptionText;
    }

    public String getFrameCaptionPosition() {
        return frameCaptionPosition;
    }

    public void setFrameCaptionPosition(String frameCaptionPosition) {
        this.frameCaptionPosition = frameCaptionPosition;
    }

    public int getFrameCaptionSize() {
        return frameCaptionSize;
    }

    public void setFrameCaptionSize(int frameCaptionSize) {
        this.frameCaptionSize = frameCaptionSize;
    }

    public String getFrameCaptionFont() {
        return frameCaptionFont;
    }

    public void setFrameCaptionFont(String frameCaptionFont) {
        this.frameCaptionFont = frameCaptionFont;
    }

    public boolean isGlassPlateTransparent() {
        return glassPlateTransparent;
    }

    public void setGlassPlateTransparent(boolean glassPlateTransparent) {
        this.glassPlateTransparent = glassPlateTransparent;
    }

    public boolean isArtFusionEnabled() {
        return artFusionEnabled;
    }

    public void setArtFusionEnabled(boolean artFusionEnabled) {
        this.artFusionEnabled = artFusionEnabled;
    }

    public String getFrameColor() {
        return frameColor;
    }

    public void setFrameColor(String frameColor) {
        this.frameColor = frameColor;
    }

    public String getFrameCaptionTextColor() {
        return frameCaptionTextColor;
    }

    public void setFrameCaptionTextColor(String frameCaptionTextColor) {
        this.frameCaptionTextColor = frameCaptionTextColor;
    }

    public PatternStyle getPatternStyle() {
        return patternStyle;
    }

    public void setPatternStyle(PatternStyle patternStyle) {
        this.patternStyle = patternStyle;
    }

    public String getPatternColor() {
        return patternColor;
    }

    public void setPatternColor(String patternColor) {
        this.patternColor = patternColor;
    }

    public int getPatternSize() {
        return patternSize;
    }

    public void setPatternSize(int patternSize) {
        this.patternSize = patternSize;
    }

    public int getPatternSpacing() {
        return patternSpacing;
    }

    public void setPatternSpacing(int patternSpacing) {
        this.patternSpacing = patternSpacing;
    }

    // Background art
    private boolean backgroundArtEnabled = false;

    @DecimalMin(value = "0.0", message = "backgroundArtBlend must be >= 0")
    @DecimalMax(value = "1.0", message = "backgroundArtBlend must be <= 1")
    private double backgroundArtBlend = 0.55;

    // Hidden/lightened modules
    private boolean hiddenModulesEnabled = false;

    @DecimalMin(value = "0.0", message = "hiddenModuleRatio must be >= 0")
    @DecimalMax(value = "0.25", message = "hiddenModuleRatio must be <= 0.25 to stay within safe ECC headroom")
    private double hiddenModuleRatio = 0.12;

    // Decorative dots
    private boolean decorativeDotsEnabled = false;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "accentColor must be a hex color like #000000")
    private String accentColor = "#000000";

    public boolean isBackgroundArtEnabled() { return backgroundArtEnabled; }
    public void setBackgroundArtEnabled(boolean backgroundArtEnabled) { this.backgroundArtEnabled = backgroundArtEnabled; }

    public double getBackgroundArtBlend() { return backgroundArtBlend; }
    public void setBackgroundArtBlend(double backgroundArtBlend) { this.backgroundArtBlend = backgroundArtBlend; }

    public boolean isHiddenModulesEnabled() { return hiddenModulesEnabled; }
    public void setHiddenModulesEnabled(boolean hiddenModulesEnabled) { this.hiddenModulesEnabled = hiddenModulesEnabled; }

    public double getHiddenModuleRatio() { return hiddenModuleRatio; }
    public void setHiddenModuleRatio(double hiddenModuleRatio) { this.hiddenModuleRatio = hiddenModuleRatio; }

    public boolean isDecorativeDotsEnabled() { return decorativeDotsEnabled; }
    public void setDecorativeDotsEnabled(boolean decorativeDotsEnabled) { this.decorativeDotsEnabled = decorativeDotsEnabled; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
}