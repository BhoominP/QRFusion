package com.qrfusion.backend.renderer.logo;

import java.awt.Graphics2D;

public interface LogoRenderer {

    LogoShape getShape();

    void drawLogo(
            Graphics2D g,
            LogoOptions options,
            int imageWidth,
            int imageHeight
    );

}