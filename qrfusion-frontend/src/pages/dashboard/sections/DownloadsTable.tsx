import React, { useState } from 'react';
import { DownloadHistoryItem } from '../../../types/api';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { downloadQrItem } from '../../../lib/api/dashboard';
import { DownloadCloud, FileText, Check, Search } from 'lucide-react';

interface DownloadsTableProps {
  history: DownloadHistoryItem[];
}

export function DownloadsTable({ history: initialHistory }: DownloadsTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleRedownload = async (item: DownloadHistoryItem) => {
    setDownloadingId(item.id);
    try {
      await downloadQrItem({
        id: item.id,
        name: item.qrName,
        content: 'https://qrfusion.io',
        format: item.format,
      });
      setDownloadedId(item.id);
      setTimeout(() => setDownloadedId(null), 2500);
    } catch (err) {
      console.warn('Failed to re-download QR item from history:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredHistory = initialHistory.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.qrName.toLowerCase().includes(q) ||
      item.format.toLowerCase().includes(q) ||
      item.resolution.toLowerCase().includes(q)
    );
  });

  return (
    <GlassPanel id="downloads" className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-heading text-text tracking-tight">Recent Download Logs</h3>
          <p className="text-xs text-text-secondary mt-0.5">Export history, resolution scales, and file sizes.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search downloads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder:text-text-secondary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/80 text-xs font-bold uppercase tracking-wider text-text-secondary">
              <th className="pb-3 px-3">QR Name</th>
              <th className="pb-3 px-3">Format</th>
              <th className="pb-3 px-3">Resolution Scale</th>
              <th className="pb-3 px-3">File Size</th>
              <th className="pb-3 px-3">Date & Time</th>
              <th className="pb-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-text-secondary">
                  {initialHistory.length === 0
                    ? 'No download history yet. Exported QR codes will be logged here automatically.'
                    : `No download history matching "${search}"`}
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-bg/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-text flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                    {item.qrName}
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {item.format}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-text-secondary font-mono">
                    {item.resolution}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-text-secondary font-mono">
                    {item.fileSize}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-text-secondary">
                    {item.downloadedAt}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Button
                      variant={downloadedId === item.id ? 'success' : 'outline'}
                      size="sm"
                      onClick={() => handleRedownload(item)}
                      disabled={downloadingId === item.id}
                      className="h-8 px-3 text-xs"
                    >
                      {downloadingId === item.id ? (
                        <span>Downloading...</span>
                      ) : downloadedId === item.id ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Downloaded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <DownloadCloud className="h-3.5 w-3.5" strokeWidth={1.5} /> Re-download
                        </span>
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
