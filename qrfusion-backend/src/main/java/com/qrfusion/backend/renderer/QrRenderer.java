package com.qrfusion.backend.renderer;

import com.google.zxing.common.BitMatrix;
import com.qrfusion.backend.renderer.background.BackgroundArtSampler;
import com.qrfusion.backend.renderer.background.BlendComposite;
import com.qrfusion.backend.renderer.color.ColorEngine;
import com.qrfusion.backend.renderer.color.ColorPainter;
import com.qrfusion.backend.renderer.decorative.DecorativeDotsRenderer;
import com.qrfusion.backend.renderer.effect.ImageEffects;
import com.qrfusion.backend.renderer.fade.ModuleFadeSelector;
import com.qrfusion.backend.renderer.finder.FinderEngine;
import com.qrfusion.backend.renderer.finder.FinderRenderer;
import com.qrfusion.backend.renderer.glass.GlassEngine;
import com.qrfusion.backend.renderer.logo.LogoEngine;
import com.qrfusion.backend.renderer.logo.LogoRenderer;
import com.qrfusion.backend.renderer.pattern.PatternEngine;
import com.qrfusion.backend.renderer.safety.SafetyEngine;
import org.springframework.stereotype.Component;
import com.qrfusion.backend.renderer.pattern.PatternStyle;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.List;
import java.util.Set;

@Component
public class QrRenderer {

    private static final float FADE_ALPHA = 0.45f;

    private final List<ModuleRenderer> renderers;
    private final ColorEngine colorEngine;
    private final FinderEngine finderEngine;
    private final LogoEngine logoEngine;
    private final SafetyEngine safetyEngine;
    private final BackgroundArtSampler backgroundArtSampler;
    private final ModuleFadeSelector moduleFadeSelector;
    private final DecorativeDotsRenderer decorativeDotsRenderer;
    private final PatternEngine patternEngine;
    private final GlassEngine glassEngine;

    public QrRenderer(
            List<ModuleRenderer> renderers,
            ColorEngine colorEngine,
            FinderEngine finderEngine,
            LogoEngine logoEngine,
            SafetyEngine safetyEngine,
            BackgroundArtSampler backgroundArtSampler,
            ModuleFadeSelector moduleFadeSelector,
            DecorativeDotsRenderer decorativeDotsRenderer, PatternEngine patternEngine, GlassEngine glassEngine
    ) {
        this.logoEngine = logoEngine;
        this.renderers = renderers;
        this.colorEngine = colorEngine;
        this.finderEngine = finderEngine;
        this.safetyEngine = safetyEngine;
        this.backgroundArtSampler = backgroundArtSampler;
        this.moduleFadeSelector = moduleFadeSelector;
        this.decorativeDotsRenderer = decorativeDotsRenderer;
        this.patternEngine = patternEngine;
        this.glassEngine = glassEngine;
    }

    private ModuleRenderer getRenderer(RenderStyle style) {
        return renderers.stream()
                .filter(renderer -> renderer.getStyle() == style)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No renderer found for style: " + style));
    }

