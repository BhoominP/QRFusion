import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { QrConfig } from '../../../types/qr';
import { NavTabs, TabItem } from '../../../components/ui/NavTabs';
import { ContentPanel } from './ContentPanel';
import { QrStylePicker } from '../../../components/qr/QrStylePicker';
import { QrColorPicker } from '../../../components/qr/QrColorPicker';
import { QrLogoUploader } from '../../../components/qr/QrLogoUploader';
import { QrFramePicker } from '../../../components/qr/QrFramePicker';
import { QrExportPanel } from '../../../components/qr/QrExportPanel';
import { ArtFusionPanel } from './ArtFusionPanel';
import { Type, Shapes, Palette, Image as ImageIcon, Square, Download, Sparkles } from 'lucide-react';

export interface ControlsPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  backgroundArtFile: File | null;
  setBackgroundArtFile: (file: File | null) => void;
  frameBackgroundFile?: File | null;
  setFrameBackgroundFile?: (file: File | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownload: () => void;
  isGenerating?: boolean;
}

export function ControlsPanel({
  config,
  updateConfig,
  logoFile,
  setLogoFile,
  backgroundArtFile,
  setBackgroundArtFile,
  frameBackgroundFile,
  setFrameBackgroundFile,
  activeTab,
  setActiveTab,
  onDownload,
  isGenerating = false,
}: ControlsPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  const tabs: TabItem[] = [
    { id: 'content', label: 'Content', icon: <Type className="h-4 w-4" strokeWidth={1.5} /> },
    { id: 'style', label: 'Style', icon: <Shapes className="h-4 w-4" strokeWidth={1.5} /> },
    { id: 'art', label: 'Art Fusion', icon: <Sparkles className="h-4 w-4 text-amber-400" strokeWidth={1.5} /> },
    { id: 'color', label: 'Color', icon: <Palette className="h-4 w-4" strokeWidth={1.5} /> },
    { id: 'logo', label: 'Logo', icon: <ImageIcon className="h-4 w-4" strokeWidth={1.5} /> },
    { id: 'frame', label: 'Frame', icon: <Square className="h-4 w-4" strokeWidth={1.5} /> },
    { id: 'export', label: 'Export', icon: <Download className="h-4 w-4" strokeWidth={1.5} /> },
  ];

  const tabTransition = shouldReduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.18, ease: 'easeOut' },
      };

  return (
    <div className="space-y-6">
      {/* Horizontally scrollable Tabs header */}
      <NavTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panel Content Box */}
      <div className="p-6 rounded-2xl border border-border bg-surface shadow-xs">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} {...tabTransition}>
            {activeTab === 'content' && (
              <ContentPanel config={config} updateConfig={updateConfig} />
            )}
            {activeTab === 'style' && (
              <QrStylePicker config={config} updateConfig={updateConfig} />
            )}
            {activeTab === 'art' && (
              <ArtFusionPanel
                config={config}
                updateConfig={updateConfig}
                backgroundArtFile={backgroundArtFile}
                setBackgroundArtFile={setBackgroundArtFile}
              />
            )}
            {activeTab === 'color' && (
              <QrColorPicker config={config} updateConfig={updateConfig} />
            )}
            {activeTab === 'logo' && (
              <QrLogoUploader
                config={config}
                updateConfig={updateConfig}
                logoFile={logoFile}
                setLogoFile={setLogoFile}
              />
            )}
            {activeTab === 'frame' && (
              <QrFramePicker
                config={config}
                updateConfig={updateConfig}
                frameBackgroundFile={frameBackgroundFile}
                setFrameBackgroundFile={setFrameBackgroundFile}
              />
            )}
            {activeTab === 'export' && (
              <QrExportPanel
                config={config}
                updateConfig={updateConfig}
                onDownload={onDownload}
                isGenerating={isGenerating}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
