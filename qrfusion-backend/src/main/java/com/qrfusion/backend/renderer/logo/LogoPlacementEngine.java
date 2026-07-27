package com.qrfusion.backend.renderer.logo;

import org.springframework.stereotype.Component;

import java.awt.Point;

@Component
public class LogoPlacementEngine {

    public LogoPlacement place(
            LogoPlacement scaled,
            LogoPosition position,
            int imageWidth,
            int imageHeight
    ) {

        int x;
        int y;

        switch (position) {

            case TOP:
                x = (imageWidth - scaled.getWidth()) / 2;
                y = 0;
                break;

            case BOTTOM:
                x = (imageWidth - scaled.getWidth()) / 2;
                y = imageHeight - scaled.getHeight();
                break;

            case LEFT:
                x = 0;
                y = (imageHeight - scaled.getHeight()) / 2;
                break;

            case RIGHT:
                x = imageWidth - scaled.getWidth();
                y = (imageHeight - scaled.getHeight()) / 2;
                break;

            case TOP_LEFT:
                x = 0;
                y = 0;
                break;

            case TOP_RIGHT:
                x = imageWidth - scaled.getWidth();
                y = 0;
                break;

            case BOTTOM_LEFT:
                x = 0;
                y = imageHeight - scaled.getHeight();
                break;

            case BOTTOM_RIGHT:
                x = imageWidth - scaled.getWidth();
                y = imageHeight - scaled.getHeight();
                break;

            case CENTER:
            default:
                x = (imageWidth - scaled.getWidth()) / 2;
                y = (imageHeight - scaled.getHeight()) / 2;
                break;
        }

        return new LogoPlacement(
                x,
                y,
                scaled.getWidth(),
                scaled.getHeight()
        );
    }

    /**
     * Legacy helper.
     * New code should use place(...) instead.
     */
    public Point getPlacement(
            LogoPosition position,
            int drawWidth,
            int drawHeight,
            int imageWidth,
            int imageHeight
    ) {

        LogoPlacement placement = place(
                new LogoPlacement(
                        0,
                        0,
                        drawWidth,
                        drawHeight
                ),
                position,
                imageWidth,
                imageHeight
        );

        return new Point(
                placement.getX(),
                placement.getY()
        );
    }
}