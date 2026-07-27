import React from 'react';
import { Link } from 'react-router-dom';
import { QrFusionLogoIcon } from './QrFusionLogoIcon';
import { QrFusionLogoMono } from './QrFusionLogoMono';
import { QrFusionLogoLockup } from './QrFusionLogoLockup';
import { QrFusionLogoCompact } from './QrFusionLogoCompact';

export type LogoVariant = 'icon' | 'icon-mono' | 'lockup' | 'compact';

export interface LogoProps {
  /**
   * Logo variant to render:
   * - 'lockup': Horizontal icon + QRFusion wordmark (Primary for desktop navbar, footer)
   * - 'icon': Full color 3-finder compass icon (Primary icon mark)
   * - 'icon-mono': Single dark-ink monochrome icon (Print, watermarks)
   * - 'compact': QF monogram block + gold grid accent (App icon, mobile, square containers)
   */
  variant?: LogoVariant;
  className?: string;
  /**
   * Optional chip/badge wrapper around logo.
   * Default: false (clean logo without button container)
   */
  badgeOnDark?: boolean;
}

export function Logo({
  variant = 'lockup',
  className = '',
  badgeOnDark = false,
}: LogoProps) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 select-none group transition-opacity hover:opacity-95 ${className}`}
      aria-label="QRFusion Home"
    >
      <div
        className={`transition-transform duration-200 group-hover:scale-105 ${
          badgeOnDark
            ? 'p-1.5 rounded-xl bg-white dark:bg-white/95 dark:shadow-md dark:shadow-black/30 shadow-xs flex items-center justify-center'
            : 'flex items-center justify-center'
        }`}
      >
        {variant === 'icon' && <QrFusionLogoIcon className="h-8 w-8" />}
        {variant === 'icon-mono' && <QrFusionLogoMono className="h-8 w-8" />}
        {variant === 'lockup' && <QrFusionLogoLockup className="h-8 w-auto max-h-8" />}
        {variant === 'compact' && <QrFusionLogoCompact className="h-8 w-8" />}
      </div>
    </Link>
  );
}
