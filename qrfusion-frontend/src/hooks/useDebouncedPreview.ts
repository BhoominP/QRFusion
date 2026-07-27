import { useEffect, useState, useRef } from 'react';
import { QrConfig } from '../types/qr';
import { generateQr, GeneratedQrResult } from '../lib/api/qr';
import { ApiError } from '../lib/api/client';

export function useDebouncedPreview(
  config: QrConfig,
  logoFile: File | null,
  backgroundArtFile: File | null,
  frameBackgroundFile: File | null,
  delayMs = 350
) {
  const [result, setResult] = useState<GeneratedQrResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);

  const prevObjectUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsGenerating(true);

    const timer = setTimeout(async () => {
      // Abort previous in-flight request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // For live canvas <img> element preview, if format is PDF, override preview format to PNG
        // so the browser renders a crisp image preview without broken PDF image icons.
        const previewConfig = config.format === 'PDF' ? { ...config, format: 'PNG' as const } : config;

        const res = await generateQr(
          previewConfig,
          logoFile,
          backgroundArtFile,
          frameBackgroundFile,
          controller.signal
        );

        // Revoke previous object URL to avoid memory leaks
        if (prevObjectUrlRef.current) {
          URL.revokeObjectURL(prevObjectUrlRef.current);
        }
        prevObjectUrlRef.current = res.blobUrl;

        setResult(res);
        setError(null);
        setFieldErrors(undefined);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return; // Ignore aborted requests
        }
        if (err instanceof ApiError) {
          setError(err.message);
          setFieldErrors(err.fieldErrors);
        } else {
          setError(err?.message || 'Failed to render QR preview from backend.');
          setFieldErrors(undefined);
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setIsGenerating(false);
        }
      }
    }, delayMs);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [config, logoFile, backgroundArtFile, frameBackgroundFile, delayMs]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (prevObjectUrlRef.current) {
        URL.revokeObjectURL(prevObjectUrlRef.current);
      }
    };
  }, []);

  return {
    result,
    isGenerating,
    error,
    fieldErrors,
  };
}
