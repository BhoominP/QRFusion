import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../../hooks/useTheme';
import needleA from '../../../assets/QrArt/qrfusion-illustration-compass-needle-A.png';
import needleB from '../../../assets/QrArt/qrfusion-illustration-compass-needle-B.png';

interface CompassNeedleIllustrationProps {
  className?: string;
  size?: number | string;
  spinning?: boolean;
}

export function CompassNeedleIllustration({
  className = '',
  size = 320,
  spinning = true,
}: CompassNeedleIllustrationProps) {
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  // Light mode: needleA (navy + gold), Dark mode: needleB (sky blue + bright gold)
  const imageSrc = resolvedTheme === 'dark' ? needleB : needleA;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer Ambient Neon Backlight Radial Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 blur-2xl animate-pulse pointer-events-none" />

      {/* 360 Rotating Needle Container */}
      <motion.div
        className="relative flex items-center justify-center overflow-visible"
        style={{ width: size, height: size }}
        animate={
          reduceMotion || !spinning
            ? {}
            : { rotate: 360 }
        }
        transition={
          reduceMotion || !spinning
            ? {}
            : {
                rotate: {
                  duration: 14,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }
        }
      >
        {/* Main Needle Image */}
        <img
          src={imageSrc}
          alt="QRFusion Compass Needle"
          className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
        />

        {/* 1. Specular Glare / Shiny Reflection Light Beam Pass */}
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full overflow-hidden mix-blend-screen"
            style={{
              background:
                'linear-gradient(125deg, transparent 35%, rgba(255, 255, 255, 0.75) 48%, rgba(247, 197, 94, 0.95) 52%, transparent 65%)',
              backgroundSize: '250% 250%',
            }}
            animate={{
              backgroundPositionX: ['-150%', '250%'],
              backgroundPositionY: ['-150%', '250%'],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 2. Sparkle Starburst Light Flashes */}
        {!reduceMotion && (
          <>
            {/* Pointer Tip Glaze Flare */}
            <motion.div
              className="absolute top-[18%] left-[18%] w-6 h-6 rounded-full bg-white shadow-[0_0_20px_#ffffff,0_0_35px_#4fa3ff] pointer-events-none"
              animate={{ scale: [0.5, 1.4, 0.5], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Gold Grid Tail Sparkle Flare */}
            <motion.div
              className="absolute bottom-[22%] right-[22%] w-5 h-5 rounded-full bg-accent shadow-[0_0_18px_#f8b444,0_0_30px_#f8b444] pointer-events-none"
              animate={{ scale: [0.4, 1.3, 0.4], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
