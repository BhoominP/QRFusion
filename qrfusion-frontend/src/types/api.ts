export interface ApiErrorResponse {
  message: string;
  fieldErrors?: Record<string, string>;
  status?: number;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface QrItem {
  id: string;
  name: string;
  content: string;
  format: 'PNG' | 'SVG' | 'PDF' | 'GIF';
  scansCount: number;
  createdAt: string;
  favorite: boolean;
  folder?: string;
  previewUrl?: string;
}

export interface ScanTrendData {
  date: string;
  scans: number;
  uniqueScans: number;
}

export interface FormatBreakdownData {
  format: string;
  count: number;
  percentage: number;
}

export interface DownloadHistoryItem {
  id: string;
  qrName: string;
  format: 'PNG' | 'SVG' | 'PDF' | 'GIF';
  resolution: string;
  downloadedAt: string;
  fileSize: string;
}
