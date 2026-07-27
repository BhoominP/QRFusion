package com.qrfusion.backend.renderer.pattern;

import com.google.zxing.common.BitMatrix;

import java.awt.Graphics2D;

public interface PatternRenderer {

    PatternStyle getStyle();

    void draw(
            Graphics2D g,
            BitMatrix matrix,
            PatternOptions options,
            int moduleSize,
            int quietZone
    );
}