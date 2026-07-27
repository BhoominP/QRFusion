import React from 'react';
import { QrConfig, ColorMode } from '../../types/qr';
import { ToggleGroup, ToggleOption } from '../ui/ToggleGroup';
import { Label } from '../ui/Label';
import { Palette, Sparkles, SunMedium } from 'lucide-react';

export interface QrColorPickerProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
}

export function QrColorPicker({ config, updateConfig }: QrColorPickerProps) {
  const colorModeOptions: ToggleOption<ColorMode>[] = [
    { value: 'SOLID', label: 'Solid Color', icon: <Palette className="h-3.5 w-3.5" /> },
    { value: 'LINEAR_GRADIENT', label: 'Linear Gradient', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { value: 'RADIAL_GRADIENT', label: 'Radial Gradient', icon: <SunMedium className="h-3.5 w-3.5" /> },
  ];

  const presetPalettes = [
    { label: 'Ocean Fusion', fg: '#0F4C81', bg: '#FFFFFF', start: '#0F4C81', end: '#4FA3FF' },
    { label: 'Cyber Neon', fg: '#7C3AED', bg: '#0F172A', start: '#7C3AED', end: '#06B6D4' },
    { label: 'Sunset Glow', fg: '#E11D48', bg: '#FFF1F2', start: '#E11D48', end: '#F59E0B' },
    { label: 'Emerald Mint', fg: '#059669', bg: '#ECFDF5', start: '#059669', end: '#10B981' },
    { label: 'Monochrome Dark', fg: '#F8FAFC', bg: '#020617', start: '#F8FAFC', end: '#94A3B8' },
  ];

  return (
    <div className="space-y-6">
      {/* Color Mode Toggle */}
      <div className="space-y-2">
        <Label>Color Fill Mode</Label>
        <ToggleGroup
          layoutId="color-mode-active"
          options={colorModeOptions}
          value={config.colorMode}
          onChange={(val) => updateConfig({ colorMode: val })}
        />
      </div>

      {/* Preset Swatches */}
      <div className="space-y-2">
        <Label>Curated Preset Palettes</Label>
        <div className="grid grid-cols-5 gap-2">
          {presetPalettes.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                updateConfig({
                  foregroundColor: preset.fg,
                  backgroundColor: preset.bg,
                  startColor: preset.start,
                  endColor: preset.end,
                })
              }
              title={preset.label}
              className="h-10 rounded-xl border border-border/80 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform p-0.5 cursor-pointer"
            >
              <div
                className="w-full h-full rounded-lg"
                style={{
                  background:
                    config.colorMode === 'SOLID'
                      ? preset.fg
                      : `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Inputs based on Color Mode */}
      {config.colorMode === 'SOLID' ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Foreground Color */}
          <div className="space-y-2">
            <Label htmlFor="fg-color-input">Foreground Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="fg-color-input"
                type="color"
                value={config.foregroundColor}
                onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
              />
              <input
                type="text"
                value={config.foregroundColor}
                onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="bg-color-input">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="bg-color-input"
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                disabled={config.backgroundOpacity === 0}
                className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5 disabled:opacity-40"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                disabled={config.backgroundOpacity === 0}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Gradient Start */}
            <div className="space-y-2">
              <Label htmlFor="start-color-input">Gradient Start</Label>
              <div className="flex items-center gap-2">
                <input
                  id="start-color-input"
                  type="color"
                  value={config.startColor}
                  onChange={(e) => updateConfig({ startColor: e.target.value })}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={config.startColor}
                  onChange={(e) => updateConfig({ startColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase"
                />
              </div>
            </div>

            {/* Gradient End */}
            <div className="space-y-2">
              <Label htmlFor="end-color-input">Gradient End</Label>
              <div className="flex items-center gap-2">
                <input
                  id="end-color-input"
                  type="color"
                  value={config.endColor}
                  onChange={(e) => updateConfig({ endColor: e.target.value })}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={config.endColor}
                  onChange={(e) => updateConfig({ endColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase"
                />
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="bg-color-gradient">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="bg-color-gradient"
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                disabled={config.backgroundOpacity === 0}
                className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5 disabled:opacity-40"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                disabled={config.backgroundOpacity === 0}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Background Transparency Option */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="transparent-bg-toggle">Transparent QR Background</Label>
            <p className="text-xs text-text-secondary mt-0.5">
              Make the QR code background 100% transparent.
            </p>
          </div>
          <button
            id="transparent-bg-toggle"
            type="button"
            role="switch"
            aria-checked={config.backgroundOpacity === 0}
            onClick={() =>
              updateConfig({
                backgroundOpacity: config.backgroundOpacity === 0 ? 1 : 0,
              })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              config.backgroundOpacity === 0 ? 'bg-primary' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                config.backgroundOpacity === 0 ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.backgroundOpacity > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <Label htmlFor="bg-opacity-slider">Background Opacity</Label>
              <span className="font-mono">{Math.round(config.backgroundOpacity * 100)}%</span>
            </div>
            <input
              id="bg-opacity-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.backgroundOpacity}
              onChange={(e) => updateConfig({ backgroundOpacity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
