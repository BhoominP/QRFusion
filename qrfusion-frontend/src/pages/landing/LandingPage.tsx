import { Navbar } from '../../components/layout/Navbar';
import { HeroSection } from './sections/HeroSection';
import { WaveDivider } from '../../components/brand/WaveDivider';
import { FeatureGrid } from './sections/FeatureGrid';
import { LiveDemoSection } from './sections/LiveDemoSection';
import { TemplateGallery } from './sections/TemplateGallery';
import { PricingSection } from './sections/PricingSection';
import { FaqSection } from './sections/FaqSection';
import { Footer } from '../../components/layout/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-secondary/30">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <WaveDivider />
        <FeatureGrid />
        <LiveDemoSection />
        <TemplateGallery />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
