package com.qrfusion.backend.renderer.glass;

import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;

@Component
public class GlassBlur {

    /**
     * Draws a blurred background for the glass effect.
     */
    public void draw(
            Graphics2D g,
            BufferedImage image,
            int width,
            int height
    ) {

        if (image == null) {
            return;
        }

        BufferedImage scaled = new BufferedImage(
                width,
                height,
                BufferedImage.TYPE_INT_ARGB
        );

        Graphics2D sg = scaled.createGraphics();

        sg.setRenderingHint(
                RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR
        );

        sg.drawImage(
                image,
                0,
                0,
                width,
                height,
                null
        );

        sg.dispose();

        /*
         * 5x5 Gaussian Blur Kernel
         */

        float[] kernel = {
                1f,  4f,  6f,  4f, 1f,
                4f, 16f, 24f, 16f, 4f,
                6f, 24f, 36f, 24f, 6f,
                4f, 16f, 24f, 16f, 4f,
                1f,  4f,  6f,  4f, 1f
        };

        float sum = 0f;

        for (float value : kernel) {
            sum += value;
        }

        for (int i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }

        ConvolveOp blur = new ConvolveOp(
                new Kernel(5, 5, kernel),
                ConvolveOp.EDGE_NO_OP,
                null
        );

        BufferedImage blurred =
                blur.filter(scaled, null);

        Composite oldComposite = g.getComposite();

        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.45f
                )
        );

        g.drawImage(
                blurred,
                0,
                0,
                null
        );

        /*
         * White frosted overlay
         */

        g.setComposite(
                AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER,
                        0.18f
                )
        );

        g.setColor(Color.WHITE);

        g.fillRect(
                0,
                0,
                width,
                height
        );

        g.setComposite(oldComposite);
    }
}