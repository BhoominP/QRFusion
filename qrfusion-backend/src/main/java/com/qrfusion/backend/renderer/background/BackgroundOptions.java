package com.qrfusion.backend.renderer.background;

import java.awt.image.BufferedImage;

public class BackgroundOptions {

    private BufferedImage image;

    private double opacity = 0.30;

    private BlendMode blendMode = BlendMode.NORMAL;

    public BufferedImage getImage() {
        return image;
    }

    public void setImage(BufferedImage image) {
        this.image = image;
    }

    public double getOpacity() {
        return opacity;
    }

    public void setOpacity(double opacity) {
        this.opacity = opacity;
    }

    public BlendMode getBlendMode() {
        return blendMode;
    }

    public void setBlendMode(BlendMode blendMode) {
        this.blendMode = blendMode;
    }
}