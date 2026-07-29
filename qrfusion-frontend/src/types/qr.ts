export type RenderStyle = 'SQUARE' | 'ROUNDED' | 'CIRCLE' | 'HALFTONE' | 'GLASS';

export type ColorMode = 'SOLID' | 'LINEAR_GRADIENT' | 'RADIAL_GRADIENT';

export type FinderStyle = 'CLASSIC' | 'ROUNDED' | 'CIRCLE' | 'INSTAGRAM' | 'MODERN_FRAME';

export type LogoShape = 'NONE' | 'SQUARE' | 'ROUNDED' | 'CIRCLE';

export type LogoPosition = 
  | 'CENTER' 
  | 'TOP' 
  | 'BOTTOM' 
  | 'LEFT' 
  | 'RIGHT' 
  | 'TOP_LEFT' 
  | 'TOP_RIGHT' 
  | 'BOTTOM_LEFT' 
  | 'BOTTOM_RIGHT';

export type FrameStyle = 'NONE' | 'SCAN_ME_CARD' | 'CAMERA_APERTURE' | 'GLASS_PLATE';

export type PatternStyle = 'NONE' | 'DOTS' | 'GRID' | 'STARS' | 'SPARKLES';

export type ExportFormat = 'PNG' | 'SVG' | 'PDF' | 'GIF';

export type ExportScale = 'X1' | 'X2' | 'X4' | 'X8';

export type BlendMode = 'NORMAL' | 'MULTIPLY' | 'SCREEN';

export type CaptionPosition = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';

export type CaptionFont =
  | 'INTER'
  | 'ROBOTO'
  | 'OUTFIT'
  | 'PLAYFAIR'
  | 'LORA'
  | 'MONO'
  | 'BEBAS'
  | 'PACIFICO'
  | 'FREDOKA'
  | 'CINZEL';

export type ArtFusionMode = 'MASK' | 'OVERLAY';

export interface QrConfig {
  content: string;
  size: number;
  style: RenderStyle;
  colorMode: ColorMode;
  finderStyle: FinderStyle;
  logoShape: LogoShape;
  logoPosition: LogoPosition;
  logoSizeRatio: number;
  safetyZone: boolean;
  transparentLogoBackground: boolean;
  logoBorderColor: string;
  logoBorderTransparent: boolean;
  exportScale: ExportScale;
  format: ExportFormat;
  backgroundOpacity: number;
  blendMode: BlendMode;
  frameStyle: FrameStyle;
  frameCaptionEnabled: boolean;
  frameCaptionText: string;
  frameCaptionPosition: CaptionPosition;
  frameCaptionSize: number;
  frameCaptionFont: CaptionFont;
  glassPlateTransparent: boolean;
  artFusionEnabled: boolean;
  artFusionMode: ArtFusionMode;
  patternStyle: PatternStyle;
  patternColor: string;
  patternSize: number;
  patternSpacing: number;
  frameDelayMs: number;
  frameColor: string;
  frameCaptionTextColor: string;
  foregroundColor: string;
  backgroundColor: string;
  startColor: string;
  endColor: string;
  backgroundArtEnabled: boolean;
  backgroundArtBlend: number;
  hiddenModulesEnabled: boolean;
  hiddenModuleRatio: number;
  decorativeDotsEnabled: boolean;
  accentColor: string;
  neonGlowEnabled: boolean;
  neonBackgroundColor: string;
}

export const DEFAULT_QR_CONFIG: QrConfig = {
  content: 'https://qrfusion.io',
  size: 400,
  style: 'SQUARE',
  colorMode: 'SOLID',
  finderStyle: 'CLASSIC',
  logoShape: 'SQUARE',
  logoPosition: 'CENTER',
  logoSizeRatio: 0.20,
  safetyZone: true,
  transparentLogoBackground: false,
  logoBorderColor: '#FFFFFF',
  logoBorderTransparent: false,
  exportScale: 'X1',
  format: 'PNG',
  backgroundOpacity: 0.30,
  blendMode: 'NORMAL',
  frameStyle: 'NONE',
  frameCaptionEnabled: true,
  frameCaptionText: 'SCAN ME',
  frameCaptionPosition: 'TOP',
  frameCaptionSize: 24,
  frameCaptionFont: 'INTER',
  glassPlateTransparent: false,
  artFusionEnabled: false,
  artFusionMode: 'MASK',
  patternStyle: 'NONE',
  patternColor: '#000000',
  patternSize: 3,
  patternSpacing: 10,
  frameDelayMs: 150,
  frameColor: '#0F4C81',
  frameCaptionTextColor: '#0F172A',
  foregroundColor: '#0F4C81',
  backgroundColor: '#FFFFFF',
  startColor: '#0F4C81',
  endColor: '#4FA3FF',
  backgroundArtEnabled: false,
  backgroundArtBlend: 0.55,
  hiddenModulesEnabled: false,
  hiddenModuleRatio: 0.12,
  decorativeDotsEnabled: false,
  accentColor: '#F4B942',
  neonGlowEnabled: false,
  neonBackgroundColor: '#0A0A14',
};

export interface QrTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Popular' | 'Business' | 'Creative' | 'Tech' | 'Minimal';
  glowColor?: string;
  config: Partial<QrConfig>;
}
