import React from 'react';
import { QrConfig, ExportFormat, ExportScale } from '../../types/qr';
import { ToggleGroup, ToggleOption } from '../ui/ToggleGroup';
import { Label } from '../ui/Label';
import { FileCode, FileText, Image as ImageIcon, Film, Download, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface QrExportPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  onDownload: () => void;
  isGenerating?: boolean;
}

export function QrExportPanel({
  config,
  updateConfig,
  onDownload,
  isGenerating = false,
}: QrExportPanelProps) {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const formatOptions: ToggleOption<ExportFormat>[] = [
    { value: 'PNG', label: 'PNG Image', icon: <ImageIcon className="h-3.5 w-3.5" /> },
    { value: 'SVG', label: 'SVG Vector', icon: <FileCode className="h-3.5 w-3.5" /> },
    { value: 'PDF', label: 'PDF Print', icon: <FileText className="h-3.5 w-3.5" /> },
    { value: 'GIF', label: 'GIF Animated', icon: <Film className="h-3.5 w-3.5" /> },
  ];

  const scaleOptions: ToggleOption<ExportScale>[] = [
    { value: 'X1', label: '1x (Standard)' },
    { value: 'X2', label: '2x (HD)' },
    { value: 'X4', label: '4x (Ultra HD)' },
    { value: 'X8', label: '8x (Print)' },
  ];

  const getFormatHelperText = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'SVG':
        return 'Vector format ideal for crisp web rendering, vinyl cutting, and infinite scaling.';
      case 'PDF':
        return 'Vector PDF document formatted for professional print shop output.';
      case 'GIF':
        return 'Animated export renders a short looping frame sequence generated live by Spring Boot.';
      case 'PNG':
      default:
        return 'High-resolution raster PNG graphics format with transparent background support.';
    }
  };

  const handleExportClick = () => {
    onDownload();
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* File Format Selection */}
      <div className="space-y-2">
        <Label>Output File Format</Label>
        <ToggleGroup
          layoutId="export-format-active"
          options={formatOptions}
          value={config.format}
          onChange={(val) => updateConfig({ format: val })}
        />
        <p className="text-xs text-text-secondary bg-surface/40 p-2.5 rounded-lg border border-border/50">
          {getFormatHelperText(config.format)}
        </p>
      </div>

      {/* Export Scale Multiplier */}
      <div className="space-y-2">
        <Label>Resolution Scale Multiplier</Label>
        <ToggleGroup
          layoutId="export-scale-active"
          options={scaleOptions}
          value={config.exportScale}
          onChange={(val) => updateConfig({ exportScale: val })}
        />
      </div>

      {/* Direct Download Trigger */}
      <div className="pt-2">
        <Button
          variant={downloadSuccess ? 'success' : 'primary'}
          size="lg"
          onClick={handleExportClick}
          isLoading={isGenerating}
          disabled={isGenerating}
          className="w-full shadow-lg"
        >
          {downloadSuccess ? (
            <>
              <Check className="h-5 w-5 animate-bounce" />
              Exported {config.format}!
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Download {config.format} ({config.exportScale})
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
