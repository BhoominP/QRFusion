import { useState } from 'react';
import { motion } from 'framer-motion';
import { CompassIndicator } from '../../../components/brand/CompassIndicator';
import { HorizonLine } from '../../../components/brand/HorizonLine';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { QrFusionLogoCompact } from '../../../components/brand/QrFusionLogoCompact';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { num: 0, label: '1. Content', desc: 'Enter URL or Text' },
    { num: 1, label: '2. Style', desc: 'Custom Shape & Colors' },
    { num: 2, label: '3. Export', desc: 'Vector SVG & PNG' },
  ];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Eyebrow label */}
            <div className="inline-flex items-center gap-2">
              <Badge variant="secondary">
                <QrFusionLogoCompact className="h-3.5 w-3.5 mr-0.5 inline-block" />
                SPRING BOOT HIGH-PERFORMANCE RENDER ENGINE
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text tracking-tight leading-[1.1]">
              Navigate the Next Horizon of <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Custom QR Codes</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl font-normal leading-relaxed">
              Design studio-grade vector & raster QR codes in seconds. Custom module geometries, eye finders, gradient painters, brand logo safety plates, and animated GIF exports.
            </p>

            {/* Compass Multi-step Progress Indicator */}
            <div className="pt-2 pb-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface/80 border border-border/80 shadow-xs max-w-xl">
                <CompassIndicator size="md" activeStep={activeStep} spinning={false} />

                <div className="flex-1 grid grid-cols-3 gap-2">
                  {steps.map((step) => (
                    <button
                      key={step.num}
                      onClick={() => setActiveStep(step.num)}
                      className={`text-left p-2 rounded-xl text-xs transition-all ${
                        activeStep === step.num
                          ? 'bg-primary/10 text-primary font-bold border border-primary/20 dark:text-secondary'
                          : 'text-text-secondary hover:text-text hover:bg-border/30'
                      }`}
                    >
                      <div className="font-bold">{step.label}</div>
                      <div className="text-[10px] text-text-secondary truncate">{step.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link to="/generator">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                  <QrCode className="h-5 w-5" strokeWidth={1.5} />
                  Build Your QR Code
                  <ArrowRight className="h-4 w-4 ml-1" strokeWidth={1.5} />
                </Button>
              </Link>

              <a href="#templates">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Preset Templates
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-text-secondary font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.5} />
                Vector SVG & Print PDF
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.5} />
                Logo Safety Zones
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.5} />
                Instant API Render
              </span>
            </div>
          </motion.div>

          {/* Right Hero Column: Interactive Live Preview Card */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <GlassPanel glow className="p-6 md:p-8 space-y-6">
              {/* Header inside Card */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">Live Canvas Preview</span>
                  <h3 className="text-lg font-bold text-text font-heading">Ocean Blue Gradient</h3>
                </div>
                <Badge variant="secondary">Render Engine Active</Badge>
              </div>

              {/* Simulated Rendered QR Code Display */}
              <div className="relative aspect-square w-full rounded-2xl bg-white p-6 shadow-inner flex items-center justify-center border border-slate-100 overflow-hidden group">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-slate-900 transition-transform duration-300 group-hover:scale-105"
                >
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0F4C81" />
                      <stop offset="100%" stopColor="#4FA3FF" />
                    </linearGradient>
                  </defs>

                  {/* Outer Frame Card */}
                  <rect x="5" y="5" width="190" height="190" rx="16" fill="none" stroke="#0F4C81" strokeWidth="4" />

                  {/* Finder Top-Left */}
                  <rect x="20" y="20" width="40" height="40" rx="10" fill="none" stroke="url(#heroGradient)" strokeWidth="6" />
                  <rect x="32" y="32" width="16" height="16" rx="4" fill="url(#heroGradient)" />

                  {/* Finder Top-Right */}
                  <rect x="140" y="20" width="40" height="40" rx="10" fill="none" stroke="url(#heroGradient)" strokeWidth="6" />
                  <rect x="152" y="32" width="16" height="16" rx="4" fill="url(#heroGradient)" />

                  {/* Finder Bottom-Left */}
                  <rect x="20" y="140" width="40" height="40" rx="10" fill="none" stroke="url(#heroGradient)" strokeWidth="6" />
                  <rect x="32" y="152" width="16" height="16" rx="4" fill="url(#heroGradient)" />

                  {/* QR Data Pattern Grid */}
                  <rect x="75" y="25" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="90" y="25" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="110" y="25" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="75" y="45" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="105" y="45" width="10" height="10" rx="3" fill="url(#heroGradient)" />

                  <rect x="25" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="45" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="75" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="95" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="115" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="145" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="165" y="75" width="10" height="10" rx="3" fill="url(#heroGradient)" />

                  <rect x="25" y="95" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="65" y="95" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="135" y="95" width="10" height="10" rx="3" fill="url(#heroGradient)" />
                  <rect x="165" y="95" width="10" height="10" rx="3" fill="url(#heroGradient)" />

                  {/* Logo Center Plate */}
                  <rect x="76" y="76" width="48" height="48" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                  <circle cx="100" cy="100" r="14" fill="#0F4C81" />
                  <polygon points="100,90 105,100 100,110 95,100" fill="#F4B942" />
                </svg>

                {/* Subdued watermark label */}
                <div className="absolute bottom-2 text-[10px] font-semibold text-slate-400 tracking-wider">
                  SCAN ME — QRFUSION
                </div>
              </div>

              {/* Quick Actions under Preview */}
              <div className="flex items-center justify-between text-xs text-text-secondary pt-1">
                <span>Preset: <strong className="text-text">Linear Ocean Gradient</strong></span>
                <Link to="/generator" className="text-primary dark:text-secondary font-bold hover:underline inline-flex items-center gap-1">
                  Customize in Studio <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </GlassPanel>
          </motion.div>

        </div>
      </div>

      {/* Curved Horizon Line at Base of Hero Section */}
      <div className="absolute bottom-0 left-0 right-0">
        <HorizonLine />
      </div>
    </section>
  );
}
