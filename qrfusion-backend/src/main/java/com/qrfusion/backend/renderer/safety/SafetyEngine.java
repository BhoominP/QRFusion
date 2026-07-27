package com.qrfusion.backend.renderer.safety;

import org.springframework.stereotype.Component;

import java.awt.*;

@Component
public class SafetyEngine {

    private final SafetyZoneRenderer renderer;

    public SafetyEngine(
            SafetyZoneRenderer renderer
    ) {
        this.renderer = renderer;
    }

    public void render(
            Graphics2D g,
            com.qrfusion.backend.renderer.logo.LogoOptions options,
            int imageWidth,
            int imageHeight
    ) {

        renderer.drawSafetyZone(
                g,
                options,
                imageWidth,
                imageHeight
        );

    }

}