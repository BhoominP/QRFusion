package com.qrfusion.backend.renderer.logo;

import java.awt.Color;
import java.awt.image.BufferedImage;

public class LogoOptions {

    private BufferedImage logo;

    private LogoShape shape = LogoShape.SQUARE;

    private LogoPosition position = LogoPosition.CENTER;

    private double sizeRatio = 0.20;

    private boolean transparentBackground = false;

    private boolean safetyZone = true;

    private Color borderColor = Color.WHITE;

    private boolean borderTransparent = false;

    public BufferedImage getLogo() {
        return logo;
    }

    public void setLogo(BufferedImage logo) {
        this.logo = logo;
    }

    public LogoShape getShape() {
        return shape;
    }

    public void setShape(LogoShape shape) {
        this.shape = shape;
    }

    public LogoPosition getPosition() {
        return position;
    }

    public void setPosition(LogoPosition position) {
        this.position = position;
    }

    public double getSizeRatio() {
        return sizeRatio;
    }

    public void setSizeRatio(double sizeRatio) {
        this.sizeRatio = sizeRatio;
    }

    public boolean isTransparentBackground() {
        return transparentBackground;
    }

    public void setTransparentBackground(boolean transparentBackground) {
        this.transparentBackground = transparentBackground;
    }

    public boolean isSafetyZone() {
        return safetyZone;
    }

    public void setSafetyZone(boolean safetyZone) {
        this.safetyZone = safetyZone;
    }

    public Color getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(Color borderColor) {
        this.borderColor = borderColor;
    }

    public boolean isBorderTransparent() {
        return borderTransparent;
    }

    public void setBorderTransparent(boolean borderTransparent) {
        this.borderTransparent = borderTransparent;
    }
}