import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GlassPanel } from '../brand/GlassPanel';
import { CompassIndicator } from '../brand/CompassIndicator';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Download, AlertTriangle, Layers, RefreshCw } from 'lucide-react';
import { GeneratedQrResult } from '../../lib/api/qr';
import { QrConfig } from '../../types/qr';
import { GlassPlateFrame } from './GlassPlateFrame';

export interface QrPreviewCanvasProps {
  config: QrConfig;
  result: GeneratedQrResult | null;
  isGenerating: boolean;
  error: string | null;
  fieldErrors?: Record<string, string>;
  onDownload: () => void;
}

export function QrPreviewCanvas({
  config,
  result,
  isGenerating,
  error,
  fieldErrors,
  onDownload,
}: QrPreviewCanvasProps) {
  const shouldReduceMotion = useReducedMotion();

  const previewAnimation = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 6 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -6 },
        transition: { duration: 0.2, ease: 'easeOut' },
      };

  return (
    <GlassPanel glow className="p-6 space-y-6 lg:sticky lg:top-20 lg:self-start shadow-2xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Live Preview</span>
          <h3 className="text-lg font-bold text-text font-heading">
            {config.format} Output Canvas
          </h3>
        </div>
        <Badge variant={error ? 'accent' : isGenerating ? 'secondary' : 'success'}>
          {isGenerating ? 'Rendering...' : error ? 'Validation Error' : 'Ready'}
        </Badge>
      </div>

      {/* Preview Display Container */}
      <div
        className="relative aspect-square w-full rounded-2xl p-6 shadow-inner flex items-center justify-center border border-slate-200 overflow-hidden min-h-[300px] transition-colors duration-300"
        style={{
          backgroundColor: config.neonGlowEnabled
            ? (config.neonBackgroundColor || '#0A0A14')
            : 'white',
        }}
      >
        {/* Neon Glow Active Badge */}
        {config.neonGlowEnabled && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-[10px] font-bold text-primary flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>NEON GLOW ACTIVE</span>
          </div>
        )}
        {/* Loading Overlay with Compass Indicator over existing preview */}
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 transition-opacity">
            <CompassIndicator size="lg" spinning={true} />
            <p className="text-xs font-semibold text-primary tracking-wide animate-pulse">
              Spring Boot Rendering...
            </p>
          </div>
        )}

        {/* Error State */}
        {error ? (
          <div className="p-6 text-center space-y-3 text-danger z-10">
            <AlertTriangle className="h-10 w-10 mx-auto" strokeWidth={1.5} />
            <p className="text-xs font-semibold">{error}</p>
            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <div className="text-[11px] text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg text-left max-w-xs mx-auto space-y-1">
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <div key={field} className="font-mono">
                    <strong>{field}:</strong> {msg}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-text-secondary">
              Please adjust parameters in the controls panel.
            </p>
          </div>
        ) : result ? (
          /* Animated Framer Motion Preview */
          <AnimatePresence mode="wait">
            <motion.div
              key={result.blobUrl || result.objectUrl}
              {...previewAnimation}
              className="w-full h-full flex items-center justify-center overflow-hidden"
            >
              {result.isSvg && result.svgText ? (
                <div
                  className="w-full h-full flex items-center justify-center text-slate-900 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: result.svgText }}
                />
              ) : (
                <img
                  src={result.blobUrl || result.objectUrl}
                  alt="Generated QR Code preview"
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Initial State */
          <div className="text-center text-slate-400 space-y-2">
            <Layers className="h-12 w-12 mx-auto stroke-1" />
            <p className="text-xs font-medium">Initializing Spring Boot API preview...</p>
          </div>
        )}
      </div>

      {/* Info & Download Footer */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
          <span>Format: <strong className="text-text">{config.format}</strong></span>
          <span>Scale: <strong className="text-text">{config.exportScale}</strong></span>
          <span>Size: <strong className="text-text">{config.size}px</strong></span>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onDownload}
          isLoading={isGenerating}
          disabled={!result || !!error}
          className="w-full shadow-lg shadow-primary/20"
        >
          <Download className="h-5 w-5" strokeWidth={1.5} />
          Download {config.format} Image
        </Button>
      </div>
    </GlassPanel>
  );
}
