import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SpotlightNavItemProps {
  to?: string;
  href?: string;
  icon?: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SpotlightNavItem({
  to,
  href,
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className = '',
}: SpotlightNavItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showSpotlight = isActive || isHovered;

  const content = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-300 select-none cursor-pointer group ${
        showSpotlight
          ? 'text-primary dark:text-secondary font-semibold'
          : 'text-text-secondary hover:text-text'
      } ${className}`}
    >
      {/* Top glowing bar capsule indicator */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ease-out ${
          showSpotlight
            ? 'w-8 bg-primary dark:bg-secondary shadow-[0_0_12px_rgba(79,163,255,0.9)] opacity-100'
            : 'w-0 bg-transparent opacity-0'
        }`}
      />

      {/* Spotlight Cone Light Beam */}
      <div
        className={`absolute top-[3px] left-1/2 -translate-x-1/2 w-16 h-11 pointer-events-none transition-all duration-300 ease-out ${
          showSpotlight ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        style={{
          clipPath: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)',
          background:
            'linear-gradient(180deg, rgba(79, 163, 255, 0.38) 0%, rgba(79, 163, 255, 0.1) 60%, rgba(79, 163, 255, 0) 100%)',
        }}
      />

      {/* Icon with glow effect */}
      {Icon && (
        <Icon
          className={`h-4 w-4 transition-all duration-300 relative z-10 ${
            showSpotlight
              ? 'text-primary dark:text-secondary drop-shadow-[0_0_8px_rgba(79,163,255,0.8)] scale-110'
              : 'text-text-secondary group-hover:text-text'
          }`}
          strokeWidth={showSpotlight ? 2 : 1.5}
        />
      )}

      {/* Label */}
      <span
        className={`relative z-10 transition-all duration-300 ${
          showSpotlight ? 'drop-shadow-[0_0_6px_rgba(79,163,255,0.5)]' : ''
        }`}
      >
        {label}
      </span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
