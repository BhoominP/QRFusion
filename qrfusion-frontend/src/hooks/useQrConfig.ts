import { useState, useEffect } from 'react';
import { QrConfig, DEFAULT_QR_CONFIG } from '../types/qr';
import { FEATURED_TEMPLATES } from '../lib/constants';

export function useQrConfig(initialConfig: Partial<QrConfig> = {}) {
  const [config, setConfig] = useState<QrConfig>({
    ...DEFAULT_QR_CONFIG,
    ...initialConfig,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundArtFile, setBackgroundArtFile] = useState<File | null>(null);
  const [frameBackgroundFile, setFrameBackgroundFile] = useState<File | null>(null);

  useEffect(() => {
    const editConfigStr = sessionStorage.getItem('qrfusion_edit_config');
    if (editConfigStr) {
      try {
        const editConfig = JSON.parse(editConfigStr);
        setConfig((prev) => ({
          ...prev,
          ...editConfig,
        }));
      } catch (e) {
        console.warn('Failed to restore edit config from sessionStorage:', e);
      } finally {
        sessionStorage.removeItem('qrfusion_edit_config');
      }
    }
  }, []);

  const updateConfig = (updates: Partial<QrConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_QR_CONFIG);
    setLogoFile(null);
    setBackgroundArtFile(null);
    setFrameBackgroundFile(null);
  };

  const loadTemplate = (templateId: string) => {
    const tmpl = FEATURED_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setConfig((prev) => ({
        ...prev,
        ...tmpl.config,
      }));
    }
  };

  return {
    config,
    updateConfig,
    resetConfig,
    loadTemplate,
    logoFile,
    setLogoFile,
    backgroundArtFile,
    setBackgroundArtFile,
    frameBackgroundFile,
    setFrameBackgroundFile,
  };
}
