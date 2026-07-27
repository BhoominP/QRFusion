package com.qrfusion.backend.renderer.logo;

import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;

@Component
public class LogoScaler {

    public LogoPlacement scale(
            BufferedImage logo,
            double sizeRatio,
            int imageWidth,
            int imageHeight
    ) {

        int maxSize =
                (int) (Math.min(imageWidth, imageHeight) * sizeRatio);

        double aspectRatio =
                (double) logo.getWidth() / logo.getHeight();

        int drawWidth;
        int drawHeight;

        if (aspectRatio >= 1) {

            drawWidth = maxSize;
            drawHeight = (int) (maxSize / aspectRatio);

        } else {

            drawHeight = maxSize;
            drawWidth = (int) (maxSize * aspectRatio);

        }

        return new LogoPlacement(
                0,
                0,
                drawWidth,
                drawHeight
        );
    }

    /**
     * Returns the maximum dimension (width or height) of the
     * scaled logo. Useful for safety-zone calculations.
     */
    public int calculateSize(
            BufferedImage logo,
            int imageWidth,
            int imageHeight,
            LogoOptions options
    ) {

        LogoPlacement placement = scale(
                logo,
                options.getSizeRatio(),
                imageWidth,
                imageHeight
        );

        return Math.max(
                placement.getWidth(),
                placement.getHeight()
        );
    }
}