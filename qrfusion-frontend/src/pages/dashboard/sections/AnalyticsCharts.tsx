import React from 'react';
import { ScanTrendData, FormatBreakdownData } from '../../../types/api';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

interface AnalyticsChartsProps {
  scanTrends: ScanTrendData[];
  formatBreakdown: FormatBreakdownData[];
}

const COLORS = ['#035081', '#4FA3FF', '#F8B444', '#10B981'];

export function AnalyticsCharts({ scanTrends, formatBreakdown }: AnalyticsChartsProps) {
  const hasTrends = scanTrends && scanTrends.some((t) => t.scans > 0);
  const hasFormatData = formatBreakdown && formatBreakdown.length > 0;

  return (
    <div id="analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Bar Chart: Scans Over Time */}
      <GlassPanel className="lg:col-span-8 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-text tracking-tight">Scans Over Time</h3>
            <p className="text-xs text-text-secondary">Compare total scan volume vs unique device engagements.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-3 h-3 rounded-xs bg-[#035081] inline-block" /> Total Scans
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-3 h-3 rounded-xs bg-[#4FA3FF] inline-block" /> Unique Scans
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2 flex items-center justify-center">
          {hasTrends ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--color-text)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <Bar dataKey="scans" fill="#035081" radius={[4, 4, 0, 0]} name="Total Scans" />
                <Bar dataKey="uniqueScans" fill="#4FA3FF" radius={[4, 4, 0, 0]} name="Unique Scans" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-text-secondary space-y-2 py-8">
              <BarChart3 className="h-10 w-10 mx-auto text-text-secondary/30" />
              <p className="text-xs font-medium">No scan activity recorded yet.</p>
              <p className="text-[11px] text-text-secondary/70">Scans on your active QR codes will appear here in real-time.</p>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Donut Chart: Export Format Breakdown */}
      <GlassPanel className="lg:col-span-4 p-6 space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold font-heading text-text tracking-tight">Format Breakdown</h3>
          <p className="text-xs text-text-secondary">Distribution of exported vector & raster formats.</p>
        </div>

        <div className="h-48 w-full relative flex items-center justify-center">
          {hasFormatData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatBreakdown}
                  dataKey="count"
                  nameKey="format"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {formatBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--color-text)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-text-secondary space-y-2 py-4">
              <PieIcon className="h-10 w-10 mx-auto text-text-secondary/30" />
              <p className="text-xs font-medium">No format statistics yet.</p>
            </div>
          )}
        </div>

        {/* Legend List */}
        {hasFormatData ? (
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border/60">
            {formatBreakdown.map((item, idx) => (
              <div key={item.format} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-text-secondary font-medium">{item.format}</span>
                <span className="text-text font-bold ml-auto">{item.percentage}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-3 border-t border-border/60 text-center text-[11px] text-text-secondary">
            Format logs appear when QR codes are saved.
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
