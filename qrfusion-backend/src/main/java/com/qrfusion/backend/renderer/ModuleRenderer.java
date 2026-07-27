package com.qrfusion.backend.renderer;

import java.awt.Graphics2D;

public interface ModuleRenderer {

    RenderStyle getStyle();

    void drawModule(
            Graphics2D graphics,
            int x,
            int y,
            int moduleSize,
            RenderOptions options
    );

}