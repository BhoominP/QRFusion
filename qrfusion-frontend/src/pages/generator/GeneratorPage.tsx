import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useQrConfig } from '../../hooks/useQrConfig';
import { useDebouncedPreview } from '../../hooks/useDebouncedPreview';
import { ControlsPanel } from './panels/ControlsPanel';
import { PreviewPanel } from './panels/PreviewPanel';
import { checkHealthApi } from '../../lib/api/qr';
import { recordDownload, saveQrCode } from '../../lib/api/dashboard';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export function GeneratorPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('content');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    let isMounted = true;
    checkHealthApi()
      .then(() => {
        if (isMounted) setBackendStatus('connected');
      })
      .catch(() => {
        if (isMounted) setBackendStatus('error');
      });
    return () => { isMounted = false; };
  }, []);

  const {
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
  } = useQrConfig();

  // Load template from URL query if present (e.g. ?template=template-ocean-gradient)
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [searchParams]);

  // Hook connecting directly to backend API with debounced calls, AbortController & fieldErrors
  const { result, isGenerating, error, fieldErrors } = useDebouncedPreview(
    config,
    logoFile,
    backgroundArtFile,
    frameBackgroundFile,
    350
  );

  const handleDownload = async () => {
    if (!result) return;
    const a = document.createElement('a');
    const url = result.blobUrl || result.objectUrl;
    a.href = url;

    const extension = config.format.toLowerCase();
    a.download = `qrfusion-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Track activity in cloud database if user is logged in
    const token = localStorage.getItem('qrfusion_token');
    if (token) {
      try {
        const qrName = config.text ? (config.text.length > 25 ? config.text.slice(0, 22) + '...' : config.text) : 'Custom QR Code';
        
        const saved = await saveQrCode({
          name: qrName,
          content: config.text || 'https://qrfusion.io',
          format: config.format,
          renderOptions: JSON.stringify(config),
        });

        await recordDownload({
          savedQrCodeId: saved ? Number(saved.id) : undefined,
          qrName,
          format: config.format,
          resolution: `${config.size}x${config.size}`,
          fileSize: '1.2 MB',
        });
      } catch (err) {
        console.warn('Guest download completed locally:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-secondary/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-border">|</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                STUDIO GENERATOR
              </span>
              <Badge variant={backendStatus === 'connected' ? 'secondary' : backendStatus === 'checking' ? 'outline' : 'danger'}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                  backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : backendStatus === 'checking' ? 'bg-amber-500 animate-ping' : 'bg-rose-500'
                }`} />
                {backendStatus === 'connected' ? 'Spring Boot: Online' : backendStatus === 'checking' ? 'Connecting...' : 'Backend: Offline'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text mt-1">
              Custom QR Studio & Vector Painter
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={resetConfig}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Reset Config
            </Button>
          </div>
        </div>

        {/* Responsive Two-Panel Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Preview Column (Order 1 on mobile <lg, Order 2 on desktop >=lg) */}
          <div className="order-1 lg:order-2 lg:col-span-5 w-full">
            <PreviewPanel
              config={config}
              result={result}
              isGenerating={isGenerating}
              error={error}
              fieldErrors={fieldErrors}
              onDownload={handleDownload}
            />
          </div>

          {/* Left Controls Column (Order 2 on mobile <lg, Order 1 on desktop >=lg) */}
          <div className="order-2 lg:order-1 lg:col-span-7 w-full space-y-6">
            <ControlsPanel
              config={config}
              updateConfig={updateConfig}
              logoFile={logoFile}
              setLogoFile={setLogoFile}
              backgroundArtFile={backgroundArtFile}
              setBackgroundArtFile={setBackgroundArtFile}
              frameBackgroundFile={frameBackgroundFile}
              setFrameBackgroundFile={setFrameBackgroundFile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onDownload={handleDownload}
              isGenerating={isGenerating}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
