package com.qrfusion.backend.renderer.frame;

import java.awt.image.BufferedImage;

public interface FrameRenderer {

    FrameStyle getStyle();

    /**
     * Takes the already-fully-rendered QR image and returns a new,
     * larger image with this frame's decoration applied around it.
     * The QR's own pixels are only ever pasted onto a bigger canvas,
     * never redrawn or modified - so scanability is untouched.
     */
    BufferedImage applyFrame(BufferedImage qrImage, FrameOptions options);
}