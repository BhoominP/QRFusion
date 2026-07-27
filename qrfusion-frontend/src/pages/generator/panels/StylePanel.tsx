import { QrConfig, RenderStyle, FinderStyle, PatternStyle } from '../../../types/qr';
import { Label } from '../../../components/ui/Label';
import { Slider } from '../../../components/ui/Slider';

interface StylePanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
}

export function StylePanel({ config, updateConfig }: StylePanelProps) {
  const styles: { id: RenderStyle; label: string; desc: string }[] = [
    { id: 'SQUARE', label: 'Square', desc: 'Sharp standard modules' },
    { id: 'ROUNDED', label: 'Rounded', desc: 'Smooth curved corners' },
    { id: 'CIRCLE', label: 'Circle', desc: 'Concentric dot grid' },
    { id: 'HALFTONE', label: 'Halftone', desc: 'Dynamic dot sizes' },
    { id: 'GLASS', label: 'Frosted Glass', desc: 'Semi-transparent modules' },
  ];

  const finders: { id: FinderStyle; label: string }[] = [
    { id: 'CLASSIC', label: 'Classic' },
    { id: 'ROUNDED', label: 'Rounded' },
    { id: 'CIRCLE', label: 'Circle Ring' },
    { id: 'INSTAGRAM', label: 'Instagram' },
    { id: 'MODERN_FRAME', label: 'Modern Frame' },
  ];

  const patterns: { id: PatternStyle; label: string }[] = [
    { id: 'NONE', label: 'None' },
    { id: 'DOTS', label: 'Dots' },
    { id: 'GRID', label: 'Grid' },
    { id: 'STARS', label: 'Stars' },
    { id: 'SPARKLES', label: 'Sparkles' },
  ];

  return (
    <div className="space-y-6">
      {/* Module Shape Picker */}
      <div>
        <Label>Module Shape Geometry (RenderStyle)</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {styles.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => updateConfig({ style: s.id })}
              className={`p-3 rounded-xl border text-left transition-all ${
                config.style === s.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              <div className="text-xs font-semibold">{s.label}</div>
              <div className="text-[11px] text-text-secondary font-normal">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Finder Style Picker */}
      <div>
        <Label>Corner Eye Finder Style (FinderStyle)</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {finders.map((f) => (
            <button
              type="button"
              key={f.id}
              onClick={() => updateConfig({ finderStyle: f.id })}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                config.finderStyle === f.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Style Picker */}
      <div>
        <Label>Background Pattern Style (PatternStyle)</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {patterns.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => updateConfig({ patternStyle: p.id })}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                config.patternStyle === p.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Controls when pattern is active */}
      {config.patternStyle !== 'NONE' && (
        <div className="p-4 rounded-xl border border-border/80 bg-bg/50 space-y-4">
          <div className="space-y-1">
            <Label>Pattern Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.patternColor}
                onChange={(e) => updateConfig({ patternColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <span className="text-xs font-mono text-text">{config.patternColor}</span>
            </div>
          </div>

          <Slider
            label="Pattern Size"
            min={1}
            max={10}
            value={config.patternSize}
            displayValue={`${config.patternSize}px`}
            onValueChange={(val) => updateConfig({ patternSize: val })}
          />

          <Slider
            label="Pattern Spacing"
            min={4}
            max={30}
            value={config.patternSpacing}
            displayValue={`${config.patternSpacing}px`}
            onValueChange={(val) => updateConfig({ patternSpacing: val })}
          />
        </div>
      )}
    </div>
  );
}