    public BufferedImage render(BitMatrix bitMatrix, RenderOptions options) {

        ModuleRenderer moduleRenderer = getRenderer(options.getStyle());
        FinderRenderer finderRenderer = finderEngine.getRenderer(options.getFinderStyle());

        int matrixWidth = bitMatrix.getWidth();
        int matrixHeight = bitMatrix.getHeight();

        int scaledImageSize = options.getImageSize() * options.getExportScale().getMultiplier();

        int moduleSize = Math.max(
                1,
                scaledImageSize / (matrixWidth + options.getQuietZone() * 2)
        );

        int imageWidth = (matrixWidth + options.getQuietZone() * 2) * moduleSize;
        int imageHeight = (matrixHeight + options.getQuietZone() * 2) * moduleSize;

        BufferedImage image = new BufferedImage(imageWidth, imageHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();

        boolean neon = options.isNeonGlowEnabled();
        BufferedImage sharpLayer = neon ? new BufferedImage(imageWidth, imageHeight, BufferedImage.TYPE_INT_ARGB) : image;
        Graphics2D targetG = neon ? sharpLayer.createGraphics() : g;

        try {

            targetG.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            targetG.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            BufferedImage bg = null;
            if (options.getBackgroundOptions() != null && options.getBackgroundOptions().getImage() != null) {
                bg = options.getBackgroundOptions().getImage();
            } else if (options.getBackgroundArt() != null) {
                bg = options.getBackgroundArt();
            }

            if (!neon) {
                // Fill background canvas with solid background color when neon is disabled
                targetG.setColor(options.getBackgroundColor() != null ? options.getBackgroundColor() : Color.WHITE);
                targetG.fillRect(0, 0, imageWidth, imageHeight);
            }

            BufferedImage scaledBg = null;
            double opacity = 0.50;
            if (options.getBackgroundOptions() != null) {
                opacity = options.getBackgroundOptions().getOpacity();
            }

            // Darkening contrast tint for dark modules to ensure 100% scan reliability
            int darkTintAlpha = (int) Math.round((1.0 - opacity) * 200.0);
            darkTintAlpha = Math.max(0, Math.min(220, darkTintAlpha));

            if (bg != null) {
                int qrWidthPx = matrixWidth * moduleSize;
                int qrHeightPx = matrixHeight * moduleSize;

                scaledBg = new BufferedImage(qrWidthPx, qrHeightPx, BufferedImage.TYPE_INT_ARGB);
                Graphics2D gBg = scaledBg.createGraphics();
                gBg.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);

                double scale = Math.max((double) qrWidthPx / bg.getWidth(), (double) qrHeightPx / bg.getHeight());
                int newW = (int) Math.round(bg.getWidth() * scale);
                int newH = (int) Math.round(bg.getHeight() * scale);
                int offX = (qrWidthPx - newW) / 2;
                int offY = (qrHeightPx - newH) / 2;
                gBg.drawImage(bg, offX, offY, newW, newH, null);
                gBg.dispose();
            }

            /*
             * -----------------------------------------
             * Pattern Layer
             * -----------------------------------------
             */

            if (scaledBg == null && options.getPatternOptions() != null
                    && options.getPatternOptions().getStyle() != PatternStyle.NONE) {

                patternEngine
                        .getRenderer(options.getPatternOptions().getStyle())
                        .draw(
                                targetG,
                                bitMatrix,
                                options.getPatternOptions(),
                                moduleSize,
                                options.getQuietZone()
                        );
            }

            ColorPainter painter = colorEngine.getPainter(options.getColorMode());
            painter.prepare(targetG, options, imageWidth, imageHeight);

            if (scaledBg == null) {
                drawFinderEyes(targetG, finderRenderer, matrixWidth, matrixHeight, moduleSize, options);
            }

            if (options.getStyle() == RenderStyle.GLASS) {

                glassEngine.prepare(
                        targetG,
                        bg,
                        imageWidth,
                        imageHeight
                );
            }

            // ---- Background art prep ----
            BufferedImage preparedArt = null;
            if (options.getBackgroundArt() != null) {
                preparedArt = backgroundArtSampler.prepare(options.getBackgroundArt(), imageWidth, imageHeight);
            }

            // ---- Hidden-module selection ----
            Set<Long> fadedModules = options.isHiddenModulesEnabled()
                    ? moduleFadeSelector.select(matrixWidth, matrixHeight, options.getHiddenModuleRatio(), options.getSeed())
                    : Set.of();

            Composite normalComposite = targetG.getComposite();

            for (int y = 0; y < matrixHeight; y++) {
                for (int x = 0; x < matrixWidth; x++) {

                    int drawX = (x + options.getQuietZone()) * moduleSize;
                    int drawY = (y + options.getQuietZone()) * moduleSize;

                    int bgX = x * moduleSize;
                    int bgY = y * moduleSize;

                    if (scaledBg != null) {
                        boolean isFinder = isFinderPatternZone(x, y, matrixWidth, matrixHeight);

                        if (isFinder) {
                            // Finder Pattern Zone: Draw clean high-contrast black/white finder eye
                            if (bitMatrix.get(x, y)) {
                                targetG.setColor(new Color(15, 23, 42)); // Deep Slate Black
                                targetG.fillRect(drawX, drawY, moduleSize, moduleSize);
                            } else {
                                targetG.setColor(Color.WHITE);
                                targetG.fillRect(drawX, drawY, moduleSize, moduleSize);
                            }
                        } else if (bitMatrix.get(x, y)) {
                            // DARK MODULE: Crop/draw image tile & apply contrast darkening tint!
                            BufferedImage tile = scaledBg.getSubimage(bgX, bgY, moduleSize, moduleSize);
                            targetG.drawImage(tile, drawX, drawY, null);

                            if (darkTintAlpha > 0) {
                                targetG.setColor(new Color(0, 0, 0, darkTintAlpha));
                                targetG.fillRect(drawX, drawY, moduleSize, moduleSize);
                            }
                        } else {
                            // LIGHT MODULE: Draw solid white square!
                            targetG.setColor(Color.WHITE);
                            targetG.fillRect(drawX, drawY, moduleSize, moduleSize);
                        }
                    } else {
                        boolean isFinderZone = isFinderPatternZone(x, y, matrixWidth, matrixHeight);
                        if (isFinderZone || !bitMatrix.get(x, y)) continue;

                        if (preparedArt != null) {
                            Color sampled = backgroundArtSampler.sample(preparedArt, drawX, drawY, moduleSize);
                            Color blended = backgroundArtSampler.blend(
                                    options.getForegroundColor(),
                                    sampled,
                                    options.getBackgroundArtBlend(),
                                    options.getBackgroundColor()
                            );
                            targetG.setColor(blended);
                        }

                        boolean faded = moduleFadeSelector.isFaded(fadedModules, x, y);
                        if (faded) {
                            targetG.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, FADE_ALPHA));
                        }

                        if (options.getStyle() == RenderStyle.GLASS) {

                            glassEngine.drawShadow(
                                    targetG,
                                    drawX,
                                    drawY,
                                    moduleSize
                            );
                        }

                        moduleRenderer.drawModule(
                                targetG,
                                drawX,
                                drawY,
                                moduleSize,
                                options
                        );

                        if (options.getStyle() == RenderStyle.GLASS) {

                            glassEngine.drawReflection(
                                    targetG,
                                    drawX,
                                    drawY,
                                    moduleSize
                            );
                        }

                        if (faded) {
                            targetG.setComposite(normalComposite);
                        }

                        if (preparedArt != null) {
                            painter.prepare(targetG, options, imageWidth, imageHeight);
                        }
                    }
                }
            }

