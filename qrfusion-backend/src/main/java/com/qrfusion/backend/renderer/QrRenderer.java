package com.qrfusion.backend.renderer;

import com.google.zxing.common.BitMatrix;
import com.qrfusion.backend.renderer.background.BackgroundArtSampler;
import com.qrfusion.backend.renderer.color.ColorEngine;
import com.qrfusion.backend.renderer.color.ColorPainter;
import com.qrfusion.backend.renderer.decorative.DecorativeDotsRenderer;
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

        try {

            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            BufferedImage bg = null;
            if (options.getBackgroundOptions() != null && options.getBackgroundOptions().getImage() != null) {
                bg = options.getBackgroundOptions().getImage();
            } else if (options.getBackgroundArt() != null) {
                bg = options.getBackgroundArt();
            }

            // Always fill background canvas with solid background color (pure white or user bg)
            g.setColor(options.getBackgroundColor() != null ? options.getBackgroundColor() : Color.WHITE);
            g.fillRect(0, 0, imageWidth, imageHeight);

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
                                g,
                                bitMatrix,
                                options.getPatternOptions(),
                                moduleSize,
                                options.getQuietZone()
                        );
            }

            ColorPainter painter = colorEngine.getPainter(options.getColorMode());
            painter.prepare(g, options, imageWidth, imageHeight);

            if (scaledBg == null) {
                drawFinderEyes(g, finderRenderer, matrixWidth, matrixHeight, moduleSize, options);
            }

            if (options.getStyle() == RenderStyle.GLASS) {

                glassEngine.prepare(
                        g,
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

            Composite normalComposite = g.getComposite();

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
                                g.setColor(new Color(15, 23, 42)); // Deep Slate Black
                                g.fillRect(drawX, drawY, moduleSize, moduleSize);
                            } else {
                                g.setColor(Color.WHITE);
                                g.fillRect(drawX, drawY, moduleSize, moduleSize);
                            }
                        } else if (bitMatrix.get(x, y)) {
                            // DARK MODULE: Crop/draw image tile & apply contrast darkening tint!
                            BufferedImage tile = scaledBg.getSubimage(bgX, bgY, moduleSize, moduleSize);
                            g.drawImage(tile, drawX, drawY, null);

                            if (darkTintAlpha > 0) {
                                g.setColor(new Color(0, 0, 0, darkTintAlpha));
                                g.fillRect(drawX, drawY, moduleSize, moduleSize);
                            }
                        } else {
                            // LIGHT MODULE: Draw solid white square!
                            g.setColor(Color.WHITE);
                            g.fillRect(drawX, drawY, moduleSize, moduleSize);
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
                            g.setColor(blended);
                        }

                        boolean faded = moduleFadeSelector.isFaded(fadedModules, x, y);
                        if (faded) {
                            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, FADE_ALPHA));
                        }

                        if (options.getStyle() == RenderStyle.GLASS) {

                            glassEngine.drawShadow(
                                    g,
                                    drawX,
                                    drawY,
                                    moduleSize
                            );
                        }

                        moduleRenderer.drawModule(
                                g,
                                drawX,
                                drawY,
                                moduleSize,
                                options
                        );

                        if (options.getStyle() == RenderStyle.GLASS) {

                            glassEngine.drawReflection(
                                    g,
                                    drawX,
                                    drawY,
                                    moduleSize
                            );
                        }

                        if (faded) {
                            g.setComposite(normalComposite);
                        }

                        if (preparedArt != null) {
                            painter.prepare(g, options, imageWidth, imageHeight);
                        }
                    }
                }
            }

            if (options.getLogoOptions() != null) {

                safetyEngine.render(g, options.getLogoOptions(), imageWidth, imageHeight);

                LogoRenderer logoRenderer = logoEngine.getRenderer(options.getLogoOptions().getShape());
                logoRenderer.drawLogo(g, options.getLogoOptions(), imageWidth, imageHeight);
            }

            if (options.isDecorativeDotsEnabled()) {
                decorativeDotsRenderer.render(
                        g,
                        matrixWidth,
                        matrixHeight,
                        moduleSize,
                        options.getQuietZone(),
                        options.getAccentColor(),
                        options.getSeed()
                );
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