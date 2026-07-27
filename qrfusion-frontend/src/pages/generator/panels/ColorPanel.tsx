import { QrConfig, ColorMode, BlendMode } from '../../../types/qr';
import { Label } from '../../../components/ui/Label';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Slider } from '../../../components/ui/Slider';

interface ColorPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
}

export function ColorPanel({ config, updateConfig }: ColorPanelProps) {
  const modes: { id: ColorMode; label: string }[] = [
    { id: 'SOLID', label: 'Solid Color' },
    { id: 'LINEAR_GRADIENT', label: 'Linear Gradient' },
    { id: 'RADIAL_GRADIENT', label: 'Radial Gradient' },
  ];

  return (
    <div className="space-y-6">
      {/* Color Mode Switcher */}
      <div>
        <Label>Color Mode Painter</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {modes.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => updateConfig({ colorMode: m.id })}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                config.colorMode === m.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color Inputs */}
      {config.colorMode === 'SOLID' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Foreground Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.foregroundColor}
                onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={config.foregroundColor}
                onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gradient Color Inputs */}
      {(config.colorMode === 'LINEAR_GRADIENT' || config.colorMode === 'RADIAL_GRADIENT') && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gradient Start Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.startColor}
                  onChange={(e) => updateConfig({ startColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={config.startColor}
                  onChange={(e) => updateConfig({ startColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gradient End Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.endColor}
                  onChange={(e) => updateConfig({ endColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={config.endColor}
                  onChange={(e) => updateConfig({ endColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Fill</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Blend Mode & Opacity */}
      <div className="p-4 rounded-xl border border-border/80 bg-bg/50 space-y-4">
        <div className="space-y-1.5">
          <Label>Background Blend Mode</Label>
          <Select
            value={config.blendMode}
            onChange={(e) => updateConfig({ blendMode: e.target.value as BlendMode })}
            options={[
              { label: 'Normal', value: 'NORMAL' },
              { label: 'Multiply', value: 'MULTIPLY' },
              { label: 'Screen', value: 'SCREEN' },
            ]}
          />
        </div>

        <Slider
          label="Background Opacity"
          min={0}
          max={1}
          step={0.05}
          value={config.backgroundOpacity}
          displayValue={`${Math.round(config.backgroundOpacity * 100)}%`}
          onValueChange={(val) => updateConfig({ backgroundOpacity: val })}
        />
      </div>
    </div>
  );
}
