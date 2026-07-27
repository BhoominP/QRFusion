package com.qrfusion.backend.renderer.background;

import java.awt.Composite;
import java.awt.CompositeContext;
import java.awt.RenderingHints;
import java.awt.image.ColorModel;
import java.awt.image.Raster;
import java.awt.image.WritableRaster;

/**
 * Real per-pixel Multiply/Screen blending. AlphaComposite can only do
 * standard alpha-over compositing - it has no notion of these blend
 * modes, so they have to be implemented manually here.
 */
public class BlendComposite implements Composite {

    public enum Mode {
        MULTIPLY,
        SCREEN
    }

    private final Mode mode;
    private final float alpha;

    private BlendComposite(Mode mode, float alpha) {
        this.mode = mode;
        this.alpha = alpha;
    }

    public static BlendComposite multiply(float alpha) {
        return new BlendComposite(Mode.MULTIPLY, alpha);
    }

    public static BlendComposite screen(float alpha) {
        return new BlendComposite(Mode.SCREEN, alpha);
    }

    @Override
    public CompositeContext createContext(
            ColorModel srcColorModel,
            ColorModel dstColorModel,
            RenderingHints hints
    ) {
        return new CompositeContext() {

            @Override
            public void compose(
                    Raster src,
                    Raster dstIn,
                    WritableRaster dstOut
            ) {

                int width = Math.min(src.getWidth(), dstIn.getWidth());
                int height = Math.min(src.getHeight(), dstIn.getHeight());

                int[] srcPixel = new int[4];
                int[] dstPixel = new int[4];
                int[] result = new int[4];

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {

                        src.getPixel(x, y, srcPixel);
                        dstIn.getPixel(x, y, dstPixel);

                        for (int i = 0; i < 3; i++) {
                            int s = srcPixel[i];
                            int d = dstPixel[i];

                            int blended = (mode == Mode.MULTIPLY)
                                    ? (s * d) / 255
                                    : 255 - ((255 - s) * (255 - d)) / 255;

                            // opacity still controls how strongly the
                            // blended result is mixed back over the
                            // original destination pixel
                            result[i] = (int) (d + (blended - d) * alpha);
                        }

                        result[3] = dstPixel.length > 3 ? dstPixel[3] : 255;

                        dstOut.setPixel(x, y, result);
                    }
                }
            }

            @Override
            public void dispose() {
            }
        };
    }
}