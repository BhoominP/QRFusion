package com.qrfusion.backend.renderer.effect;

import java.awt.image.BufferedImage;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;

/**
 * Image processing utilities for blur and glow effects.
 */
public class ImageEffects {

    /**
     * Applies a Gaussian convolution blur to a BufferedImage.
     *
     * @param image  Source ARGB image
     * @param radius Blur kernel radius
     * @return New blurred BufferedImage
     */
    public static BufferedImage blur(BufferedImage image, int radius) {
        if (image == null) {
            return null;
        }

        int r = Math.max(1, Math.min(30, radius));
        int size = r * 2 + 1;
        float[] kernelData = new float[size * size];
        float sigma = r / 2.0f;
        if (sigma < 0.1f) sigma = 0.8f;
        float twoSigmaSq = 2.0f * sigma * sigma;
        float sum = 0.0f;

        for (int y = -r; y <= r; y++) {
            for (int x = -r; x <= r; x++) {
                float val = (float) Math.exp(-(x * x + y * y) / twoSigmaSq);
                kernelData[(y + r) * size + (x + r)] = val;
                sum += val;
            }
        }

        for (int i = 0; i < kernelData.length; i++) {
            kernelData[i] /= sum;
        }

        Kernel kernel = new Kernel(size, size, kernelData);
        ConvolveOp op = new ConvolveOp(kernel, ConvolveOp.EDGE_NO_OP, null);
        return op.filter(image, null);
    }
}
