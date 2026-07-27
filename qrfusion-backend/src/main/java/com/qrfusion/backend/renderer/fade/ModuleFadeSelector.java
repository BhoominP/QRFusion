package com.qrfusion.backend.renderer.fade;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Picks which data modules are safe to render at reduced opacity for the
 * "hidden modules" effect. Only ever selects pure data/error-correction
 * codewords - finder patterns, separators, timing patterns, and format
 * info are always excluded - so the effect spends error-correction
 * budget on purpose instead of fighting the symbol's structure.
 */
@Component
public class ModuleFadeSelector {

    public Set<Long> select(int matrixWidth, int matrixHeight, double ratio, String seed) {

        Set<Long> faded = new HashSet<>();

        if (ratio <= 0) {
            return faded;
        }

        Random random = new Random(seed == null ? 0 : seed.hashCode());

        for (int y = 0; y < matrixHeight; y++) {
            for (int x = 0; x < matrixWidth; x++) {
                if (isEligible(x, y, matrixWidth, matrixHeight) && random.nextDouble() < ratio) {
                    faded.add(key(x, y));
                }
            }
        }

        return faded;
    }

    public boolean isFaded(Set<Long> faded, int x, int y) {
        return faded.contains(key(x, y));
    }

    private long key(int x, int y) {
        return ((long) x << 32) | (y & 0xFFFFFFFFL);
    }

    private boolean isEligible(int x, int y, int matrixWidth, int matrixHeight) {

        int zone = 8;

        boolean inFinderZone =
                (x < zone && y < zone)
                        || (x >= matrixWidth - zone && y < zone)
                        || (x < zone && y >= matrixHeight - zone);

        if (inFinderZone) {
            return false;
        }

        if (x == 6 || y == 6) {
            return false; // timing pattern
        }

        boolean formatInfoNearTopLeft = (x == 8 && y < 9) || (y == 8 && x < 9);
        boolean formatInfoNearTopRight = y == 8 && x >= matrixWidth - 8;
        boolean formatInfoNearBottomLeft = x == 8 && y >= matrixHeight - 8;

        return !formatInfoNearTopLeft && !formatInfoNearTopRight && !formatInfoNearBottomLeft;
    }
}