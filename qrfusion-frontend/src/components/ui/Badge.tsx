import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20 dark:text-secondary',
    secondary: 'bg-secondary/15 text-primary dark:text-secondary border-secondary/30',
    accent: 'bg-accent/20 text-accent-hover dark:text-accent border-accent/40 font-semibold',
    outline: 'bg-transparent text-text-secondary border-border',
    success: 'bg-success/10 text-success border-success/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
