import React from 'react';
import { cn } from '../../lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassPanel({
  children,
  className = '',
  glow = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border/80 bg-surface-glass backdrop-blur-md shadow-xl transition-all duration-200',
        glow && 'before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-b before:from-secondary/20 before:to-transparent before:-z-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
