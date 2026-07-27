package com.qrfusion.backend.renderer.background;

import org.springframework.stereotype.Component;

import java.awt.AlphaComposite;
import java.awt.Composite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

@Component
public class BackgroundRenderer {

    public void render(
            Graphics2D g,
            BackgroundOptions options,
            int imageWidth,
            int imageHeight
    ) {

        if (options == null || options.getImage() == null) {
            return;
        }

        BufferedImage background = options.getImage();

        Composite oldComposite = g.getComposite();

        Composite blendComposite = switch (options.getBlendMode()) {

            case MULTIPLY -> BlendComposite.multiply(
                    (float) options.getOpacity()
            );

            case SCREEN -> BlendComposite.screen(
                    (float) options.getOpacity()
            );

            case NORMAL -> AlphaComposite.getInstance(
                    AlphaComposite.SRC_OVER,
                    (float) options.getOpacity()
            );
        };

        g.setComposite(blendComposite);

        double scale = Math.max(
                (double) imageWidth / background.getWidth(),
                (double) imageHeight / background.getHeight()
        );

        int newWidth = (int) Math.round(background.getWidth() * scale);
        int newHeight = (int) Math.round(background.getHeight() * scale);

        int offsetX = (imageWidth - newWidth) / 2;
        int offsetY = (imageHeight - newHeight) / 2;

        g.drawImage(
                background,
                offsetX,
                offsetY,
                newWidth,
                newHeight,
                null
        );

        g.setComposite(oldComposite);
    }
}