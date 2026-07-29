import React from 'react';
import { QrConfig, RenderStyle, FinderStyle } from '../../types/qr';
import { ToggleGroup, ToggleOption } from '../ui/ToggleGroup';
import { Label } from '../ui/Label';
import { Slider } from '../ui/Slider';
import { Square, Circle, Sparkles, Grid, Camera, Frame } from 'lucide-react';

export interface QrStylePickerProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
}

export function QrStylePicker({ config, updateConfig }: QrStylePickerProps) {
  const moduleShapeOptions: ToggleOption<RenderStyle>[] = [
    { value: 'SQUARE', label: 'Square', icon: <Square className="h-3.5 w-3.5" /> },
    { value: 'ROUNDED', label: 'Rounded', icon: <Square className="h-3.5 w-3.5 rounded-sm" /> },
    { value: 'CIRCLE', label: 'Circle', icon: <Circle className="h-3.5 w-3.5" /> },
    { value: 'HALFTONE', label: 'Halftone', icon: <Grid className="h-3.5 w-3.5" /> },
    { value: 'GLASS', label: 'Glass', icon: <Sparkles className="h-3.5 w-3.5" /> },
  ];

  const finderStyleOptions: ToggleOption<FinderStyle>[] = [
    { value: 'CLASSIC', label: 'Classic', icon: <Square className="h-3.5 w-3.5" /> },
    { value: 'ROUNDED', label: 'Rounded', icon: <Square className="h-3.5 w-3.5 rounded-sm" /> },
    { value: 'CIRCLE', label: 'Circle', icon: <Circle className="h-3.5 w-3.5" /> },
    { value: 'INSTAGRAM', label: 'Instagram', icon: <Camera className="h-3.5 w-3.5" /> },
    { value: 'MODERN_FRAME', label: 'Modern Frame', icon: <Frame className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Module Style */}
      <div className="space-y-2">
        <Label>Module Shape</Label>
        <ToggleGroup
          layoutId="module-style-active"
          options={moduleShapeOptions}
          value={config.style}
          onChange={(val) => updateConfig({ style: val })}
        />
      </div>

      {/* Finder Eye Style */}
      <div className="space-y-2">
        <Label>Corner Finder Eye Style</Label>
        <ToggleGroup
          layoutId="finder-style-active"
          options={finderStyleOptions}
          value={config.finderStyle}
          onChange={(val) => updateConfig({ finderStyle: val })}
        />
      </div>

      {/* Size Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <Label>Resolution Size</Label>
          <span className="font-mono text-primary dark:text-secondary font-bold">{config.size}px</span>
        </div>
        <Slider
          value={config.size}
          min={200}
          max={1000}
          step={20}
          onValueChange={(val) => updateConfig({ size: val })}
        />
      </div>

      {/* Spacing / Quiet Zone Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <Label>Quiet Zone & Margin Spacing</Label>
          <span className="font-mono text-primary dark:text-secondary font-bold">{config.patternSpacing ?? 10}px</span>
        </div>
        <Slider
          value={config.patternSpacing ?? 10}
          min={2}
          max={30}
          step={1}
          onValueChange={(val) => updateConfig({ patternSpacing: val })}
        />
      </div>

      {/* Neon Glow Style Toggle */}
      <div className="p-4 rounded-xl border border-primary/40 bg-primary/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-text font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              Neon Glow Style
            </Label>
            <p className="text-[11px] text-text-secondary">
              Soft halo bloom with dark background compositing
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.neonGlowEnabled || false}
            onClick={() => updateConfig({ neonGlowEnabled: !config.neonGlowEnabled })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              config.neonGlowEnabled ? 'bg-primary' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                config.neonGlowEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.neonGlowEnabled && (
          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <Label className="text-xs text-text-secondary font-medium">Dark Canvas Background</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.neonBackgroundColor || '#0A0A14'}
                onChange={(e) => updateConfig({ neonBackgroundColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer"
              />
              <span className="text-xs font-mono text-text font-semibold">{config.neonBackgroundColor || '#0A0A14'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
