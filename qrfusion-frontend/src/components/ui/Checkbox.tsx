import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, onChange, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text select-none">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              id={inputId}
              checked={checked}
              onChange={onChange}
              ref={ref}
              className="peer sr-only"
              {...props}
            />
            <div className={cn(
              "w-4 h-4 rounded-md border border-border bg-surface transition-all flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/50",
              checked && "bg-primary border-primary text-white dark:bg-secondary dark:border-secondary dark:text-slate-950",
              error && "border-danger",
              className
            )}>
              {checked && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
          </div>
          {label && <span>{label}</span>}
        </label>
        {error && <p className="text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
