import { useState, useMemo } from 'react';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { QrCode, Check, ArrowRight } from 'lucide-react';
import { RenderStyle, FinderStyle } from '../../../types/qr';

export function LiveDemoSection() {
  const [selectedStyle, setSelectedStyle] = useState<RenderStyle>('ROUNDED');
  const [selectedFinder, setSelectedFinder] = useState<FinderStyle>('ROUNDED');
  const [selectedColorPreset, setSelectedColorPreset] = useState(0);

  const colorPresets = [
    { label: 'Deep Ocean', start: '#0F4C81', end: '#4FA3FF' },
    { label: 'Sunset Horizon', start: '#0F4C81', end: '#F4B942' },
    { label: 'Emerald Tide', start: '#0D4270', end: '#10B981' },
    { label: 'Midnight Obsidian', start: '#111827', end: '#6B7280' },
  ];

  const styles: { id: RenderStyle; label: string }[] = [
    { id: 'SQUARE', label: 'Square' },
    { id: 'ROUNDED', label: 'Rounded' },
    { id: 'CIRCLE', label: 'Circle' },
    { id: 'HALFTONE', label: 'Halftone' },
  ];

  const finders: { id: FinderStyle; label: string }[] = [
    { id: 'CLASSIC', label: 'Classic' },
    { id: 'ROUNDED', label: 'Rounded' },
    { id: 'CIRCLE', label: 'Circle' },
    { id: 'INSTAGRAM', label: 'Instagram' },
  ];

  const currentPreset = colorPresets[selectedColorPreset];

  // Grid dimensions for authentic Version 1 (21x21) QR Code
  const GRID_SIZE = 21;
  const OFFSET = 15;
  const CANVAS_SIZE = 170;
  const STEP = CANVAS_SIZE / GRID_SIZE; // 8.095px per module

  // Authentic 21x21 QR Code Data Matrix (50% density, PRNG noise, timing & alignment)
  const qrMatrix = useMemo(() => {
    const matrix: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(false)
    );

    // High-entropy PRNG for 48–52% irregular QR data noise (no cross or line artifacts)
    const seedBit = (r: number, c: number) => {
      const hash = (r * 37 + c * 43 + (r ^ c) * 23 + r * r * 11 + c * c * 17) % 100;
      return hash < 50;
    };

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        // 1. Exclude 3 Finder Eyes (7x7 modules + 1-module quiet border)
        const inTopLeft = r <= 7 && c <= 7;
        const inTopRight = r <= 7 && c >= 13;
        const inBottomLeft = r >= 13 && c <= 7;

        if (inTopLeft || inTopRight || inBottomLeft) {
          continue;
        }

        // 2. Timing Patterns (row 6 & column 6 alternating dark/light)
        if (r === 6) {
          matrix[r][c] = c % 2 === 0;
          continue;
        }
        if (c === 6) {
          matrix[r][c] = r % 2 === 0;
          continue;
        }

        // 3. Alignment Pattern (5x5 box at rows 14..18, cols 14..18)
        if (r >= 14 && r <= 18 && c >= 14 && c <= 18) {
          const isBorder = r === 14 || r === 18 || c === 14 || c === 18;
          const isCenter = r === 16 && c === 16;
          matrix[r][c] = isBorder || isCenter;
          continue;
        }

        // 4. Data Modules
        matrix[r][c] = seedBit(r, c);
      }
    }

    return matrix;
  }, []);

  // Finder Eye SVG Renderer (3 corners)
  const renderFinderEye = (startX: number, startY: number, style: FinderStyle) => {
    const outerSize = 7 * STEP; // 56.66px
    const strokeWidth = STEP;    // 8.095px
    const innerSize = 3 * STEP; // 24.28px
    const innerOffset = 2 * STEP; // 16.19px

    if (style === 'CIRCLE') {
      const cx = startX + outerSize / 2;
      const cy = startY + outerSize / 2;
      return (
        <g key={`finder-${startX}-${startY}`}>
          <circle
            cx={cx}
            cy={cy}
            r={outerSize / 2 - strokeWidth / 2}
            fill="none"
            stroke="url(#demoGrad)"
            strokeWidth={strokeWidth}
          />
          <circle cx={cx} cy={cy} r={innerSize / 2} fill="url(#demoGrad)" />
        </g>
      );
    }

    let rxOuter = 0;
    let rxInner = 0;

    if (style === 'ROUNDED') {
      rxOuter = 14;
      rxInner = 5;
    } else if (style === 'INSTAGRAM') {
      rxOuter = 18;
      rxInner = 12; // Circular center for Instagram style
    }

    return (
      <g key={`finder-${startX}-${startY}`}>
        <rect
          x={startX}
          y={startY}
          width={outerSize}
          height={outerSize}
          rx={rxOuter}
          fill="none"
          stroke="url(#demoGrad)"
          strokeWidth={strokeWidth}
        />
        {style === 'INSTAGRAM' ? (
          <circle
            cx={startX + outerSize / 2}
            cy={startY + outerSize / 2}
            r={innerSize / 2}
            fill="url(#demoGrad)"
          />
        ) : (
          <rect
            x={startX + innerOffset}
            y={startY + innerOffset}
            width={innerSize}
            height={innerSize}
            rx={rxInner}
            fill="url(#demoGrad)"
          />
        )}
      </g>
    );
  };

  const finderCornerPositions = [
    { x: OFFSET, y: OFFSET },                       // Top-Left (0,0)
    { x: OFFSET + 14 * STEP, y: OFFSET },           // Top-Right (14,0)
    { x: OFFSET, y: OFFSET + 14 * STEP },           // Bottom-Left (0,14)
  ];

  return (
    <section id="demo" className="py-20 bg-surface/50 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            INTERACTIVE EXPERIENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text">
            Test the Design System Live
          </h2>
          <p className="text-base text-text-secondary">
            Switch styles, eye finders, and color swatches below to see real-time SVG preview updates.
          </p>
        </div>

        {/* Interactive Widget Box */}
        <GlassPanel className="p-6 md:p-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="md:col-span-6 space-y-6">
              
              {/* Module Style Picker */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                  Module Shape Geometry
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedStyle === s.id
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-border bg-surface text-text hover:bg-bg'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finder Style Picker */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                  Finder Corner Eye
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {finders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFinder(f.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedFinder === f.id
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-border bg-surface text-text hover:bg-bg'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatch Picker */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                  Color Palette Swatches
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {colorPresets.map((preset, idx) => (
                    <button
                      key={preset.label}
                      onClick={() => setSelectedColorPreset(idx)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                        selectedColorPreset === idx
                          ? 'border-primary bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary font-bold'
                          : 'border-border bg-surface text-text hover:bg-bg'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shadow-xs border border-white/20 shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                        }}
                      />
                      <span className="text-xs truncate">{preset.label}</span>
                      {selectedColorPreset === idx && (
                        <Check className="h-4 w-4 ml-auto" strokeWidth={1.5} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch Generator Button */}
              <div className="pt-2">
                <Link to="/generator">
                  <Button variant="primary" className="w-full">
                    <QrCode className="h-4 w-4" strokeWidth={1.5} />
                    Open Full Generator Studio
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive SVG Preview Display */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-inner border border-slate-100 relative min-h-[300px]">
              <svg viewBox="0 0 200 200" className="w-64 h-64">
                <defs>
                  <linearGradient id="demoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={currentPreset.start} />
                    <stop offset="100%" stopColor={currentPreset.end} />
                  </linearGradient>
                </defs>

                {/* Background Box */}
                <rect x="0" y="0" width="200" height="200" rx="16" fill="#FFFFFF" />

                {/* Finder Eyes (3 corners) */}
                {finderCornerPositions.map((pos) =>
                  renderFinderEye(pos.x, pos.y, selectedFinder)
                )}

                {/* Authentic 21x21 QR Code Data Matrix */}
                {qrMatrix.map((row, r) =>
                  row.map((isDark, c) => {
                    if (!isDark) return null;

                    const x = OFFSET + c * STEP;
                    const y = OFFSET + r * STEP;
                    const size = STEP * 0.88; // Slight margin gap between modules

                    if (selectedStyle === 'ROUNDED') {
                      return (
                        <rect
                          key={`${r}-${c}`}
                          x={x}
                          y={y}
                          width={size}
                          height={size}
                          rx={size * 0.3}
                          fill="url(#demoGrad)"
                        />
                      );
                    }

                    if (selectedStyle === 'CIRCLE' || selectedStyle === 'HALFTONE') {
                      const isSmallDot = selectedStyle === 'HALFTONE' && (r * 3 + c * 7) % 2 === 0;
                      const rad = isSmallDot ? size * 0.28 : size * 0.45;
                      return (
                        <circle
                          key={`${r}-${c}`}
                          cx={x + size / 2}
                          cy={y + size / 2}
                          r={rad}
                          fill="url(#demoGrad)"
                        />
                      );
                    }

                    return (
                      <rect
                        key={`${r}-${c}`}
                        x={x}
                        y={y}
                        width={size}
                        height={size}
                        rx="0"
                        fill="url(#demoGrad)"
                      />
                    );
                  })
                )}
              </svg>

              <Badge variant="outline" className="mt-3 text-slate-600 border-slate-300">
                Live React SVG Render
              </Badge>
            </div>

          </div>
        </GlassPanel>

      </div>
    </section>
  );
}
