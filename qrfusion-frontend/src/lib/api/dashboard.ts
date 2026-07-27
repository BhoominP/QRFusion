import { apiFetch } from './client';
import {
  DashboardStat,
  QrItem,
  ScanTrendData,
  FormatBreakdownData,
  DownloadHistoryItem,
} from '../../types/api';

export type Timeframe = '7d' | '30d' | '90d' | 'all';
export type FolderFilter = string;

export interface FolderItem {
  id: number;
  userId: number;
  name: string;
  color?: string;
  createdAt: string;
}

export async function getSavedCodes(params?: { favoriteOnly?: boolean; folderId?: number }): Promise<QrItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.favoriteOnly) {
    queryParams.append('favorite', 'true');
  }
  if (params?.folderId) {
    queryParams.append('folderId', params.folderId.toString());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await apiFetch(`/api/v1/qr/saved${queryString}`);
  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id.toString(),
    name: item.name,
    content: item.content,
    redirectUrl: item.redirectUrl,
    format: item.format,
    scansCount: item.scansCount || 0,
    createdAt: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    favorite: item.favorite ?? false,
    folder: item.folderId ? `Folder #${item.folderId}` : 'General',
    renderOptions: item.renderOptions,
  }));
}

export async function saveQrCode(payload: {
  name: string;
  content: string;
  renderOptions?: string;
  format: string;
  isFavorite?: boolean;
  folderId?: number;
}): Promise<QrItem | null> {
  const token = localStorage.getItem('qrfusion_token');
  if (!token) return null;

  try {
    const response = await apiFetch('/api/v1/qr/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const item = await response.json();
    window.dispatchEvent(new CustomEvent('qrfusion_activity_updated'));
    return {
      id: item.id.toString(),
      name: item.name,
      content: item.content,
      redirectUrl: item.redirectUrl,
      format: item.format,
      scansCount: item.scansCount || 0,
      createdAt: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      favorite: item.favorite ?? false,
      folder: item.folderId ? `Folder #${item.folderId}` : 'General',
      renderOptions: item.renderOptions,
    };
  } catch (err) {
    console.warn('Failed to save QR code:', err);
    return null;
  }
}

export async function getFolders(): Promise<FolderItem[]> {
  const response = await apiFetch('/api/v1/folders');
  return response.json();
}

export async function createFolder(name: string, color: string = '#0F4C81'): Promise<FolderItem> {
  const response = await apiFetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  window.dispatchEvent(new CustomEvent('qrfusion_activity_updated'));
  return response.json();
}

export async function getAnalyticsSummary(): Promise<{
  stats: DashboardStat[];
  scanTrends: ScanTrendData[];
  formatBreakdown: FormatBreakdownData[];
}> {
  const response = await apiFetch('/api/v1/analytics/summary');
  const data = await response.json();

  const stats: DashboardStat[] = [
    {
      label: 'Total Codes',
      value: (data.totalCodes || 0).toLocaleString(),
      change: '+100%',
      trend: 'up',
    },
    {
      label: 'Total Scans',
      value: (data.totalScans || 0).toLocaleString(),
      change: '+100%',
      trend: 'up',
    },
    {
      label: 'Active Campaigns',
      value: (data.activeCampaigns || 0).toString(),
      change: '+0',
      trend: 'neutral',
    },
    {
      label: 'Data Transfer',
      value: `${((data.totalScans || 0) * 0.05).toFixed(1)} MB`,
      change: '+0%',
      trend: 'neutral',
    },
  ];

  const scanTrends: ScanTrendData[] = (data.scanTrends || []).map((t: any) => ({
    date: t.date,
    scans: t.scans,
    uniqueScans: t.uniqueScans,
  }));

  const formatBreakdown: FormatBreakdownData[] = (data.formatBreakdown || []).map((f: any) => ({
    format: f.format,
    count: f.count,
    percentage: f.percentage,
  }));

  return { stats, scanTrends, formatBreakdown };
}

export async function getDownloads(): Promise<DownloadHistoryItem[]> {
  const response = await apiFetch('/api/v1/downloads');
  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id.toString(),
    qrName: item.qrName || 'Custom QR Code',
    format: item.format,
    resolution: item.resolution || 'Standard',
    downloadedAt: item.downloadedAt ? item.downloadedAt.replace('T', ' ').substring(0, 16) : 'Just now',
    fileSize: item.fileSize || '1.2 MB',
  }));
}

