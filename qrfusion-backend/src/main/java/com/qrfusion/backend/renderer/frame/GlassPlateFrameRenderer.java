package com.qrfusion.backend.renderer.frame;

import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;

@Component
public class GlassPlateFrameRenderer implements FrameRenderer {

    private static final int PADDING = 36;
    private static final int INNER_CONTAINER_PADDING = 16;
    private static final int CARD_ARC = 48;
    private static final int PANEL_ARC = 32;

    @Override
    public FrameStyle getStyle() {
        return FrameStyle.GLASS_PLATE;
    }

    @Override
    public BufferedImage applyFrame(BufferedImage qrImage, FrameOptions options) {

        int qrSize = qrImage.getWidth();
        String position = options.getCaptionPosition() != null ? options.getCaptionPosition().toUpperCase() : "TOP";

        boolean showCaption = options.getCaptionText() != null && !options.getCaptionText().trim().isEmpty();

        Font captionFont = buildCaptionFont(options.getCaptionFont(), options.getCaptionSize());

        // Measure caption text dimensions
        BufferedImage dummy = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
        Graphics2D dummyG = dummy.createGraphics();
        dummyG.setFont(captionFont);
        FontMetrics fm = dummyG.getFontMetrics();
        dummyG.dispose();

        String captionStr = showCaption ? options.getCaptionText().trim() : "";

        int textWidth = showCaption ? fm.stringWidth(captionStr) : 0;
        int textHeight = showCaption ? fm.getHeight() : 0;

        boolean isHorizontal = showCaption && ("LEFT".equals(position) || "RIGHT".equals(position));

        int innerContainerSize = qrSize + INNER_CONTAINER_PADDING * 2;
        int captionBoxHeight = showCaption ? Math.max(textHeight + 20, 52) : 0;
        int captionBoxWidth = showCaption ? Math.max(textWidth + 32, 120) : 0;

        int panelWidth;
        int panelHeight;

        if (!showCaption) {
            panelWidth = innerContainerSize + 32;
            panelHeight = innerContainerSize + 32;
        } else if (isHorizontal) {
            panelWidth = innerContainerSize + captionBoxWidth + 32;
            panelHeight = Math.max(innerContainerSize + 32, captionBoxHeight + 32);
        } else {
            panelWidth = Math.max(innerContainerSize + 32, captionBoxWidth + 32);
            panelHeight = innerContainerSize + captionBoxHeight + 32;
        }

        int cardWidth = panelWidth + PADDING * 2;
        int cardHeight = panelHeight + PADDING * 2;

        int margin = 80;
        int canvasWidth = cardWidth + margin * 2;
        int canvasHeight = cardHeight + margin * 2;

        BufferedImage canvas = new BufferedImage(
                canvasWidth, canvasHeight, BufferedImage.TYPE_INT_ARGB
        );

        Graphics2D g = canvas.createGraphics();

        try {
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);

            int cardX = margin;
            int cardY = margin;

            // 1. Render Canvas Background (Custom uploaded background or default pitch-black + vibrant gradient spheres)
            if (options.getBackgroundImage() != null) {
                BufferedImage bg = options.getBackgroundImage();
                double scale = Math.max(
                        (double) canvasWidth / bg.getWidth(),
                        (double) canvasHeight / bg.getHeight()
                );
                int newWidth = (int) Math.round(bg.getWidth() * scale);
                int newHeight = (int) Math.round(bg.getHeight() * scale);
                int offsetX = (canvasWidth - newWidth) / 2;
                int offsetY = (canvasHeight - newHeight) / 2;
                g.drawImage(bg, offsetX, offsetY, newWidth, newHeight, null);
            } else {
                g.setColor(Color.BLACK);
                g.fillRect(0, 0, canvasWidth, canvasHeight);

                drawGradientSphere(g, cardX + cardWidth - 20, cardY - 20, 160,
                        new Color(0xFF, 0xEE, 0x00), new Color(0xFF, 0x33, 0x00));

                drawGradientSphere(g, cardX - 40, cardY + cardHeight / 2 - 20, 140,
                        new Color(0xFF, 0xEE, 0x00), new Color(0xFF, 0x55, 0x00));

                drawGradientSphere(g, cardX + cardWidth - 50, cardY + cardHeight - 20, 100,
                        new Color(0xFF, 0xEE, 0x00), new Color(0xFF, 0x88, 0x00));
            }

            // 2. Extract and Box-Blur the Sub-region under the Glass Plate for Real Frosted Glass Effect
            Shape glassShape = new RoundRectangle2D.Double(cardX, cardY, cardWidth, cardHeight, CARD_ARC, CARD_ARC);

            BufferedImage subCanvas = canvas.getSubimage(cardX, cardY, cardWidth, cardHeight);
            BufferedImage blurredSub = applyGaussianBlur(subCanvas, 18);

            // Clip & Draw Blurred Background under Glass Plate
            Shape oldClip = g.getClip();
            g.setClip(glassShape);
            g.drawImage(blurredSub, cardX, cardY, null);

            // Layer Frosted Tint over Blurred Background
            Composite prevComposite = g.getComposite();
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.45f));
            g.setColor(new Color(255, 255, 255));
            g.fill(glassShape);

            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.35f));
            g.setColor(new Color(15, 20, 30));
            g.fill(glassShape);

            // 3. Specular Glare / Shine Pass Across Frosted Glass
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.85f));
            LinearGradientPaint glassShine = new LinearGradientPaint(
                    new Point(cardX, cardY),
                    new Point(cardX + cardWidth, cardY + cardHeight),
                    new float[]{0.0f, 0.25f, 0.50f, 0.75f, 1.0f},
                    new Color[]{
                            new Color(255, 255, 255, 160),
                            new Color(255, 255, 255, 50),
                            new Color(255, 255, 255, 10),
                            new Color(255, 255, 255, 35),
                            new Color(255, 255, 255, 0)
                    }
            );
            g.setPaint(glassShine);
            g.fill(glassShape);

            // Reset Clip & Composite
            g.setClip(oldClip);
            g.setComposite(prevComposite);

            // 4. Glass Edge Specular Highlight Rim
            g.setColor(new Color(255, 255, 255, 180));
            g.setStroke(new BasicStroke(2.0f));
            g.draw(glassShape);

            int panelX = cardX + PADDING;
            int panelY = cardY + PADDING;

            // Draw inner card plate (White card unless transparent mode is active)
            if (!options.isGlassPlateTransparent()) {
                g.setColor(Color.WHITE);
                g.fill(new RoundRectangle2D.Double(panelX, panelY, panelWidth, panelHeight, PANEL_ARC, PANEL_ARC));
            }

            int containerX = panelX + 16;
            int containerY = panelY + 16;

            int textCenterX = panelX + panelWidth / 2;
            int textCenterY = panelY + captionBoxHeight / 2 + 6;

            if (!showCaption) {
                containerX = panelX + 16;
                containerY = panelY + 16;
            } else {
                switch (position) {
                    case "BOTTOM":
                        containerY = panelY + 16;
                        textCenterY = panelY + panelHeight - captionBoxHeight / 2 - 6;
                        break;
                    case "LEFT":
                        containerX = panelX + captionBoxWidth + 16;
                        textCenterX = panelX + captionBoxWidth / 2 + 8;
                        textCenterY = panelY + panelHeight / 2;
                        break;
                    case "RIGHT":
                        containerX = panelX + 16;
                        textCenterX = panelX + panelWidth - captionBoxWidth / 2 - 8;
                        textCenterY = panelY + panelHeight / 2;
                        break;
                    case "TOP":
                    default:
                        containerY = panelY + captionBoxHeight + 16;
                        textCenterY = panelY + captionBoxHeight / 2 + 6;
                        break;
                }
            }

            // Draw caption text using user's caption text color
            if (showCaption) {
                g.setColor(options.getCaptionTextColor() != null ? options.getCaptionTextColor() : new Color(0x0F, 0x17, 0x2A));
                g.setFont(captionFont);

                int textDrawX = textCenterX - textWidth / 2;
                int textDrawY = textCenterY + (fm.getAscent() - fm.getDescent()) / 2;

                g.drawString(captionStr, textDrawX, textDrawY);
            }

            // Draw QR Code directly on panel
            g.drawImage(qrImage, containerX + INNER_CONTAINER_PADDING, containerY + INNER_CONTAINER_PADDING, null);

        } finally {
            g.dispose();
        }

        return canvas;
    }

    private Font buildCaptionFont(String fontChoice, int fontSize) {
        int size = fontSize > 0 ? (int) Math.round(fontSize * 1.1) : 24;
        String choice = fontChoice != null ? fontChoice.toUpperCase() : "INTER";

        switch (choice) {
            case "PLAYFAIR":
            case "LORA":
            case "CINZEL":
            case "SERIF":
                return new Font("Serif", Font.BOLD, size);
            case "MONO":
                return new Font("Monospaced", Font.BOLD, size);
            case "BEBAS":
                return new Font("SansSerif", Font.BOLD, (int) (size * 1.15));
            case "PACIFICO":
                return new Font("Dialog", Font.ITALIC, size);
            case "FREDOKA":
            case "OUTFIT":
                return new Font("SansSerif", Font.PLAIN, size);
            case "ROBOTO":
            case "INTER":
            default:
                return new Font("SansSerif", Font.BOLD, size);
        }
    }

    private BufferedImage applyGaussianBlur(BufferedImage src, int radius) {
        int w = src.getWidth();
        int h = src.getHeight();
        BufferedImage dst = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);

        int[] srcPixels = src.getRGB(0, 0, w, h, null, 0, w);
        int[] dstPixels = new int[w * h];

        boxBlur(srcPixels, dstPixels, w, h, radius);
        boxBlur(dstPixels, srcPixels, h, w, radius);

        dst.setRGB(0, 0, w, h, srcPixels, 0, w);
        return dst;
    }

    private void boxBlur(int[] in, int[] out, int w, int h, int radius) {
        int div = radius + radius + 1;
        for (int y = 0; y < h; y++) {
            int a = 0, r = 0, g = 0, b = 0;
            int yi = y * w;

            for (int i = -radius; i <= radius; i++) {
                int rgb = in[yi + Math.min(w - 1, Math.max(0, i))];
                a += (rgb >> 24) & 0xff;
                r += (rgb >> 16) & 0xff;
                g += (rgb >> 8) & 0xff;
                b += rgb & 0xff;
            }

            for (int x = 0; x < w; x++) {
                out[yi + x] = ((a / div) << 24) | ((r / div) << 16) | ((g / div) << 8) | (b / div);

                int i1 = yi + Math.min(w - 1, Math.max(0, x + radius + 1));
                int i2 = yi + Math.min(w - 1, Math.max(0, x - radius));

                int rgb1 = in[i1];
                int rgb2 = in[i2];

                a += ((rgb1 >> 24) & 0xff) - ((rgb2 >> 24) & 0xff);
                r += ((rgb1 >> 16) & 0xff) - ((rgb2 >> 16) & 0xff);
                g += ((rgb1 >> 8) & 0xff) - ((rgb2 >> 8) & 0xff);
                b += (rgb1 & 0xff) - (rgb2 & 0xff);
            }
        }
    }

    private void drawGradientSphere(Graphics2D g, int cx, int cy, int diameter, Color centerColor, Color outerColor) {
        int radius = diameter / 2;

        RadialGradientPaint gradient = new RadialGradientPaint(
                new Point(cx, cy),
                radius,
                new float[]{0f, 0.5f, 0.85f, 1f},
                new Color[]{
                        new Color(centerColor.getRed(), centerColor.getGreen(), centerColor.getBlue(), 255),
                        new Color(outerColor.getRed(), outerColor.getGreen(), outerColor.getBlue(), 220),
                        new Color(outerColor.getRed(), outerColor.getGreen(), outerColor.getBlue(), 120),
                        new Color(outerColor.getRed(), outerColor.getGreen(), outerColor.getBlue(), 0)
                }
        );

        g.setPaint(gradient);
        g.fill(new Ellipse2D.Double(cx - radius, cy - radius, diameter, diameter));
    }
}