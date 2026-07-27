import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px] active:shadow-inner select-none cursor-pointer';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-md shadow-primary/20',
      secondary:
        'bg-secondary/15 text-primary dark:text-secondary hover:bg-secondary/25 active:bg-secondary/30 font-semibold',
      outline:
        'border border-border bg-surface text-text hover:bg-bg active:bg-border/40 shadow-xs',
      ghost:
        'text-text-secondary hover:text-text hover:bg-border/30 active:bg-border/50',
      danger:
        'bg-danger text-white hover:bg-danger/90 active:bg-danger/80 shadow-xs',
      glass:
        'bg-surface-glass backdrop-blur-md border border-border/80 text-text hover:bg-surface active:bg-surface/80 shadow-md',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5 rounded-2xl',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current stroke-2 border-t-transparent rounded-full animate-spin mr-1" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
