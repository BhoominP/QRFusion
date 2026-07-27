import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 p-1.5 bg-border/40 dark:bg-surface-glass rounded-xl border border-border/50 overflow-x-auto no-scrollbar flex-nowrap relative select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex-1 min-w-[90px] whitespace-nowrap flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer z-10',
              isActive
                ? 'text-primary dark:text-secondary font-bold'
                : 'text-text-secondary hover:text-text hover:bg-surface/30'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-surface dark:bg-slate-800 rounded-lg shadow-xs z-[-1] border border-border/60"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