            if (options.getLogoOptions() != null) {

                safetyEngine.render(targetG, options.getLogoOptions(), imageWidth, imageHeight);

                LogoRenderer logoRenderer = logoEngine.getRenderer(options.getLogoOptions().getShape());
                logoRenderer.drawLogo(targetG, options.getLogoOptions(), imageWidth, imageHeight);
            }

            if (options.isDecorativeDotsEnabled()) {
                decorativeDotsRenderer.render(
                        targetG,
                        matrixWidth,
                        matrixHeight,
                        moduleSize,
                        options.getQuietZone(),
                        options.getAccentColor(),
                        options.getSeed()
                );
            }

            if (neon) {
                targetG.dispose();

                // Build the glow layer: Gaussian blur copy of the sharp layer
                int blurRadius = Math.max(6, moduleSize * 2);
                BufferedImage glowLayer = ImageEffects.blur(sharpLayer, blurRadius);

                // Fill final background with neon background color
                Color neonBg = options.getNeonBackgroundColor() != null
                        ? options.getNeonBackgroundColor()
                        : new Color(0x0A, 0x0A, 0x14);
                g.setColor(neonBg);
                g.fillRect(0, 0, imageWidth, imageHeight);

                // Composite glow bloom layer onto dark background using Screen blend
                Composite prevComposite = g.getComposite();
                g.setComposite(BlendComposite.screen(0.9f));
                g.drawImage(glowLayer, 0, 0, null);
                g.setComposite(prevComposite);

                // Paint the crisp original sharp layer on top to guarantee scannability
                g.drawImage(sharpLayer, 0, 0, null);
            }

        } finally {
            g.dispose();
        }

        return image;
    }

    private void drawFinderEyes(
            Graphics2D g,
            FinderRenderer finderRenderer,
            int matrixWidth,
            int matrixHeight,
            int moduleSize,
            RenderOptions options
    ) {

        int quietZone = options.getQuietZone();
        int eyeSize = 7 * moduleSize;

        if (options.isNeonGlowEnabled()) {
            Color neonBg = options.getNeonBackgroundColor() != null
                    ? options.getNeonBackgroundColor()
                    : new Color(0x0A, 0x0A, 0x14);
            g.setColor(neonBg);

            // Pre-fill finder zones with solid dark background to prevent blur bleeding into middle ring
            g.fillRect(quietZone * moduleSize, quietZone * moduleSize, eyeSize, eyeSize);
            g.fillRect((matrixWidth - 7 + quietZone) * moduleSize, quietZone * moduleSize, eyeSize, eyeSize);
            g.fillRect(quietZone * moduleSize, (matrixHeight - 7 + quietZone) * moduleSize, eyeSize, eyeSize);
        }

        finderRenderer.drawFinder(g, quietZone * moduleSize, quietZone * moduleSize, moduleSize, options);
        finderRenderer.drawFinder(g, (matrixWidth - 7 + quietZone) * moduleSize, quietZone * moduleSize, moduleSize, options);
        finderRenderer.drawFinder(g, quietZone * moduleSize, (matrixHeight - 7 + quietZone) * moduleSize, moduleSize, options);
    }

    private boolean isFinderPatternZone(int x, int y, int matrixWidth, int matrixHeight) {
        int zone = 8;
        boolean topLeft = x < zone && y < zone;
        boolean topRight = x >= matrixWidth - zone && y < zone;
        boolean bottomLeft = x < zone && y >= matrixHeight - zone;
        return topLeft || topRight || bottomLeft;
    }
}