import React from 'react';
import { CaptionPosition, CaptionFont } from '../../types/qr';

export interface GlassPlateFrameProps {
  children: React.ReactNode;
  captionEnabled?: boolean;
  captionText?: string;
  captionPosition?: CaptionPosition;
  captionSize?: number;
  captionFont?: CaptionFont;
  captionTextColor?: string;
  glassPlateTransparent?: boolean;
}

export function GlassPlateFrame({
  children,
  captionEnabled = true,
  captionText = 'Scan me',
  captionPosition = 'TOP',
  captionSize = 20,
  captionFont = 'INTER',
  captionTextColor = '#0F172A',
  glassPlateTransparent = false,
}: GlassPlateFrameProps) {
  const showCaption = captionEnabled && captionText && captionText.trim().length > 0;

  const getFontFamilyStyle = (font: CaptionFont) => {
    switch (font) {
      case 'PLAYFAIR':
      case 'SERIF':
        return { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 };
      case 'LORA':
        return { fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontWeight: 600 };
      case 'CINZEL':
        return { fontFamily: "'Cinzel', serif", textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontWeight: 700 };
      case 'MONO':
        return { fontFamily: "'Fira Code', monospace", fontWeight: 700 };
      case 'BEBAS':
        return { fontFamily: "'Bebas Neue', Impact, sans-serif", textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontWeight: 900 };
      case 'PACIFICO':
        return { fontFamily: "'Pacifico', cursive", fontWeight: 400 };
      case 'FREDOKA':
        return { fontFamily: "'Fredoka', sans-serif", fontWeight: 600 };
      case 'OUTFIT':
        return { fontFamily: "'Outfit', sans-serif", fontWeight: 700 };
      case 'ROBOTO':
        return { fontFamily: "'Roboto', sans-serif", fontWeight: 700 };
      case 'INTER':
      default:
        return { fontFamily: "'Inter', sans-serif", fontWeight: 700 };
    }
  };

  const captionElement = showCaption ? (
    <div
      className="flex items-center justify-center text-center py-1 px-2"
      style={{
        fontSize: `${captionSize}px`,
        color: captionTextColor || '#0F172A',
        ...getFontFamilyStyle(captionFont),
      }}
    >
      <span>{captionText}</span>
    </div>
  ) : null;

  const isVertical = captionPosition === 'LEFT' || captionPosition === 'RIGHT';

  return (
    <div className="relative flex items-center justify-center p-8 w-full h-full bg-black rounded-2xl overflow-hidden select-none">
      {/* Background Spheres */}
      <div
        className="absolute -top-6 -right-6 h-36 w-36 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FFEE00 0%, #FF5500 55%, #FF0000 85%, transparent 100%)',
          boxShadow: '0 0 40px rgba(205, 85, 0, 0.6)',
        }}
      />
      <div
        className="absolute top-1/2 -left-8 -translate-y-1/2 h-28 w-28 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FFEE00 0%, #FF6600 60%, transparent 100%)',
          boxShadow: '0 0 30px rgba(25, 102, 0, 0.5)',
        }}
      />

      {/* Frosted Glass Card */}
      <div className="relative rounded-[2rem] border border-white/40 bg-white/15 dark:bg-black/40 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl max-w-full z-10 overflow-hidden">
        {/* Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 30%, transparent 60%, rgba(255, 255, 255, 0.08) 100%)',
          }}
        />

        {/* Inner Card Plate (White or Transparent Glass) */}
        <div
          className={`relative z-10 rounded-[1.5rem] p-4 sm:p-5 shadow-lg flex ${
            glassPlateTransparent ? 'bg-transparent border border-white/20' : 'bg-white'
          } ${
            showCaption
              ? isVertical
                ? captionPosition === 'LEFT'
                  ? 'flex-row'
                  : 'flex-row-reverse'
                : captionPosition === 'TOP'
                ? 'flex-col'
                : 'flex-col-reverse'
              : 'flex-col'
          } items-center gap-3.5`}
        >
          {captionElement}

          {/* Inner Clean QR Code Container */}
          <div className="w-full flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
