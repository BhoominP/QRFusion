import React, { useRef } from 'react';
import { QrConfig } from '../../../types/qr';
import { Label } from '../../../components/ui/Label';
import { Button } from '../../../components/ui/Button';
import { Slider } from '../../../components/ui/Slider';
import { Sparkles, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

export interface ArtFusionPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  backgroundArtFile?: File | null;
  setBackgroundArtFile?: (file: File | null) => void;
}

export function ArtFusionPanel({
  config,
  updateConfig,
  backgroundArtFile,
  setBackgroundArtFile,
}: ArtFusionPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample artwork images for instant 1-click testing
  const samplePresets = [
    {
      id: 'geisha',
      name: 'Japanese Art',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'marble',
      name: 'Golden Marble',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'abstract',
      name: 'Liquid Abstract',
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setBackgroundArtFile) {
      setBackgroundArtFile(file);
      updateConfig({ artFusionEnabled: true });
    }
  };

  const handleSelectSample = async (sampleUrl: string) => {
    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], 'preset-art.jpg', { type: 'image/jpeg' });
      if (setBackgroundArtFile) {
        setBackgroundArtFile(file);
        updateConfig({ artFusionEnabled: true });
      }
    } catch (err) {
      console.error('Failed to load sample art:', err);
    }
  };

  const handleRemoveArt = () => {
    if (setBackgroundArtFile) {
      setBackgroundArtFile(null);
    }
    updateConfig({ artFusionEnabled: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const opacityPercent = Math.round((config.backgroundOpacity ?? 0.40) * 100);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-text">AI & Photo QR Art Fusion</h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Upload any portrait, photo, or artwork. The artwork is masked directly into the dark modules of the QR matrix with high-contrast finder eyes for 100% scannability.
        </p>
      </div>

      {/* Artwork Upload Area */}
      <div className="space-y-3">
        <Label>Upload Artwork or Photo</Label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        {backgroundArtFile ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/40 bg-surface/80">
            <div className="flex items-center gap-3.5 truncate">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-slate-950 shrink-0">
                <img
                  src={URL.createObjectURL(backgroundArtFile)}
                  alt="Art Fusion Preview"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="truncate text-xs">
                <p className="font-bold text-text truncate">{backgroundArtFile.name}</p>
                <p className="text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Art Masking Active
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveArt}
              className="text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-bg/50 hover:bg-bg group"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-text">Click to upload custom artwork or photo</p>
            <p className="text-[11px] text-text-secondary mt-1">Supports PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </div>

      {/* Preset 1-Click Sample Artwork */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-text-secondary flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5 text-primary" /> Or Try 1-Click Sample Art:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {samplePresets.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample.url)}
              className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/60 p-1 bg-surface transition-all hover:scale-[1.03] cursor-pointer text-left"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="text-[11px] font-semibold text-text mt-1.5 px-1 truncate">{sample.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Artwork Opacity & Contrast Slider */}
      {backgroundArtFile && (
        <div className="space-y-3 pt-2 border-t border-border/80">
          <div className="flex items-center justify-between">
            <Label htmlFor="art-opacity-slider">Artwork Opacity & Scan Contrast</Label>
            <span className="text-xs font-mono font-bold text-primary">
              {opacityPercent}%
            </span>
          </div>

          <Slider
            id="art-opacity-slider"
            min={0}
            max={100}
            step={1}
            value={opacityPercent}
            onValueChange={(val) => updateConfig({ backgroundOpacity: val / 100 })}
          />

          <p className="text-[11px] text-text-secondary">
            Higher opacity reveals more artwork details inside dark modules. Lower opacity increases scan contrast for camera detection.
          </p>
        </div>
      )}
    </div>
  );
}
