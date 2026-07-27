package com.qrfusion.backend.renderer;

import org.springframework.stereotype.Component;

import java.awt.Graphics2D;

@Component
public class RoundedRenderer implements ModuleRenderer {

    // Keep a visible gap between adjacent modules so a run of "on" cells
    // reads as a chain of distinct rounded squares, not one fused blob.
    // 0.82 mirrors the inset ratio used elsewhere for dot/circle styles.
    private static final double FILL_RATIO = 0.82;

    @Override
    public RenderStyle getStyle() {
        return RenderStyle.ROUNDED;
    }

    @Override
    public void drawModule(
            Graphics2D graphics,
            int x,
            int y,
            int moduleSize,
            RenderOptions options
    ) {

        int size = (int) Math.round(moduleSize * FILL_RATIO);
        int offset = (moduleSize - size) / 2;

        // Scale the corner radius relative to the SHRUNK size, not the
        // full moduleSize, so it still looks proportionate now that the
        // shape itself is smaller.
        double arc = Math.min(
                size,
                Math.max(options.getCornerRadius(), size * 0.4)
        );

        graphics.fillRoundRect(
                x + offset,
                y + offset,
                size,
                size,
                (int) arc,
                (int) arc
        );
    }
}