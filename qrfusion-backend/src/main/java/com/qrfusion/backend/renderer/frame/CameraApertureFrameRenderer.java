package com.qrfusion.backend.renderer.frame;

import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.geom.Arc2D;
import java.awt.geom.Area;
import java.awt.geom.Ellipse2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;

@Component
public class CameraApertureFrameRenderer implements FrameRenderer {

    private static final int MARGIN = 60;
    private static final int PANEL_PADDING = 30;
    private static final int PANEL_ARC = 28;

    private static final int BLADE_COUNT = 6;
    private static final double BLADE_GAP_DEGREES = 6.0;

    @Override
    public FrameStyle getStyle() {
        return FrameStyle.CAMERA_APERTURE;
    }

    @Override
    public BufferedImage applyFrame(
            BufferedImage qrImage,
            FrameOptions options
    ) {

        int qrWidth = qrImage.getWidth();
        int qrHeight = qrImage.getHeight();

        int panelWidth = qrWidth + PANEL_PADDING * 2;
        int panelHeight = qrHeight + PANEL_PADDING * 2;

        int largestPanelDimension =
                Math.max(panelWidth, panelHeight);

        int circleDiameter =
                (int) (largestPanelDimension * 1.35);

        int canvasSize =
                circleDiameter + MARGIN * 2;

        BufferedImage canvas =
                new BufferedImage(
                        canvasSize,
                        canvasSize,
                        BufferedImage.TYPE_INT_ARGB
                );

        Graphics2D g = canvas.createGraphics();

        try {

            // -----------------------------
            // Rendering Quality
            // -----------------------------

            g.setRenderingHint(
                    RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON
            );

            g.setRenderingHint(
                    RenderingHints.KEY_RENDERING,
                    RenderingHints.VALUE_RENDER_QUALITY
            );

            g.setRenderingHint(
                    RenderingHints.KEY_STROKE_CONTROL,
                    RenderingHints.VALUE_STROKE_PURE
            );

            g.setRenderingHint(
                    RenderingHints.KEY_TEXT_ANTIALIASING,
                    RenderingHints.VALUE_TEXT_ANTIALIAS_ON
            );

            int centerX = canvasSize / 2;
            int centerY = canvasSize / 2;

            int radius = circleDiameter / 2;

            // -----------------------------
            // Camera Aperture Circle
            // -----------------------------

            Area aperture =
                    new Area(
                            new Ellipse2D.Double(
                                    centerX - radius,
                                    centerY - radius,
                                    circleDiameter,
                                    circleDiameter
                            )
                    );

            double angleStep =
                    360.0 / BLADE_COUNT;

            for (int i = 0; i < BLADE_COUNT; i++) {

                double angle = i * angleStep;

                Area gap =
                        new Area(
                                new Arc2D.Double(
                                        centerX - radius,
                                        centerY - radius,
                                        circleDiameter,
                                        circleDiameter,
                                        angle - BLADE_GAP_DEGREES / 2,
                                        BLADE_GAP_DEGREES,
                                        Arc2D.PIE
                                )
                        );

                aperture.subtract(gap);
            }

            g.setColor(options.getFrameColor());
            g.fill(aperture);

            // -----------------------------
            // White QR Panel
            // -----------------------------

            int panelX =
                    centerX - panelWidth / 2;

            int panelY =
                    centerY - panelHeight / 2;

            g.setColor(Color.WHITE);

            g.fill(
                    new RoundRectangle2D.Double(
                            panelX,
                            panelY,
                            panelWidth,
                            panelHeight,
                            PANEL_ARC,
                            PANEL_ARC
                    )
            );

            // -----------------------------
            // QR Image
            // -----------------------------

            g.drawImage(
                    qrImage,
                    panelX + PANEL_PADDING,
                    panelY + PANEL_PADDING,
                    null
            );

        } finally {
            g.dispose();
        }

        return canvas;
    }
}