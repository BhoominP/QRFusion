package com.qrfusion.backend.renderer.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Component
public class PdfRenderer {

    public byte[] render(
            BufferedImage image
    ) throws Exception {

        try (
                PDDocument document = new PDDocument();
                ByteArrayOutputStream output = new ByteArrayOutputStream()
        ) {

            PDPage page = new PDPage(PDRectangle.A4);

            document.addPage(page);

            PDImageXObject qrImage =
                    LosslessFactory.createFromImage(
                            document,
                            image
                    );

            float pageWidth = page.getMediaBox().getWidth();
            float pageHeight = page.getMediaBox().getHeight();

            float margin = 40;

            float drawSize = Math.min(
                    pageWidth - margin * 2,
                    pageHeight - margin * 2
            );

            float x = (pageWidth - drawSize) / 2;
            float y = (pageHeight - drawSize) / 2;

            try (
                    PDPageContentStream stream =
                            new PDPageContentStream(
                                    document,
                                    page
                            )
            ) {

                stream.drawImage(
                        qrImage,
                        x,
                        y,
                        drawSize,
                        drawSize
                );

            }

            document.save(output);

            return output.toByteArray();
        }
    }
}