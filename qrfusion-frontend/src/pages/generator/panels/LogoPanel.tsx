import React, { useRef } from 'react';
import { QrConfig, LogoShape } from '../../../types/qr';
import { Label } from '../../../components/ui/Label';
import { Switch } from '../../../components/ui/Switch';
import { Slider } from '../../../components/ui/Slider';
import { Button } from '../../../components/ui/Button';
import { Upload, Image as ImageIcon, X, ShieldCheck } from 'lucide-react';

interface LogoPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
}

export function LogoPanel({
  config,
  updateConfig,
  logoFile,
  setLogoFile,
}: LogoPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const shapes: { id: LogoShape; label: string }[] = [
    { id: 'NONE', label: 'No Logo' },
    { id: 'SQUARE', label: 'Square' },
    { id: 'ROUNDED', label: 'Rounded' },
    { id: 'CIRCLE', label: 'Circle' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      if (config.logoShape === 'NONE') {
        updateConfig({ logoShape: 'ROUNDED' });
      }
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    updateConfig({ logoShape: 'NONE' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* File Upload Drag & Drop Area */}
      <div>
        <Label>Upload Brand Logo Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {!logoFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition-all bg-surface/50 hover:bg-surface group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-secondary/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <Upload className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-text">Click or Drag & Drop Brand Logo</p>
            <p className="text-xs text-text-secondary mt-1">PNG, SVG, JPG or WEBP up to 5MB</p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-surface shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Uploaded logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-text truncate max-w-[180px]">
                  {logoFile.name}
                </p>
                <p className="text-[10px] text-text-secondary">
                  {(logoFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeLogo} title="Remove logo">
              <X className="h-4 w-4 text-danger" strokeWidth={1.5} />
            </Button>
          </div>
        )}
      </div>

      {/* Logo Mask Shape */}
      <div>
        <Label>Logo Mask Shape (LogoShape)</Label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {shapes.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => updateConfig({ logoShape: s.id })}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                config.logoShape === s.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls when Logo is active */}
      {config.logoShape !== 'NONE' && (
        <div className="p-4 rounded-xl border border-border/80 bg-bg/50 space-y-5">
          <Slider
            label="Logo Size Ratio"
            min={0.1}
            max={0.35}
            step={0.01}
            value={config.logoSizeRatio}
            displayValue={`${Math.round(config.logoSizeRatio * 100)}%`}
            onValueChange={(val) => updateConfig({ logoSizeRatio: val })}
          />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-success" strokeWidth={1.5} /> ECC Safety Zone
              </span>
              <p className="text-[11px] text-text-secondary">
                Draws clean white safety background behind logo
              </p>
            </div>
            <Switch
              checked={config.safetyZone}
              onCheckedChange={(val) => updateConfig({ safetyZone: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-text">Transparent Logo Plate</span>
              <p className="text-[11px] text-text-secondary">
                Removes white fill plate for transparent logos
              </p>
            </div>
            <Switch
              checked={config.transparentLogoBackground}
              onCheckedChange={(val) => updateConfig({ transparentLogoBackground: val })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
