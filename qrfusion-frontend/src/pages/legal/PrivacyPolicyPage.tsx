import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ShieldCheck, Mail, Lock, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-primary/30 transition-colors">
      {/* Header Taskbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>LEGAL & COMPLIANCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-text tracking-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>

          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Transparent data practices. Understand how QRFusion protects your data, account details, and custom QR designs.
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
                <Eye className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">1. Information We Collect</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              QRFusion is designed with privacy at its core. We collect only the minimum necessary information to provide custom QR code rendering and workspace persistence:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary pl-16 list-disc">
              <li><strong className="text-text">Account Data:</strong> Email address, display name, and encrypted credentials when you register or sign in via Google OAuth.</li>
              <li><strong className="text-text">QR Content Payloads:</strong> Target URLs, text contents, custom colors, logos, and frame configurations required to render your QR codes.</li>
              <li><strong className="text-text">Technical Telemetry:</strong> Aggregated, non-identifiable usage statistics to optimize Java rendering pipeline speeds.</li>
            </ul>
          </section>

          <hr className="border-border" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">2. How We Use Your Information</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              Your data is strictly utilized for core functionality and service delivery:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary pl-16 list-disc">
              <li>Generating high-resolution vector SVG, print PDF, PNG, and multi-frame GIF exports.</li>
              <li>Saving and synchronizing custom QR templates to your personal dashboard.</li>
              <li>Authenticating secure access via JWT tokens and session verification.</li>
              <li>Providing technical assistance when you contact developer support.</li>
            </ul>
          </section>

          <hr className="border-border" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">3. Data Protection & Sharing</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              We <strong className="text-text">never sell, rent, or trade</strong> your personal information or custom QR code data to third parties. All network transmissions are encrypted using standard TLS protocols, and stored credentials are kept securely.
            </p>
          </section>

          <hr className="border-border" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">4. Cookies & Local Storage</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              QRFusion uses browser local storage exclusively for essential features such as preserving your active workspace state, JWT authentication bearer tokens, and dark/light mode UI preferences.
            </p>
          </section>

          <hr className="border-border" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-text">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">5. Your Rights & Contact</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed pl-11">
              You retain full rights to inspect, export, or permanently delete your account and saved QR designs at any time. For questions regarding data privacy:
            </p>
            <div className="pl-11 pt-2">
              <div className="p-4 rounded-xl border border-border bg-bg text-sm text-text inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>Contact Bhoomin Patel: <strong className="text-primary">patelbhoomin345@gmail.com</strong></span>
              </div>
            </div>
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
