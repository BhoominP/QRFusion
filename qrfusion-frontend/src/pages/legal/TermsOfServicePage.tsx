import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-primary/30 transition-colors">
      {/* Header Taskbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary">
            <Scale className="h-3.5 w-3.5" />
            <span>TERMS & LICENSING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-text tracking-tight">
            Terms of <span className="text-primary">Service</span>
          </h1>

          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using QRFusion. By accessing or using our services, you agree to be bound by these terms.
          </p>

          <p className="text-xs text-text-secondary/80 font-mono pt-1">
            Effective Date: July 28, 2026
          </p>
        </div>

        {/* Content Panel */}
        <div className="border border-border rounded-2xl bg-surface p-6 sm:p-10 shadow-2xl space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">1. Acceptance of Terms</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              By accessing QRFusion, creating an account, or rendering QR assets, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <hr className="border-border" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">2. Permitted & Educational Use</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              QRFusion is released under a custom Source-Available license:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary pl-16 list-disc">
              <li><strong className="text-text">Permitted:</strong> Educational use, personal projects, portfolio reference, academic review, and non-commercial modifications.</li>
              <li><strong className="text-text">Prohibited:</strong> Commercial exploitation, paid SaaS redistribution, selling modified copies, or removing author copyright notices.</li>
            </ul>
          </section>

          <hr className="border-border" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">3. Acceptable Content Policy</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              Users agree not to generate QR codes pointing to malicious URLs, phishing domains, malware downloads, or illegal content. We reserve the right to suspend accounts violating this policy.
            </p>
          </section>

          <hr className="border-border" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">4. Disclaimer & Limitation of Liability</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              QRFusion is provided "as is" without warranty of any kind. While we maintain high availability and accurate vector rendering, we are not liable for any damages resulting from service interruptions or misprinted codes.
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link to="/" className="text-xs text-text-secondary hover:text-primary transition-colors">
            ← Return to QRFusion Home
          </Link>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
