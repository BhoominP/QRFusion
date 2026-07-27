import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ToggleOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface ToggleGroupProps<T extends string = string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  className?: string;
}

export function ToggleGroup<T extends string = string>({
  options,
  value,
  onChange,
  layoutId = 'toggle-group-active',
  className,
}: ToggleGroupProps<T>) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1.5 bg-border/40 dark:bg-surface-glass rounded-xl border border-border/50 relative overflow-x-auto no-scrollbar',
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex-1 min-w-[70px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors select-none cursor-pointer z-10',
              isActive
                ? 'text-primary dark:text-secondary font-bold'
                : 'text-text-secondary hover:text-text hover:bg-surface/30'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-surface dark:bg-slate-800 rounded-lg shadow-sm z-[-1] border border-border/60"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
