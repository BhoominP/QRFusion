import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:border-secondary transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-xs',
            error && 'border-danger focus-visible:ring-danger/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
