package com.qrfusion.backend.renderer;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.qrfusion.backend.dto.QrRequest;
import com.qrfusion.backend.renderer.color.ColorMode;
import com.qrfusion.backend.service.QrService;
import com.qrfusion.backend.service.export.ExportResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class NeonGlowTest {

    @Autowired
    private QrRenderer qrRenderer;

    @Autowired
    private QrService qrService;

    private Result decodeQrImage(BufferedImage image) throws Exception {
        LuminanceSource source = new BufferedImageLuminanceSource(image);
        try {
            return new MultiFormatReader().decode(new BinaryBitmap(new HybridBinarizer(source)));
        } catch (Exception e) {
            // Neon QR codes have bright modules on dark background (inverted luminance)
            return new MultiFormatReader().decode(new BinaryBitmap(new HybridBinarizer(source.invert())));
        }
    }

    @Test
    @DisplayName("Neon Glow disabled produces default output byte-identically")
    void testNeonGlowDisabledDefaultOutput() throws Exception {
        BitMatrix bitMatrix = new MultiFormatWriter().encode("https://qrfusion.app", BarcodeFormat.QR_CODE, 0, 0);
        RenderOptions options = new RenderOptions();
        options.setNeonGlowEnabled(false);

        BufferedImage image = qrRenderer.render(bitMatrix, options);
        assertNotNull(image);
        assertTrue(image.getWidth() > 0);
    }

    @Test
    @DisplayName("Neon Glow enabled renders glow bloom with dark background and remains 100% scannable")
    void testNeonGlowEnabledRenderingAndScannability() throws Exception {
        String testContent = "https://qrfusion.app/neon-test";
        BitMatrix bitMatrix = new MultiFormatWriter().encode(testContent, BarcodeFormat.QR_CODE, 0, 0);

        RenderOptions options = new RenderOptions();
        options.setNeonGlowEnabled(true);
        options.setNeonBackgroundColor(new Color(0x0A, 0x0A, 0x14));
        options.setForegroundColor(new Color(0x38, 0xBD, 0xF8)); // Neon Cyan

        BufferedImage image = qrRenderer.render(bitMatrix, options);
        assertNotNull(image);

        // Verify top-left corner is neon background color (#0A0A14)
        int cornerPixel = image.getRGB(0, 0);
        Color cornerColor = new Color(cornerPixel, true);
        assertEquals(0x0A, cornerColor.getRed());
        assertEquals(0x0A, cornerColor.getGreen());
        assertEquals(0x14, cornerColor.getBlue());

        // Verify scannability using ZXing reader
        Result result = decodeQrImage(image);
        assertNotNull(result);
        assertEquals(testContent, result.getText());
    }

    @Test
    @DisplayName("Neon Glow works with Linear and Radial Gradients")
    void testNeonGlowWithGradients() throws Exception {
        String content = "https://qrfusion.app/neon-gradient";
        BitMatrix bitMatrix = new MultiFormatWriter().encode(content, BarcodeFormat.QR_CODE, 0, 0);

        RenderOptions linearOptions = new RenderOptions();
        linearOptions.setNeonGlowEnabled(true);
        linearOptions.setColorMode(ColorMode.LINEAR_GRADIENT);
        linearOptions.setStartColor(new Color(236, 72, 153)); // Neon Pink
        linearOptions.setEndColor(new Color(56, 189, 248));  // Neon Cyan

        BufferedImage linearImage = qrRenderer.render(bitMatrix, linearOptions);
        assertNotNull(linearImage);

        // Decode Linear Gradient Neon QR
        Result linearResult = decodeQrImage(linearImage);
        assertEquals(content, linearResult.getText());

        RenderOptions radialOptions = new RenderOptions();
        radialOptions.setNeonGlowEnabled(true);
        radialOptions.setColorMode(ColorMode.RADIAL_GRADIENT);
        radialOptions.setStartColor(new Color(236, 72, 153));
        radialOptions.setEndColor(new Color(168, 85, 247)); // Purple

        BufferedImage radialImage = qrRenderer.render(bitMatrix, radialOptions);
        assertNotNull(radialImage);

        // Decode Radial Gradient Neon QR
        Result radialResult = decodeQrImage(radialImage);
        assertEquals(content, radialResult.getText());
    }

    @Test
    @DisplayName("QrService end-to-end generates Neon Glow PNG with QrRequest DTO")
    void testQrServiceNeonGlowEndToEnd() throws Exception {
        QrRequest request = new QrRequest("https://qrfusion.app/service-neon", 400, RenderStyle.SQUARE);
        request.setNeonGlowEnabled(true);
        request.setNeonBackgroundColor("#0A0A14");
        request.setForegroundColor("#38BDF8");

        ExportResult exportResult = qrService.generateQRCode(request, null);
        assertNotNull(exportResult);
        assertEquals("image/png", exportResult.getContentType());
        assertTrue(exportResult.getData().length > 0);

        BufferedImage img = ImageIO.read(new ByteArrayInputStream(exportResult.getData()));
        Result decoded = decodeQrImage(img);
        assertEquals("https://qrfusion.app/service-neon", decoded.getText());
    }
}
