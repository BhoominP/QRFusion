import { QrConfig, FrameStyle } from '../../../types/qr';
import { Label } from '../../../components/ui/Label';
import { Input } from '../../../components/ui/Input';
import { Slider } from '../../../components/ui/Slider';

interface FramePanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
}

export function FramePanel({ config, updateConfig }: FramePanelProps) {
  const frames: { id: FrameStyle; label: string; desc: string }[] = [
    { id: 'NONE', label: 'No Frame', desc: 'Clean borderless QR code' },
    { id: 'SCAN_ME_CARD', label: 'Scan Me Card', desc: 'Bottom caption banner card' },
    { id: 'CAMERA_APERTURE', label: 'Camera Aperture', desc: 'Aperture frame with corner ticks' },
  ];

  return (
    <div className="space-y-6">
      {/* Frame Style Picker */}
      <div>
        <Label>Outer Frame Style (FrameStyle)</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {frames.map((f) => (
            <button
              type="button"
              key={f.id}
              onClick={() => updateConfig({ frameStyle: f.id })}
              className={`p-3 rounded-xl border text-left transition-all ${
                config.frameStyle === f.id
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary font-bold shadow-xs'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              <div className="text-xs font-semibold">{f.label}</div>
              <div className="text-[10px] text-text-secondary font-normal mt-0.5">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Customization when Frame is selected */}
      {config.frameStyle !== 'NONE' && (
        <div className="p-4 rounded-xl border border-border/80 bg-bg/50 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="frame-text">Frame Caption Text</Label>
            <Input
              id="frame-text"
              value={config.frameCaptionText}
              onChange={(e) => updateConfig({ frameCaptionText: e.target.value })}
              placeholder="SCAN ME"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Frame Outer Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.frameColor}
                  onChange={(e) => updateConfig({ frameColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={config.frameColor}
                  onChange={(e) => updateConfig({ frameColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Caption Text Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.frameCaptionTextColor}
                  onChange={(e) => updateConfig({ frameCaptionTextColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={config.frameCaptionTextColor}
                  onChange={(e) => updateConfig({ frameCaptionTextColor: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIF Animation Frame Delay */}
      <div className="p-4 rounded-xl border border-border/80 bg-bg/50 space-y-3">
        <Slider
          label="Animated GIF Frame Delay (Ms)"
          min={50}
          max={1000}
          step={10}
          value={config.frameDelayMs}
          displayValue={`${config.frameDelayMs} ms`}
          onValueChange={(val) => updateConfig({ frameDelayMs: val })}
        />
        <p className="text-[11px] text-text-secondary">
          Only applies when Export Format is set to <strong>GIF</strong>.
        </p>
      </div>
    </div>
  );
}
