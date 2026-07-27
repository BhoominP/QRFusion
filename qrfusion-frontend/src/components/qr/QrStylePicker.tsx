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
    </div>
  );
}
