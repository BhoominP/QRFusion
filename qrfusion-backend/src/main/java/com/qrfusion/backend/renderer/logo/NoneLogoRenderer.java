package com.qrfusion.backend.renderer.logo;

import org.springframework.stereotype.Component;

import java.awt.Graphics2D;

@Component
public class NoneLogoRenderer implements LogoRenderer {

    @Override
    public LogoShape getShape() {
        return LogoShape.NONE;
    }

    @Override
    public void drawLogo(
            Graphics2D g,
            LogoOptions options,
            int imageWidth,
            int imageHeight
    ) {
        // Intentionally a no-op.
    }
}