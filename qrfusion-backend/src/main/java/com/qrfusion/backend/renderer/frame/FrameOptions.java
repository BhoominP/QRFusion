package com.qrfusion.backend.renderer.frame;

import java.awt.Color;
import java.awt.image.BufferedImage;

public class FrameOptions {

    private FrameStyle style = FrameStyle.NONE;
    private String captionText = "SCAN ME";
    private String captionPosition = "TOP";
    private int captionSize = 24;
    private String captionFont = "SANS";
    private boolean glassPlateTransparent = false;
    private Color frameColor = Color.BLACK;
    private Color captionTextColor = Color.WHITE;
    private BufferedImage backgroundImage;

    public FrameStyle getStyle() {
        return style;
    }

    public void setStyle(FrameStyle style) {
        this.style = style;
    }

    public String getCaptionText() {
        return captionText;
    }

    public void setCaptionText(String captionText) {
        this.captionText = captionText;
    }

    public String getCaptionPosition() {
        return captionPosition;
    }

    public void setCaptionPosition(String captionPosition) {
        this.captionPosition = captionPosition;
    }

    public int getCaptionSize() {
        return captionSize;
    }

    public void setCaptionSize(int captionSize) {
        this.captionSize = captionSize;
    }

    public String getCaptionFont() {
        return captionFont;
    }

    public void setCaptionFont(String captionFont) {
        this.captionFont = captionFont;
    }

    public boolean isGlassPlateTransparent() {
        return glassPlateTransparent;
    }

    public void setGlassPlateTransparent(boolean glassPlateTransparent) {
        this.glassPlateTransparent = glassPlateTransparent;
    }

    public Color getFrameColor() {
        return frameColor;
    }

    public void setFrameColor(Color frameColor) {
        this.frameColor = frameColor;
    }

    public Color getCaptionTextColor() {
        return captionTextColor;
    }

    public void setCaptionTextColor(Color captionTextColor) {
        this.captionTextColor = captionTextColor;
    }

    public BufferedImage getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(BufferedImage backgroundImage) {
        this.backgroundImage = backgroundImage;
    }
}