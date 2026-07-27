package com.qrfusion.backend.renderer.pattern;

import java.awt.Color;

public class PatternOptions {

    private PatternStyle style = PatternStyle.NONE;

    private Color color = new Color(0, 0, 0, 45);

    private int spacing = 10;

    private int size = 3;



    public PatternStyle getStyle() {
        return style;
    }

    public void setStyle(PatternStyle style) {
        this.style = style;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public int getSpacing() {
        return spacing;
    }

    public void setSpacing(int spacing) {
        this.spacing = spacing;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}