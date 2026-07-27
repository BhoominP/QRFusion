import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200',
        hoverEffect && 'hover:-translate-y-0.5 hover:shadow-md hover:border-border/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
