import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (val: number) => void;
  label?: string;
  displayValue?: string | number;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  label,
  displayValue,
  className,
  ...props
}) => {
  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || displayValue !== undefined) && (
        <div className="flex justify-between items-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label && <span>{label}</span>}
          {displayValue !== undefined && <span className="text-primary font-mono font-medium">{displayValue}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-secondary/50"
        {...props}
      />
    </div>
  );
};
