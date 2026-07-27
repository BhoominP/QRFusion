import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

interface CompassIndicatorProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  spinning?: boolean;
  className?: string;
  activeStep?: number; // 0 to 4 for Content -> Style -> Color -> Logo -> Frame -> Export
}

export function CompassIndicator({
  size = 'md',
  spinning = true,
  className = '',
  activeStep,
}: CompassIndicatorProps) {
  const reducedMotion = usePrefersReducedMotion();

  const getPixelSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm': return 24;
      case 'md': return 40;
      case 'lg': return 64;
      case 'xl': return 96;
    }
  };

  const px = getPixelSize();

  // Angle based on active step (0° = N, 60° = NE, 120° = SE, etc.)
  const targetAngle = activeStep !== undefined ? activeStep * 60 : 45;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: px, height: px }}
      aria-label="Compass Loading Indicator"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-border dark:text-border opacity-60"
        />

        {/* Inner Track */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="text-primary/30"
        />

        {/* 4 Directional Cardinal Ticks (N, E, S, W) */}
        {/* North */}
        <line x1="50" y1="8" x2="50" y2="14" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
        {/* East */}
        <line x1="92" y1="50" x2="86" y2="50" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary" />
        {/* South */}
        <line x1="50" y1="92" x2="50" y2="86" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary" />
        {/* West */}
        <line x1="8" y1="50" x2="14" y2="50" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary" />

        {/* Center Pivot Point */}
        <circle cx="50" cy="50" r="4" fill="currentColor" className="text-primary" />

        {/* Hunting Needle Group */}
        <motion.g
          style={{ transformOrigin: '50px 50px' }}
          animate={
            reducedMotion
              ? { rotate: targetAngle }
              : spinning
              ? {
                  rotate: [
                    targetAngle,
                    targetAngle + 90,
                    targetAngle + 70,
                    targetAngle + 210,
                    targetAngle + 180,
                    targetAngle + 330,
                    targetAngle + 360,
                  ],
                }
              : { rotate: targetAngle }
          }
          transition={
            reducedMotion || !spinning
              ? { duration: 0.3 }
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.45, 0.05, 0.55, 0.95], // Realistic "hunting" easing
                }
          }
        >
          {/* North Pointer (Gold accent #F8B444) */}
          <polygon points="50,18 44,50 56,50" fill="#F8B444" />
          
          {/* South Pointer (Primary Blue #035081) */}
          <polygon points="50,82 44,50 56,50" fill="#035081" />
        </motion.g>
      </svg>
    </div>
  );
}
