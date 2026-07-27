import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import {
  Shapes,
  Eye,
  Palette,
  Image,
  Sparkles,
  Film,
  Layers,
  Zap,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';

export function FeatureGrid() {
  const reducedMotion = usePrefersReducedMotion();

  const features = [
    {
      icon: <Shapes className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />,
      title: 'Module Geometries',
      description: 'Choose from Square, Rounded, Smooth Circles, Halftone dot density, and Frosted Glass rendering modules.',
      badge: '5 Styles',
    },
    {
      icon: <Eye className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />,
      title: 'Finder Eye Engine',
      description: 'Customize corner target finders with Classic, Rounded, Concentric Circles, Instagram style, or Modern Frames.',
      badge: '5 Finder Styles',
    },
    {
      icon: <Palette className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />,
      title: 'Gradient & Color Painters',
      description: 'Apply solid hex colors, high-contrast linear gradients, or radial focal point gradient fills with precise control.',
      badge: 'Linear & Radial',
    },
    {
      icon: <Image className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />,
      title: 'Logo Safety Zone',
      description: 'Embed custom company logos in square, rounded, or circle masks with automated ECC safety plate protection.',
      badge: 'ECC Auto-Safety',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />,
      title: 'Decorative Backgrounds',
      description: 'Overlay subtle geometric patterns (dots, grids, stars, sparkles) with customizable opacity and blend modes.',
      badge: 'Blend Modes',
    },
    {
      icon: <Film className="h-6 w-6 text-primary dark:text-secondary" strokeWidth={1.5} />,
      title: 'Frames & Animated GIFs',
      description: 'Wrap QR codes in Scan Me cards or Camera Aperture frames, or export eye-catching animated GIF sequence files.',
      badge: 'GIF & Vector PDF',
    },
  ];

  return (
    <section id="features" className="py-20 bg-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            ENGINE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text tracking-tight">
            Designed for Precision Vector & Raster QR Generation
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            Powered by a high-throughput Java Spring Boot rendering pipeline capable of rendering high-resolution vector SVGs, print PDFs, and multi-frame GIFs.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="h-full flex flex-col justify-between p-6 space-y-4 hover:border-primary/40 dark:hover:border-secondary/40">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-secondary/15 inline-flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <Badge variant="outline">{feat.badge}</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-text font-heading">{feat.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-2 text-xs font-medium text-primary dark:text-secondary inline-flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" strokeWidth={1.5} /> Instant Backend Render
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
