import React, { useState } from 'react';
import { QrConfig } from '../../../types/qr';
import { Button } from '../../../components/ui/Button';
import { Download, Check, AlertCircle } from 'lucide-react';

export interface ExportBarProps {
  config: QrConfig;
  onDownload: () => void;
  isGenerating?: boolean;
}

export function ExportBar({ config, onDownload, isGenerating = false }: ExportBarProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setErrorMessage(null);
      await onDownload();
      setDownloadState('success');
      setTimeout(() => {
        setDownloadState('idle');
      }, 2000);
    } catch (err: any) {
      setDownloadState('error');
      setErrorMessage(err?.message || 'Export failed');
      setTimeout(() => {
        setDownloadState('idle');
      }, 3000);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant={downloadState === 'success' ? 'success' : downloadState === 'error' ? 'danger' : 'primary'}
        size="lg"
        onClick={handleExport}
        isLoading={isGenerating}
        disabled={isGenerating}
        className="w-full shadow-lg"
      >
        {downloadState === 'success' ? (
          <>
            <Check className="h-5 w-5 animate-bounce" />
            Exported {config.format}!
          </>
        ) : downloadState === 'error' ? (
          <>
            <AlertCircle className="h-5 w-5" />
            Export Failed
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Download {config.format} ({config.exportScale})
          </>
        )}
      </Button>

      {errorMessage && (
        <p className="text-xs text-rose-500 text-center font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
