import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { QrTemplate, DEFAULT_QR_CONFIG, QrConfig } from '../../../types/qr';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { QrFusionLogoCompact } from '../../../components/brand/QrFusionLogoCompact';
import { Button } from '../../../components/ui/Button';
import { useDebouncedPreview } from '../../../hooks/useDebouncedPreview';
import { ArrowRight, Loader2 } from 'lucide-react';

interface TemplateCardProps {
  template: QrTemplate;
  isPopular?: boolean;
}

export function TemplateCard({ template, isPopular = false }: TemplateCardProps) {
  const reducedMotion = useReducedMotion();

  // Merge template config with DEFAULT_QR_CONFIG for live preview rendering
  const fullConfig = useMemo<QrConfig>(() => {
    return {
      ...DEFAULT_QR_CONFIG,
      ...template.config,
      size: 180, // Optimized thumbnail size for fast rendering
    };
  }, [template.config]);

  // Connect to backend API preview
  const { result, isGenerating } = useDebouncedPreview(fullConfig, null, null, 100);

  // Category badge styling helper
  const getBadgeStyle = (category: QrTemplate['category']) => {
    switch (category) {
      case 'Popular':
        return 'bg-[#F8B444]/15 text-[#B45309] dark:text-[#F8B444] border-[#F8B444]/30 font-bold';
      case 'Business':
        return 'bg-[#035081]/15 text-[#035081] dark:text-[#4FA3FF] border-[#035081]/30 font-semibold';
      case 'Creative':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 font-semibold';
      case 'Tech':
        return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 font-semibold';
      case 'Minimal':
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 font-medium';
    }
  };

  const previewUrl = result?.blobUrl || result?.objectUrl;

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`group relative flex flex-col justify-between h-full ${
        isPopular ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'col-span-1'
      }`}
    >
      <GlassPanel
        className={`flex flex-col justify-between h-full p-6 space-y-6 overflow-hidden ${
          isPopular
            ? 'ring-2 ring-primary/40 dark:ring-secondary/40 shadow-2xl shadow-primary/10'
            : ''
        }`}
      >
        {/* Ambient Color Echo (Subtle Corner Radial Glow) */}
        {template.glowColor && (
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70"
            style={{ background: template.glowColor }}
          />
        )}

        <div className="space-y-5 relative z-10">
          {/* Header Row: Category Badge + QRFusion Logo Mark (QrFusion_logo_4) */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${getBadgeStyle(
                template.category
              )}`}
            >
              {template.category}
            </span>

            {isPopular ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                <QrFusionLogoCompact className="h-3.5 w-3.5" />
                Featured Choice
              </span>
            ) : (
              <QrFusionLogoCompact className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </div>

          {/* Real Backend QR Thumbnail Box */}
          <div
            className={`w-full rounded-xl border border-border/80 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 relative overflow-hidden transition-all group-hover:border-primary/40 ${
              isPopular ? 'h-48 sm:h-56' : 'h-44'
            }`}
          >
            {/* Checkerboard subtle background for transparent QR preview */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${template.name} preview`}
                className="max-h-full max-w-full object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-text-secondary text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Rendering template...</span>
              </div>
            ) : (
              <div className="text-xs text-text-secondary">Preview Unavailable</div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-xl font-bold font-heading text-text group-hover:text-primary dark:group-hover:text-secondary transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* Action Button CTA - Framer Motion Hover Reveal */}
        <div className="pt-2 relative z-10">
          <Link to={`/generator?template=${template.id}`}>
            <Button
              variant={isPopular ? 'primary' : 'outline'}
              size="md"
              className="w-full justify-center group/btn shadow-sm"
            >
              <span>Use Template</span>
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-150 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
