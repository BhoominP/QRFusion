import React from 'react';
import { DashboardStat } from '../../../types/api';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { Badge } from '../../../components/ui/Badge';
import { TrendingUp, TrendingDown, Minus, Activity, QrCode, BarChart3, HardDrive } from 'lucide-react';

interface StatCardsProps {
  stats: DashboardStat[];
}

export function StatCards({ stats }: StatCardsProps) {
  const getIconForLabel = (label: string) => {
    switch (label) {
      case 'Total Codes':
        return <QrCode className="h-5 w-5 text-primary dark:text-secondary" strokeWidth={1.5} />;
      case 'Total Scans':
        return <Activity className="h-5 w-5 text-amber-500" strokeWidth={1.5} />;
      case 'Active Campaigns':
        return <BarChart3 className="h-5 w-5 text-emerald-500" strokeWidth={1.5} />;
      case 'Data Transfer':
        return <HardDrive className="h-5 w-5 text-purple-500" strokeWidth={1.5} />;
      default:
        return <Activity className="h-5 w-5 text-primary" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((st) => (
        <GlassPanel key={st.label} className="p-6 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              {st.label}
            </span>
            <div className="p-2 rounded-xl bg-surface/80 border border-border/80 group-hover:scale-110 transition-transform">
              {getIconForLabel(st.label)}
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-extrabold font-heading text-text tracking-tight">{st.value}</span>
            <Badge variant={st.trend === 'up' ? 'success' : st.trend === 'down' ? 'accent' : 'outline'} className="font-semibold">
              {st.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 mr-0.5 inline" strokeWidth={1.5} />}
              {st.trend === 'down' && <TrendingDown className="h-3.5 w-3.5 mr-0.5 inline" strokeWidth={1.5} />}
              {st.trend === 'neutral' && <Minus className="h-3.5 w-3.5 mr-0.5 inline" strokeWidth={1.5} />}
              {st.change}
            </Badge>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
