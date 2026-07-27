package com.qrfusion.backend.renderer.logo;

import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;

@Component
public class LogoTransparencyUtil {

    public BufferedImage removeWhiteBackground(
            BufferedImage image
    ) {

        int width = image.getWidth();
        int height = image.getHeight();

        BufferedImage result =
                new BufferedImage(
                        width,
                        height,
                        BufferedImage.TYPE_INT_ARGB
                );

        for (int y = 0; y < height; y++) {

            for (int x = 0; x < width; x++) {

                int rgb = image.getRGB(x, y);

                int r = (rgb >> 16) & 0xff;
                int g = (rgb >> 8) & 0xff;
                int b = rgb & 0xff;

                // Near-white becomes transparent
                if (r > 245 && g > 245 && b > 245) {

                    result.setRGB(x, y, 0x00000000);

                } else {

                    result.setRGB(x, y, rgb);

                }
            }
        }

        return result;
    }

}