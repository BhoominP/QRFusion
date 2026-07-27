package com.qrfusion.backend.renderer.animation;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.qrfusion.backend.renderer.QrRenderer;
import com.qrfusion.backend.renderer.RenderOptions;
import com.qrfusion.backend.renderer.frame.FrameEngine;
import com.qrfusion.backend.renderer.frame.FrameOptions;
import com.qrfusion.backend.renderer.frame.FrameStyle;
import com.qrfusion.backend.renderer.watermark.WatermarkRenderer;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Builds an animated GIF where each of the 8 frames is a genuinely
 * different, fully valid encoding of the SAME content - one per QR
 * mask pattern (0-7). Supports applying decorative frames (GLASS_PLATE,
 * SCAN_ME_CARD, etc.) and adaptive watermarking to each frame of the animation.
 */
@Component
public class AnimatedQrRenderer {

    private static final int MASK_COUNT = 8;

    private final QrRenderer qrRenderer;
    private final WatermarkRenderer watermarkRenderer;

    public AnimatedQrRenderer(QrRenderer qrRenderer, WatermarkRenderer watermarkRenderer) {
        this.qrRenderer = qrRenderer;
        this.watermarkRenderer = watermarkRenderer;
    }

    public byte[] renderGif(
            String content,
            RenderOptions options,
            int frameDelayMs
    ) throws Exception {
        return renderGif(content, options, null, null, frameDelayMs);
    }

    public byte[] renderGif(
            String content,
            RenderOptions options,
            FrameOptions frameOptions,
            FrameEngine frameEngine,
            int frameDelayMs
    ) throws Exception {

        List<BufferedImage> frames = new ArrayList<>(MASK_COUNT);

        for (int mask = 0; mask < MASK_COUNT; mask++) {

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 0);
            hints.put(EncodeHintType.QR_MASK_PATTERN, mask);

            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    content,
                    BarcodeFormat.QR_CODE,
                    0,
                    0,
                    hints
            );

            BufferedImage frameImage = qrRenderer.render(bitMatrix, options);

            if (frameOptions != null && frameOptions.getStyle() != FrameStyle.NONE && frameEngine != null) {
                frameImage = frameEngine.getRenderer(frameOptions.getStyle()).applyFrame(frameImage, frameOptions);
            }

            // Apply adaptive QrFusion_logo_2.svg watermark to each frame of the GIF
            frameImage = watermarkRenderer.applyWatermark(frameImage, options);

            frames.add(frameImage);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        int imageType = (frames.get(0).getType() != 0) ? frames.get(0).getType() : BufferedImage.TYPE_INT_ARGB;

        try (GifSequenceWriter writer = new GifSequenceWriter(
                outputStream,
                imageType,
                frameDelayMs,
                true
        )) {
            for (BufferedImage frame : frames) {
                writer.writeToSequence(frame);
            }
        }

        return outputStream.toByteArray();
    }
}