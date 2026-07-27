import React from 'react';
import { QrConfig, LogoShape, LogoPosition } from '../../types/qr';
import { ToggleGroup, ToggleOption } from '../ui/ToggleGroup';
import { Label } from '../ui/Label';
import { Slider } from '../ui/Slider';
import { Switch } from '../ui/Switch';
import { Upload, Trash2, Square, Circle, Ban, MoveHorizontal, Palette, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';

export interface QrLogoUploaderProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
}

export function QrLogoUploader({
  config,
  updateConfig,
  logoFile,
  setLogoFile,
}: QrLogoUploaderProps) {
  const logoShapeOptions: ToggleOption<LogoShape>[] = [
    { value: 'NONE', label: 'None', icon: <Ban className="h-3.5 w-3.5" /> },
    { value: 'SQUARE', label: 'Square', icon: <Square className="h-3.5 w-3.5" /> },
    { value: 'ROUNDED', label: 'Rounded', icon: <Square className="h-3.5 w-3.5 rounded-sm" /> },
    { value: 'CIRCLE', label: 'Circle', icon: <Circle className="h-3.5 w-3.5" /> },
  ];

  const logoPositionOptions: { value: LogoPosition; label: string; icon: string }[] = [
    { value: 'TOP_LEFT', label: 'Top Left', icon: '↖' },
    { value: 'TOP', label: 'Top Center', icon: '↑' },
    { value: 'TOP_RIGHT', label: 'Top Right', icon: '↗' },
    { value: 'LEFT', label: 'Left Center', icon: '←' },
    { value: 'CENTER', label: 'Center', icon: '●' },
    { value: 'RIGHT', label: 'Right Center', icon: '→' },
    { value: 'BOTTOM_LEFT', label: 'Bottom Left', icon: '↙' },
    { value: 'BOTTOM', label: 'Bottom Center', icon: '↓' },
    { value: 'BOTTOM_RIGHT', label: 'Bottom Right (Pinterest style)', icon: '↘' },
  ];

  const handleShapeChange = (shape: LogoShape) => {
    if (shape === 'NONE') {
      setLogoFile(null);
    }
    updateConfig({ logoShape: shape });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      if (config.logoShape === 'NONE') {
        updateConfig({ logoShape: 'SQUARE' });
      }
    }
  };

  const logoPercent = Math.round((config.logoSizeRatio ?? 0.20) * 100);

  return (
    <div className="space-y-6">
      {/* Logo Shape Toggle */}
      <div className="space-y-2">
        <Label>Logo Container Shape</Label>
        <ToggleGroup
          layoutId="logo-shape-active"
          options={logoShapeOptions}
          value={config.logoShape}
          onChange={handleShapeChange}
        />
      </div>

      {config.logoShape !== 'NONE' && (
        <>
          {/* Custom File Upload Dropzone */}
          <div className="space-y-2">
            <Label>Logo Image File</Label>
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors p-6 text-center relative flex flex-col items-center justify-center bg-surface/40">
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {logoFile ? (
                <div className="space-y-2 z-20 pointer-events-auto">
                  <div className="w-16 h-16 mx-auto rounded-xl border border-border bg-surface shadow-xs flex items-center justify-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt="Logo preview"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <p className="text-xs font-semibold text-text truncate max-w-[200px] mx-auto">
                    {logoFile.name}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    {(logoFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoFile(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium pt-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-text-secondary pointer-events-none">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary dark:text-secondary flex items-center justify-center">
                    <Upload className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-text-secondary">PNG, JPG, WEBP, SVG (Max 10MB)</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Logo Position 3x3 Grid Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <MoveHorizontal className="h-4 w-4 text-primary" />
                Logo Placement Position
              </Label>
              <span className="text-[11px] font-bold text-primary uppercase">
                {config.logoPosition ? config.logoPosition.replace('_', ' ') : 'CENTER'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-surface/50 p-2 rounded-xl border border-border">
              {logoPositionOptions.map((pos) => {
                const isSelected = (config.logoPosition || 'CENTER') === pos.value;
                return (
                  <button
                    key={pos.value}
                    type="button"
                    onClick={() => updateConfig({ logoPosition: pos.value })}
                    title={pos.label}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/15 text-primary shadow-xs font-bold'
                        : 'border-border/60 hover:border-primary/40 bg-surface text-text-secondary hover:text-text'
                    }`}
                  >
                    <span className="text-lg leading-none font-extrabold">{pos.icon}</span>
                    <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                      {pos.value === 'BOTTOM_RIGHT' ? 'Pinterest ↘' : pos.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Border Color & Transparent Ring Controls */}
          <div className="space-y-3 p-3.5 rounded-xl border border-border bg-surface/60">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5 font-bold text-text">
                  <Palette className="h-4 w-4 text-amber-500" />
                  Logo Border Ring
                </Label>
                <p className="text-xs text-text-secondary">
                  {config.logoBorderTransparent ? 'Transparent (No Border)' : 'Solid Color Ring'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-surface rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => updateConfig({ logoBorderTransparent: false })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    !config.logoBorderTransparent ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ logoBorderTransparent: true })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    config.logoBorderTransparent ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  Transparent
                </button>
              </div>
            </div>

            {/* Custom Hex / Swatch Color Picker */}
            {!config.logoBorderTransparent && (
              <div className="space-y-2 pt-1">
                <Label htmlFor="logo-border-color-input">Border Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="logo-border-color-input"
                    type="color"
                    value={config.logoBorderColor || '#FFFFFF'}
                    onChange={(e) => updateConfig({ logoBorderColor: e.target.value })}
                    className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={config.logoBorderColor || '#FFFFFF'}
                    onChange={(e) => updateConfig({ logoBorderColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase"
                  />
                  <div className="flex gap-1.5">
                    {['#FFFFFF', '#000000', '#F59E0B', '#00F2FE', '#EF4444', '#10B981'].map((presetHex) => (
                      <button
                        key={presetHex}
                        type="button"
                        onClick={() => updateConfig({ logoBorderColor: presetHex })}
                        style={{ backgroundColor: presetHex }}
                        className="w-6 h-6 rounded-full border border-border/60 hover:scale-110 transition-transform cursor-pointer"
                        title={presetHex}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logo Size Ratio Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="logo-size-slider">Logo Size Ratio</Label>
              <span className="font-mono text-primary font-bold">
                {logoPercent}%
              </span>
            </div>
            <Slider
              id="logo-size-slider"
              min={10}
              max={35}
              step={1}
              value={logoPercent}
              onValueChange={(val) => updateConfig({ logoSizeRatio: val / 100 })}
            />
          </div>

          {/* Safety Zone Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface/30">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold">White Safety Zone Plate</Label>
              <p className="text-[11px] text-text-secondary">
                Draws a solid background plate behind logo to guarantee QR scan readability.
              </p>
            </div>
            <Switch
              checked={config.safetyZone}
              onCheckedChange={(checked) => updateConfig({ safetyZone: checked })}
            />
          </div>
        </>
      )}
    </div>
  );
}
