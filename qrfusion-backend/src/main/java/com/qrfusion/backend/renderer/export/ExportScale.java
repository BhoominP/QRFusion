package com.qrfusion.backend.renderer.export;

public enum ExportScale {

    X1(1),
    X2(2),
    X4(4),
    X8(8);

    private final int multiplier;

    ExportScale(int multiplier) {
        this.multiplier = multiplier;
    }

    public int getMultiplier() {
        return multiplier;
    }

}