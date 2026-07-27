import { apiFetch } from './client';
import { QrConfig } from '../../types/qr';

export interface GeneratedQrResult {
  blob: Blob;
  blobUrl: string;
  objectUrl: string;
  contentType: string;
  isSvg: boolean;
  svgText?: string;
}

export async function generateQr(
  config: QrConfig,
  logoFile?: File | null,
  backgroundArtFile?: File | null,
  frameBackgroundFile?: File | null,
  signal?: AbortSignal
): Promise<GeneratedQrResult> {
  const endpoint = '/api/v1/qr/generate';
  let response: Response;

  if (logoFile || backgroundArtFile || frameBackgroundFile) {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(config)], {
      type: 'application/json',
    });
    formData.append('request', jsonBlob);

    if (logoFile) {
      formData.append('logo', logoFile);
    }
    if (backgroundArtFile) {
      formData.append('backgroundArt', backgroundArtFile);
    }
    if (frameBackgroundFile) {
      formData.append('frameBackground', frameBackgroundFile);
    }

    response = await apiFetch(endpoint, {
      method: 'POST',
      body: formData,
      signal,
    });
  } else {
    response = await apiFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
      signal,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const isSvg = config.format === 'SVG' || contentType.includes('svg');

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  let svgText: string | undefined;
  if (isSvg) {
    svgText = await blob.text();
  }

  return {
    blob,
    blobUrl,
    objectUrl: blobUrl,
    contentType,
    isSvg,
    svgText,
  };
}

export const generateQrApi = generateQr;
export const generateQrWithFiles = (
  config: QrConfig,
  files: { logo?: File | null; background?: File | null; frameBackground?: File | null },
  signal?: AbortSignal
) => generateQr(config, files.logo, files.background, files.frameBackground, signal);

export interface HealthCheckResult {
  status: string;
  service: string;
  version: string;
  timestamp: number;
}

export async function checkHealthApi(signal?: AbortSignal): Promise<HealthCheckResult> {
  const response = await apiFetch('/api/v1/qr/health', { signal });
  return response.json();
}
