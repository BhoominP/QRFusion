package com.qrfusion.backend.renderer.frame;

import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;

@Component
public class NoneFrameRenderer implements FrameRenderer {

    @Override
    public FrameStyle getStyle() {
        return FrameStyle.NONE;
    }

    @Override
    public BufferedImage applyFrame(BufferedImage qrImage, FrameOptions options) {
        return qrImage;
    }
}