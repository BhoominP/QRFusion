package com.qrfusion.backend.renderer.frame;

import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;

@Component
public class ScanMeCardFrameRenderer implements FrameRenderer {

    private static final int PADDING = 40;
    private static final int CARD_ARC = 48;
    private static final int QR_PANEL_MARGIN = 12;
    private static final int QR_PANEL_ARC = 24;

    @Override
    public FrameStyle getStyle() {
        return FrameStyle.SCAN_ME_CARD;
    }

    @Override
    public BufferedImage applyFrame(BufferedImage qrImage, FrameOptions options) {

        int qrSize = qrImage.getWidth();
        String position = options.getCaptionPosition() != null ? options.getCaptionPosition().toUpperCase() : "BOTTOM";

        Font captionFont = buildCaptionFont(options.getCaptionFont(), options.getCaptionSize());

        // Measure caption text dimensions
        BufferedImage dummy = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
        Graphics2D dummyG = dummy.createGraphics();
        dummyG.setFont(captionFont);
        FontMetrics fm = dummyG.getFontMetrics();
        dummyG.dispose();

        String captionStr = (options.getCaptionText() == null || options.getCaptionText().isBlank())
                ? "SCAN ME"
                : options.getCaptionText();

        int textWidth = fm.stringWidth(captionStr);
        int textHeight = fm.getHeight();

        boolean isHorizontal = "LEFT".equals(position) || "RIGHT".equals(position);

        int captionBoxWidth = isHorizontal ? Math.max(textWidth + 32, 120) : qrSize;
        int captionBoxHeight = isHorizontal ? qrSize : Math.max(textHeight + 28, 64);

        int cardWidth = isHorizontal ? qrSize + PADDING * 2 + captionBoxWidth + 16 : qrSize + PADDING * 2;
        int cardHeight = isHorizontal ? qrSize + PADDING * 2 : qrSize + PADDING * 2 + captionBoxHeight + 16;

        BufferedImage card = new BufferedImage(
                cardWidth, cardHeight, BufferedImage.TYPE_INT_ARGB
        );

        Graphics2D g = card.createGraphics();

        try {
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            // 1. Outer rounded card
            g.setColor(options.getFrameColor());
            g.fill(new RoundRectangle2D.Double(0, 0, cardWidth, cardHeight, CARD_ARC, CARD_ARC));

            // Calculate QR and Text positions based on CTA position
            int qrX = PADDING;
            int qrY = PADDING;

            int textCenterX = 0;
            int textCenterY = 0;

            switch (position) {
                case "TOP":
                    qrY = PADDING + captionBoxHeight + 16;
                    textCenterX = cardWidth / 2;
                    textCenterY = PADDING + captionBoxHeight / 2;
                    break;
                case "LEFT":
                    qrX = PADDING + captionBoxWidth + 16;
                    textCenterX = PADDING + captionBoxWidth / 2;
                    textCenterY = cardHeight / 2;
                    break;
                case "RIGHT":
                    qrX = PADDING;
                    textCenterX = PADDING + qrSize + 16 + captionBoxWidth / 2;
                    textCenterY = cardHeight / 2;
                    break;
                case "BOTTOM":
                default:
                    qrY = PADDING;
                    textCenterX = cardWidth / 2;
                    textCenterY = PADDING + qrSize + 16 + captionBoxHeight / 2;
                    break;
            }

            // 2. White rounded panel that frames the QR code
            g.setColor(Color.WHITE);
            g.fill(new RoundRectangle2D.Double(
                    qrX - QR_PANEL_MARGIN, qrY - QR_PANEL_MARGIN,
                    qrSize + QR_PANEL_MARGIN * 2, qrSize + QR_PANEL_MARGIN * 2,
                    QR_PANEL_ARC, QR_PANEL_ARC
            ));

            // 3. Draw QR Image
            g.drawImage(qrImage, qrX, qrY, null);

            // 4. Draw Caption Text
            g.setColor(options.getCaptionTextColor());
            g.setFont(captionFont);

            int textDrawX = textCenterX - textWidth / 2;
            int textDrawY = textCenterY + (fm.getAscent() - fm.getDescent()) / 2;

            g.drawString(captionStr, textDrawX, textDrawY);

        } finally {
            g.dispose();
        }

        return card;
    }

    private Font buildCaptionFont(String fontChoice, int fontSize) {
        int size = fontSize > 0 ? (int) Math.round(fontSize * 1.3) : 32;
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
}