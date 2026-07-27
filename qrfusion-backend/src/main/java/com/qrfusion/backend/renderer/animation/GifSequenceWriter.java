package com.qrfusion.backend.renderer.animation;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageTypeSpecifier;
import javax.imageio.ImageWriter;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.metadata.IIOMetadataNode;
import javax.imageio.stream.ImageOutputStream;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.Closeable;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Iterator;

/**
 * Thin wrapper around javax.imageio's built-in GIF ImageWriter that
 * configures per-frame timing (Graphic Control Extension) and infinite
 * looping (NETSCAPE2.0 Application Extension) via the standard
 * metadata tree, since ImageIO's GIF writer doesn't expose an
 * animation-friendly API directly.
 */
public class GifSequenceWriter implements Closeable {

    private final ImageWriter writer;
    private final IIOMetadata metadata;
    private final ImageOutputStream output;

    public GifSequenceWriter(
            OutputStream outputStream,
            int imageType,
            int frameDelayMs,
            boolean loop
    ) throws IOException {

        output = new MemoryCacheImageOutputStream(outputStream);

        Iterator<ImageWriter> iterator = ImageIO.getImageWritersBySuffix("gif");
        if (!iterator.hasNext()) {
            throw new IOException("No GIF ImageWriter available in this JVM");
        }
        writer = iterator.next();

        ImageTypeSpecifier typeSpecifier = ImageTypeSpecifier.createFromBufferedImageType(imageType);
        metadata = writer.getDefaultImageMetadata(typeSpecifier, writer.getDefaultWriteParam());

        String metaFormat = metadata.getNativeMetadataFormatName();
        IIOMetadataNode root = (IIOMetadataNode) metadata.getAsTree(metaFormat);

        IIOMetadataNode graphicsControl = getOrCreateNode(root, "GraphicControlExtension");
        graphicsControl.setAttribute("disposalMethod", "none");
        graphicsControl.setAttribute("userInputFlag", "FALSE");
        graphicsControl.setAttribute("transparentColorFlag", "FALSE");
        // GIF delay unit is centiseconds (1/100s), so ms / 10.
        graphicsControl.setAttribute("delayTime", Integer.toString(Math.max(1, frameDelayMs / 10)));
        graphicsControl.setAttribute("transparentColorIndex", "0");

        IIOMetadataNode appExtensions = getOrCreateNode(root, "ApplicationExtensions");
        IIOMetadataNode netscape = new IIOMetadataNode("ApplicationExtension");
        netscape.setAttribute("applicationID", "NETSCAPE");
        netscape.setAttribute("authenticationCode", "2.0");
        int loopCount = loop ? 0 : 1; // 0 = loop forever
        netscape.setUserObject(new byte[]{
                0x1,
                (byte) (loopCount & 0xFF),
                (byte) ((loopCount >> 8) & 0xFF)
        });
        appExtensions.appendChild(netscape);

        metadata.setFromTree(metaFormat, root);

        writer.setOutput(output);
        writer.prepareWriteSequence(null);
    }

    public void writeToSequence(BufferedImage image) throws IOException {
        writer.writeToSequence(new IIOImage(image, null, metadata), writer.getDefaultWriteParam());
    }

    @Override
    public void close() throws IOException {
        writer.endWriteSequence();
        output.close();
    }

    private IIOMetadataNode getOrCreateNode(IIOMetadataNode root, String name) {
        for (int i = 0; i < root.getLength(); i++) {
            if (root.item(i).getNodeName().equalsIgnoreCase(name)) {
                return (IIOMetadataNode) root.item(i);
            }
        }
        IIOMetadataNode node = new IIOMetadataNode(name);
        root.appendChild(node);
        return node;
    }
}