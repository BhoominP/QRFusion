package com.qrfusion.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.qrfusion.backend.dto.QrRequest;
import com.qrfusion.backend.renderer.QrRenderer;
import com.qrfusion.backend.renderer.RenderOptions;
import com.qrfusion.backend.renderer.animation.AnimatedQrRenderer;
import com.qrfusion.backend.renderer.background.BackgroundArtSampler;
import com.qrfusion.backend.renderer.background.BackgroundOptions;
import com.qrfusion.backend.renderer.export.ExportFormat;
import com.qrfusion.backend.renderer.frame.FrameEngine;
import com.qrfusion.backend.renderer.frame.FrameOptions;
import com.qrfusion.backend.renderer.frame.FrameStyle;
import com.qrfusion.backend.renderer.logo.LogoOptions;
import com.qrfusion.backend.renderer.pattern.PatternOptions;
import com.qrfusion.backend.renderer.pdf.PdfRenderer;
import com.qrfusion.backend.renderer.svg.SvgRenderer;
import com.qrfusion.backend.renderer.watermark.WatermarkRenderer;
import com.qrfusion.backend.service.export.ExportResult;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class QrServiceImpl implements QrService {

    private final QrRenderer qrRenderer;
    private final SvgRenderer svgRenderer;
    private final PdfRenderer pdfRenderer;
    private final FrameEngine frameEngine;
    private final AnimatedQrRenderer animatedQrRenderer;
    private final WatermarkRenderer watermarkRenderer;

    public QrServiceImpl(
            QrRenderer qrRenderer,
            SvgRenderer svgRenderer,
            PdfRenderer pdfRenderer,
            FrameEngine frameEngine,
            AnimatedQrRenderer animatedQrRenderer,
            WatermarkRenderer watermarkRenderer
    ) {
        this.qrRenderer = qrRenderer;
        this.svgRenderer = svgRenderer;
        this.pdfRenderer = pdfRenderer;
        this.frameEngine = frameEngine;
        this.animatedQrRenderer = animatedQrRenderer;
        this.watermarkRenderer = watermarkRenderer;
    }

    @Override
    public ExportResult generateQRCode(
            QrRequest request,
            MultipartFile logo
    ) throws Exception {

        return generateQRCode(request, logo, null, null);
    }

    @Override
    public ExportResult generateQRCode(
            QrRequest request,
            MultipartFile logo,
            MultipartFile background
    ) throws Exception {
        return generateQRCode(request, logo, background, null);
    }

    @Override
    public ExportResult generateQRCode(
            QrRequest request,
            MultipartFile logo,
            MultipartFile backgroundArt,
            MultipartFile frameBackground
    ) throws Exception {

        Map<EncodeHintType, Object> hints = new HashMap<>();

        hints.put(
                EncodeHintType.ERROR_CORRECTION,
                ErrorCorrectionLevel.H
        );

        hints.put(
                EncodeHintType.MARGIN,
                0
        );

        BitMatrix bitMatrix =
                new MultiFormatWriter().encode(
                        request.getContent(),
                        BarcodeFormat.QR_CODE,
                        0,
                        0,
                        hints
                );

        RenderOptions options = new RenderOptions();

        options.setImageSize(request.getSize());
        options.setExportScale(request.getExportScale());
        options.setFormat(request.getFormat());

        options.setStyle(request.getStyle());
        options.setFinderStyle(request.getFinderStyle());
        options.setColorMode(request.getColorMode());

        options.setForegroundColor(
                Color.decode(request.getForegroundColor())
        );

        Color baseBg = Color.decode(request.getBackgroundColor());
        int bgAlpha = (int) Math.round(request.getBackgroundOpacity() * 255.0);
        bgAlpha = Math.max(0, Math.min(255, bgAlpha));
        options.setBackgroundColor(new Color(baseBg.getRed(), baseBg.getGreen(), baseBg.getBlue(), bgAlpha));

        options.setStartColor(
                Color.decode(request.getStartColor())
        );

        options.setEndColor(
                Color.decode(request.getEndColor())
        );

        options.setNeonGlowEnabled(request.isNeonGlowEnabled());
        if (request.getNeonBackgroundColor() != null && !request.getNeonBackgroundColor().isBlank()) {
            try {
                options.setNeonBackgroundColor(Color.decode(request.getNeonBackgroundColor()));
            } catch (Exception ignored) {}
        }

        /*
         * -----------------------------
         * Pattern
         * -----------------------------
         */

        PatternOptions patternOptions = new PatternOptions();

        patternOptions.setStyle(request.getPatternStyle());
        patternOptions.setColor(
                Color.decode(request.getPatternColor())
        );
        patternOptions.setSize(request.getPatternSize());
        patternOptions.setSpacing(request.getPatternSpacing());

        options.setPatternOptions(patternOptions);

        /*
         * -----------------------------
         * Logo
         * -----------------------------
         */

        if (logo != null && !logo.isEmpty()) {

            BufferedImage logoImage =
                    ImageIO.read(logo.getInputStream());

            LogoOptions logoOptions =
                    new LogoOptions();

            logoOptions.setLogo(logoImage);
            logoOptions.setShape(request.getLogoShape());
            logoOptions.setPosition(request.getLogoPosition());
            logoOptions.setSizeRatio(request.getLogoSizeRatio());
            logoOptions.setSafetyZone(request.isSafetyZone());
            logoOptions.setTransparentBackground(
                    request.isTransparentLogoBackground()
            );

            if (request.getLogoBorderColor() != null) {
                try {
                    logoOptions.setBorderColor(Color.decode(request.getLogoBorderColor()));
                } catch (Exception ignored) {}
            }
            logoOptions.setBorderTransparent(request.isLogoBorderTransparent());

            options.setLogoOptions(logoOptions);
        }

        /*
         * -----------------------------
         * Art Fusion Background (Module Masking)
         * -----------------------------
         */

        if (backgroundArt != null && !backgroundArt.isEmpty()) {

            BufferedImage artImage =
                    ImageIO.read(backgroundArt.getInputStream());

            BackgroundOptions backgroundOptions =
                    new BackgroundOptions();

            backgroundOptions.setImage(artImage);

            backgroundOptions.setOpacity(
                    request.getBackgroundOpacity()
            );

            backgroundOptions.setBlendMode(
                    request.getBlendMode()
            );

            options.setBackgroundOptions(backgroundOptions);
        }

        /*
         * -----------------------------
         * SVG
         * -----------------------------
         */

        if (request.getFormat() == com.qrfusion.backend.renderer.export.ExportFormat.SVG) {

            String svg =
                    svgRenderer.render(
                            bitMatrix,
                            options
                    );

            return new ExportResult(
                    svg.getBytes(StandardCharsets.UTF_8),
                    "image/svg+xml"
            );
        }
        /*
         * -----------------------------
         * Frame Preparation
         * -----------------------------
         */
        FrameOptions frameOptions = null;
        if (request.getFrameStyle() != FrameStyle.NONE) {
            frameOptions = new FrameOptions();

            // Dedicated Glass Plate Frame canvas background image
            if (frameBackground != null && !frameBackground.isEmpty()) {
                try {
                    BufferedImage frameBgImage = ImageIO.read(frameBackground.getInputStream());
                    frameOptions.setBackgroundImage(frameBgImage);
                } catch (Exception ignored) {}
            }

            frameOptions.setStyle(request.getFrameStyle());
            frameOptions.setCaptionText(request.getFrameCaptionText());
            frameOptions.setCaptionPosition(request.getFrameCaptionPosition());
            frameOptions.setCaptionSize(request.getFrameCaptionSize());
            frameOptions.setCaptionFont(request.getFrameCaptionFont());
            frameOptions.setGlassPlateTransparent(request.isGlassPlateTransparent());
            frameOptions.setFrameColor(Color.decode(request.getFrameColor()));
            frameOptions.setCaptionTextColor(Color.decode(request.getFrameCaptionTextColor()));
        }

        if (request.getFormat() == ExportFormat.GIF) {

            byte[] gif = animatedQrRenderer.renderGif(
                    request.getContent(),
                    options,
                    frameOptions,
                    frameEngine,
                    request.getFrameDelayMs()
            );

            return new ExportResult(gif, "image/gif");
        }

        /*
         * -----------------------------
         * Render QR Image
         * -----------------------------
         */

        BufferedImage image =
                qrRenderer.render(
                        bitMatrix,
                        options
                );

        /*
         * -----------------------------
         * Frame
         * -----------------------------
         */

        if (frameOptions != null) {
            image = frameEngine
                    .getRenderer(request.getFrameStyle())
                    .applyFrame(image, frameOptions);
        }

        /*
         * -----------------------------
         * Watermark Application (QrFusion_logo_2.svg)
         * -----------------------------
         */
        image = watermarkRenderer.applyWatermark(image, options);

        /*
         * -----------------------------
         * Export
         * -----------------------------
         */

        switch (request.getFormat()) {

            case PDF:

                return new ExportResult(
                        pdfRenderer.render(image),
                        "application/pdf"
                );

            case PNG:

                ByteArrayOutputStream output =
                        new ByteArrayOutputStream();

                ImageIO.write(
                        image,
                        "PNG",
                        output
                );

                return new ExportResult(
                        output.toByteArray(),
                        "image/png"
                );

            default:
                throw new IllegalArgumentException(
                        "Unsupported format: " + request.getFormat()
                );
        }

    }
}