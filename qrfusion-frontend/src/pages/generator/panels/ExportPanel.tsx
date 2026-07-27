import { QrConfig, ExportFormat, ExportScale } from '../../../types/qr';
import { Label } from '../../../components/ui/Label';
import { Button } from '../../../components/ui/Button';
import { Download, FileCode, Image, FileText, Film } from 'lucide-react';

interface ExportPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export function ExportPanel({
  config,
  updateConfig,
  onDownload,
  isGenerating,
}: ExportPanelProps) {
  const formats: { id: ExportFormat; label: string; desc: string; icon: any }[] = [
    { id: 'PNG', label: 'PNG Image', desc: 'Standard raster web image', icon: Image },
    { id: 'SVG', label: 'SVG Vector', desc: 'Scalable graphic markup', icon: FileCode },
    { id: 'PDF', label: 'PDF Document', desc: 'Vector document for print', icon: FileText },
    { id: 'GIF', label: 'Animated GIF', desc: 'Multi-frame motion graphic', icon: Film },
  ];

  const scales: { id: ExportScale; label: string }[] = [
    { id: 'X1', label: '1x (Standard)' },
    { id: 'X2', label: '2x (HD)' },
    { id: 'X4', label: '4x (Ultra HD)' },
    { id: 'X8', label: '8x (Print 300DPI)' },
  ];

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div>
        <Label>Output File Format (ExportFormat)</Label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {formats.map((f) => {
            const Icon = f.icon;
            const isSelected = config.format === f.id;
            return (
              <button
                type="button"
                key={f.id}
                onClick={() => updateConfig({ format: f.id })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                    : 'border-border bg-surface text-text hover:bg-bg'
                }`}
              >
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${isSelected ? 'text-primary dark:text-secondary' : 'text-text-secondary'}`} strokeWidth={1.5} />
                <div>
                  <div className="text-xs font-semibold">{f.label}</div>
                  <div className="text-[10px] text-text-secondary font-normal">{f.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution Scale Multiplier (for raster outputs) */}
      <div>
        <Label>Export Scale Multiplier (ExportScale)</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {scales.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => updateConfig({ exportScale: s.id })}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                config.exportScale === s.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Big Download Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="primary"
          size="lg"
          onClick={onDownload}
          isLoading={isGenerating}
          className="w-full shadow-lg shadow-primary/25"
        >
          <Download className="h-5 w-5" strokeWidth={1.5} />
          Download {config.format} File ({config.exportScale})
        </Button>
      </div>
    </div>
  );
}
