package com.qrfusion.backend.renderer.safety;

import com.qrfusion.backend.renderer.logo.LogoOptions;

import java.awt.Graphics2D;

public interface SafetyZoneRenderer {

    void drawSafetyZone(
            Graphics2D g,
            LogoOptions options,
            int imageWidth,
            int imageHeight
    );

}