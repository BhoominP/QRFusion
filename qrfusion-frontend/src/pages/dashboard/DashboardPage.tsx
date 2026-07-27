import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { StatCards } from './sections/StatCards';
import { QrGrid } from './sections/QrGrid';
import { AnalyticsCharts } from './sections/AnalyticsCharts';
import { DownloadsTable } from './sections/DownloadsTable';
import { Logo } from '../../components/brand/Logo';
import {
  getSavedCodes,
  getAnalyticsSummary,
  getDownloads,
  toggleFavorite,
  deleteSavedCode,
  Timeframe,
  FolderFilter,
} from '../../lib/api/dashboard';
import {
  DashboardStat,
  QrItem,
  ScanTrendData,
  FormatBreakdownData,
  DownloadHistoryItem,
} from '../../types/api';
import { Button } from '../../components/ui/Button';
import { RefreshCw, Calendar, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [selectedFolder, setSelectedFolder] = useState<FolderFilter>('all');

  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentQrs, setRecentQrs] = useState<QrItem[]>([]);
  const [scanTrends, setScanTrends] = useState<ScanTrendData[]>([]);
  const [formatBreakdown, setFormatBreakdown] = useState<FormatBreakdownData[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic real data loader
  const loadDashboardData = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else if (recentQrs.length === 0) setIsLoading(true);
    setErrorMsg(null);

    try {
      const [codes, analytics, downloads] = await Promise.all([
        getSavedCodes(),
        getAnalyticsSummary(),
        getDownloads(),
      ]);

      setRecentQrs(codes);
      setStats(analytics.stats);
      setScanTrends(analytics.scanTrends);
      setFormatBreakdown(analytics.formatBreakdown);
      setDownloadHistory(downloads);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Listen for real-time user activity updates (downloads, code saves, folder creation, favorites)
    const handleActivityUpdate = () => {
      loadDashboardData(false);
    };

    window.addEventListener('qrfusion_activity_updated', handleActivityUpdate);
    return () => window.removeEventListener('qrfusion_activity_updated', handleActivityUpdate);
  }, []);

  // Optimistic Toggle Favorite Action
  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    // Optimistic UI update
    setRecentQrs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !currentFav } : item))
    );

    try {
      await toggleFavorite(id, !currentFav);
    } catch (err) {
      // Rollback on failure
      setRecentQrs((prev) =>
        prev.map((item) => (item.id === id ? { ...item, favorite: currentFav } : item))
      );
    }
  };

  // Optimistic Delete Action
  const handleDeleteCode = async (id: string) => {
    const backup = [...recentQrs];
    setRecentQrs((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteSavedCode(id);
    } catch (err) {
      // Rollback on failure
      setRecentQrs(backup);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-10">
        
        {/* Header Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-border/80">
          <div className="flex items-start gap-4">
            <Logo variant="compact" badgeOnDark={false} className="h-10 w-10 shrink-0 mt-1" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  ANALYTICS & CONTROL CENTER
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Activity Auto-Sync
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text tracking-tight">
                Overview Dashboard
              </h1>
              <p className="text-sm text-text-secondary">
                Real-time campaign analytics, user-scoped QR assets, scan trends, and download logs.
              </p>
            </div>
          </div>

          {/* Interactive Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface/80 p-1 rounded-xl border border-border">
              <Calendar className="h-4 w-4 ml-2 text-text-secondary pointer-events-none" />
              {(['7d', '30d', '90d', 'all'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : 'All'}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              title="Refresh Live Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </Button>

            <Link to="/generator">
              <Button variant="primary" size="md" className="shadow-md shadow-primary/25">
                <Plus className="h-4 w-4" strokeWidth={2} />
                <span>Create QR Code</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Banner State */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => loadDashboardData(true)}>
              Retry
            </Button>
          </div>
        )}

        {/* Skeleton Pulse Loading State */}
        {isLoading ? (
          <div className="space-y-10 animate-pulse">
            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-surface/60 border border-border/80 p-5 space-y-3">
                  <div className="h-4 w-24 bg-border/60 rounded-md" />
                  <div className="h-7 w-32 bg-border/80 rounded-md" />
                </div>
              ))}
            </div>

            {/* QR Grid Skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-48 bg-border/60 rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-surface/60 border border-border/80 p-5 space-y-4">
                    <div className="h-5 w-3/4 bg-border/80 rounded-md" />
                    <div className="h-32 bg-border/40 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stat Metric Cards */}
            <StatCards stats={stats} />

            {/* Recent QR Codes Grid */}
            <QrGrid
              items={recentQrs}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteCode}
            />

            {/* Analytics Charts */}
            <AnalyticsCharts scanTrends={scanTrends} formatBreakdown={formatBreakdown} />

            {/* Download Logs Table */}
            <DownloadsTable history={downloadHistory} />
          </div>
        )}

      </div>
    </PageContainer>
  );
}