export async function recordDownload(payload: {
  savedQrCodeId?: number;
  qrName?: string;
  format?: string;
  resolution?: string;
  fileSize?: string;
}): Promise<void> {
  const token = localStorage.getItem('qrfusion_token');
  if (!token) return;

  try {
    await apiFetch('/api/v1/downloads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    window.dispatchEvent(new CustomEvent('qrfusion_activity_updated'));
  } catch (err) {
    console.warn('Failed to record download activity:', err);
  }
}

export async function downloadQrItem(qr: {
  id?: string | number;
  name: string;
  content: string;
  format: string;
  renderOptions?: string;
}): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const format = (qr.format || 'PNG').toUpperCase();
  const text = qr.content || 'https://qrfusion.io';

  let renderUrl = `${baseUrl}/api/v1/qr/render?text=${encodeURIComponent(text)}&format=${format}&size=600`;

  if (qr.renderOptions) {
    try {
      const opts = JSON.parse(qr.renderOptions);
      if (opts.darkColor) renderUrl += `&darkColor=${encodeURIComponent(opts.darkColor)}`;
      if (opts.lightColor) renderUrl += `&lightColor=${encodeURIComponent(opts.lightColor)}`;
      if (opts.colorMode) renderUrl += `&colorMode=${encodeURIComponent(opts.colorMode)}`;
      if (opts.startColor) renderUrl += `&startColor=${encodeURIComponent(opts.startColor)}`;
      if (opts.endColor) renderUrl += `&endColor=${encodeURIComponent(opts.endColor)}`;
      if (opts.moduleShape) renderUrl += `&moduleShape=${encodeURIComponent(opts.moduleShape)}`;
      if (opts.eyeFrameShape) renderUrl += `&eyeFrameShape=${encodeURIComponent(opts.eyeFrameShape)}`;
      if (opts.eyeBallShape) renderUrl += `&eyeBallShape=${encodeURIComponent(opts.eyeBallShape)}`;
    } catch (e) {
      console.warn('Failed to parse renderOptions for download:', e);
    }
  }

  const res = await fetch(renderUrl);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = blobUrl;
  const sanitizedName = qr.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  a.download = `${sanitizedName || 'qrfusion-code'}.${format.toLowerCase()}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);

  // Record download log event
  await recordDownload({
    savedQrCodeId: qr.id ? Number(qr.id) : undefined,
    qrName: qr.name,
    format: format,
    resolution: '600x600',
    fileSize: `${(blob.size / 1024).toFixed(1)} KB`,
  });
}

export async function renameSavedCode(id: string | number, name: string): Promise<QrItem> {
  const response = await apiFetch(`/api/v1/qr/saved/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const item = await response.json();
  window.dispatchEvent(new CustomEvent('qrfusion_activity_updated'));
  return {
    id: item.id.toString(),
    name: item.name,
    content: item.content,
    redirectUrl: item.redirectUrl,
    format: item.format,
    scansCount: item.scansCount || 0,
    createdAt: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    favorite: item.favorite ?? false,
    folder: item.folderId ? `Folder #${item.folderId}` : 'General',
    renderOptions: item.renderOptions,
  };
}

export async function toggleFavorite(id: string | number, favorite: boolean): Promise<void> {
  await apiFetch(`/api/v1/qr/saved/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorite, isFavorite: favorite }),
  });
  window.dispatchEvent(new CustomEvent('qrfusion_activity_updated'));
}

export async function deleteSavedCode(id: string | number): Promise<void> {
  await apiFetch(`/api/v1/qr/saved/${id}`, {
    method: 'DELETE',
  });
  window.dispatchEvent(new CustomEvent('qrfusion_activity_updated'));
}

// Backward compatibility alias exports
export async function getDashboardStats(): Promise<DashboardStat[]> {
  const summary = await getAnalyticsSummary();
  return summary.stats;
}

export async function getRecentQrs(): Promise<QrItem[]> {
  return getSavedCodes();
}

export async function getScanTrends(): Promise<ScanTrendData[]> {
  const summary = await getAnalyticsSummary();
  return summary.scanTrends;
}

export async function getFormatBreakdown(): Promise<FormatBreakdownData[]> {
  const summary = await getAnalyticsSummary();
  return summary.formatBreakdown;
}

export async function getDownloadHistory(): Promise<DownloadHistoryItem[]> {
  return getDownloads();
}
