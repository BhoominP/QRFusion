import React, { useRef } from 'react';
import { QrConfig, FrameStyle, CaptionPosition, CaptionFont } from '../../types/qr';
import { ToggleGroup, ToggleOption } from '../ui/ToggleGroup';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import {
  Ban,
  Layers,
  CreditCard,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Type,
  Smile,
  Eye,
  EyeOff,
  Sparkles,
  Square,
} from 'lucide-react';

export interface QrFramePickerProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  frameBackgroundFile?: File | null;
  setFrameBackgroundFile?: (file: File | null) => void;
}

export function QrFramePicker({
  config,
  updateConfig,
  frameBackgroundFile,
  setFrameBackgroundFile,
}: QrFramePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frameStyleOptions: ToggleOption<FrameStyle>[] = [
    { value: 'NONE', label: 'Default', icon: <Ban className="h-3.5 w-3.5" /> },
    { value: 'GLASS_PLATE', label: 'Glass Plate', icon: <Layers className="h-3.5 w-3.5" /> },
    { value: 'SCAN_ME_CARD', label: 'Scan Me Badge', icon: <CreditCard className="h-3.5 w-3.5" /> },
  ];

  const positionOptions: ToggleOption<CaptionPosition>[] = [
    { value: 'TOP', label: 'Top', icon: <ArrowUp className="h-3.5 w-3.5" /> },
    { value: 'BOTTOM', label: 'Bottom', icon: <ArrowDown className="h-3.5 w-3.5" /> },
    { value: 'LEFT', label: 'Left', icon: <ArrowLeft className="h-3.5 w-3.5" /> },
    { value: 'RIGHT', label: 'Right', icon: <ArrowRight className="h-3.5 w-3.5" /> },
  ];

  const fontOptions: ToggleOption<CaptionFont>[] = [
    { value: 'INTER', label: 'Inter (Sans)' },
    { value: 'ROBOTO', label: 'Roboto (Sans)' },
    { value: 'OUTFIT', label: 'Outfit (Rounded)' },
    { value: 'PLAYFAIR', label: 'Playfair (Serif)' },
    { value: 'LORA', label: 'Lora (Editorial)' },
    { value: 'MONO', label: 'Fira Code (Mono)' },
    { value: 'BEBAS', label: 'Bebas (Impact)' },
    { value: 'PACIFICO', label: 'Pacifico (Script)' },
    { value: 'FREDOKA', label: 'Fredoka (Bubble)' },
    { value: 'CINZEL', label: 'Cinzel (Luxury)' },
  ];

  const quickEmojis = ['📱', '📷', '✨', '🚀', '🎁', '☕', '🛒', '📲', '🔍', '💡', '🔥', '⭐', '🍔', '⚡'];

  const isCaptionActive = (config.frameCaptionEnabled ?? true) && config.frameCaptionText.trim().length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setFrameBackgroundFile) {
      setFrameBackgroundFile(file);
    }
  };

  const handleRemoveBackground = () => {
    if (setFrameBackgroundFile) {
      setFrameBackgroundFile(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddEmoji = (emoji: string) => {
    const current = config.frameCaptionText || '';
    if (current.includes(emoji)) return;
    updateConfig({
      frameCaptionEnabled: true,
      frameCaptionText: `${current} ${emoji}`.trim(),
    });
  };

  const handleToggleCaption = () => {
    if (isCaptionActive) {
      updateConfig({ frameCaptionEnabled: false, frameCaptionText: '' });
    } else {
      updateConfig({ frameCaptionEnabled: true, frameCaptionText: 'SCAN ME' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Frame Style Toggle */}
      <div className="space-y-2">
        <Label>Decorative Frame Enclosure</Label>
        <ToggleGroup
          layoutId="frame-style-active"
          options={frameStyleOptions}
          value={config.frameStyle}
          onChange={(val) => updateConfig({ frameStyle: val })}
        />
      </div>

      {config.frameStyle !== 'NONE' && (
        <div className="space-y-6 pt-2">

          {/* Transparent Inner Card Toggle for Glass Plate */}
          {config.frameStyle === 'GLASS_PLATE' && (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface/70">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5 font-bold text-text">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Inner QR Plate Background
                </Label>
                <p className="text-xs text-text-secondary">
                  {config.glassPlateTransparent ? 'Transparent Glass (Artwork Shines Through)' : 'Solid White Backing'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-surface rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => updateConfig({ glassPlateTransparent: false })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    !config.glassPlateTransparent ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ glassPlateTransparent: true })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    config.glassPlateTransparent ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  Transparent
                </button>
              </div>
            </div>
          )}

          {/* Turn Off / On CTA Text Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface/70">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-1.5 font-bold text-text cursor-pointer" onClick={handleToggleCaption}>
                <Type className="h-4 w-4 text-primary" />
                Call-to-Action Text
              </Label>
              <p className="text-xs text-text-secondary">
                {isCaptionActive ? 'Visible on frame' : 'Disabled (Frame only)'}
              </p>
            </div>

            <Button
              variant={isCaptionActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={handleToggleCaption}
              className="gap-1.5"
            >
              {isCaptionActive ? (
                <>
                  <Eye className="h-3.5 w-3.5" /> Text Enabled
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-text-secondary" /> Turn Off Text
                </>
              )}
            </Button>
          </div>

          {/* Caption Controls (visible only when CTA Text is active) */}
          {isCaptionActive && (
            <>
              {/* Caption Text Input & Quick Emojis */}
              <div className="space-y-2.5 p-4 rounded-xl border border-border bg-surface/60">
                <Label htmlFor="frame-caption">Call-to-Action Text</Label>
                
                <Input
                  id="frame-caption"
                  value={config.frameCaptionText}
                  onChange={(e) =>
                    updateConfig({
                      frameCaptionEnabled: e.target.value.trim().length > 0,
                      frameCaptionText: e.target.value,
                    })
                  }
                  placeholder="e.g. SCAN ME 📱"
                  maxLength={40}
                />

                {/* Quick Emoji Picker Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-text-secondary font-medium flex items-center gap-1">
                    <Smile className="h-3 w-3 text-amber-500" /> Quick Add Emoji:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleAddEmoji(emoji)}
                        className="w-8 h-8 rounded-lg bg-surface hover:bg-primary/10 border border-border/80 hover:border-primary/40 text-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                        title={`Add ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Text Position */}
              <div className="space-y-2">
                <Label>CTA Text Position</Label>
                <ToggleGroup
                  layoutId="frame-caption-pos-active"
                  options={positionOptions}
                  value={config.frameCaptionPosition || 'TOP'}
                  onChange={(val) => updateConfig({ frameCaptionPosition: val })}
                />
              </div>

              {/* CTA Text Font Size Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="caption-size-slider">Font Size</Label>
                  <span className="text-xs font-mono font-bold text-primary">
                    {config.frameCaptionSize || 24}px
                  </span>
                </div>
                <Slider
                  id="caption-size-slider"
                  min={14}
                  max={56}
                  step={1}
                  value={config.frameCaptionSize || 24}
                  onValueChange={(val) => updateConfig({ frameCaptionSize: val })}
                />
              </div>

              {/* CTA Text Font Family Picker */}
              <div className="space-y-2">
                <Label>Free Font Family Style</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {fontOptions.map((opt) => {
                    const isSelected = (config.frameCaptionFont || 'INTER') === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateConfig({ frameCaptionFont: opt.value })}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]'
                            : 'bg-surface/80 hover:bg-surface text-text-secondary hover:text-text border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Color Settings (Text & Frame Colors) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Caption Text Color */}
            {isCaptionActive && (
              <div className="space-y-2">
                <Label htmlFor="frame-text-color-input">Text Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="frame-text-color-input"
                    type="color"
                    value={config.frameCaptionTextColor}
                    onChange={(e) => updateConfig({ frameCaptionTextColor: e.target.value })}
                    className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={config.frameCaptionTextColor}
                    onChange={(e) => updateConfig({ frameCaptionTextColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase"
                  />
                </div>
              </div>
            )}

            {/* Frame Base Color (For Scan Me Badge) */}
            {config.frameStyle !== 'GLASS_PLATE' && (
              <div className="space-y-2">
                <Label htmlFor="frame-color-input">Frame Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="frame-color-input"
                    type="color"
                    value={config.frameColor}
                    onChange={(e) => updateConfig({ frameColor: e.target.value })}
                    className="h-10 w-12 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={config.frameColor}
                    onChange={(e) => updateConfig({ frameColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-surface text-text uppercase"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Background Image Uploader for Glass Plate */}
          {config.frameStyle === 'GLASS_PLATE' && setFrameBackgroundFile && (
            <div className="space-y-3 p-4 rounded-xl border border-border/80 bg-surface/50">
              <div>
                <Label>Glass Plate Background Artwork</Label>
                <p className="text-xs text-text-secondary mt-0.5">
                  Upload a custom wallpaper or photo. It will shine through the frosted glass plate with a blur effect.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {frameBackgroundFile ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-slate-900 shrink-0">
                      <img
                        src={URL.createObjectURL(frameBackgroundFile)}
                        alt="Background Preview"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="truncate text-xs">
                      <p className="font-semibold text-text truncate">{frameBackgroundFile.name}</p>
                      <p className="text-text-secondary">{(frameBackgroundFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveBackground}
                    className="text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-bg/50 hover:bg-bg"
                >
                  <Upload className="h-6 w-6 mx-auto mb-1.5 text-text-secondary" />
                  <p className="text-xs font-medium text-text">Click to upload custom background image</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
