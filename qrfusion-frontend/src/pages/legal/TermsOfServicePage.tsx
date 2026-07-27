import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { FileText, ShieldAlert, Scale, Copyright, Mail, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0A1420] text-[#F1F5F9] flex flex-col selection:bg-primary/30">
      {/* Header Taskbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Page Hero Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#4A9AFA]/40 bg-[#4A9AFA]/10 text-xs font-bold uppercase tracking-widest text-[#4A9AFA]">
            <Scale className="h-3.5 w-3.5" />
            <span>TERMS & CONDITIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F1F5F9] tracking-tight">
            Terms of <span className="text-[#4A9AFA]">Service</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Rules, permitted uses, and licensing agreements governing your access to the QRFusion web application and rendering engine.
          </p>

          <p className="text-xs text-[#64748B]/80 font-mono pt-1">
            Effective Date: July 28, 2026
          </p>
        </div>

        {/* Content Panel */}
        <div className="border border-white/10 rounded-2xl bg-[#101D2E] p-6 sm:p-10 shadow-2xl space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-[#F1F5F9]">
              <div className="w-8 h-8 rounded-lg bg-[#4A9AFA]/10 border border-[#4A9AFA]/30 flex items-center justify-center text-[#4A9AFA]">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">1. Acceptance of Terms</h2>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed pl-11">
              By accessing, browsing, or using the QRFusion web application, API endpoints, or rendering engines, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-[#F1F5F9]">
              <div className="w-8 h-8 rounded-lg bg-[#4A9AFA]/10 border border-[#4A9AFA]/30 flex items-center justify-center text-[#4A9AFA]">
                <Copyright className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">2. Source-Available License Terms</h2>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed pl-11">
              QRFusion is source-available software governed by the <strong className="text-[#F1F5F9]">QRFusion Source-Available Non-Commercial License</strong> (Copyright © 2026 Bhoomin Patel):
            </p>
            <div className="pl-11 space-y-2 text-sm text-[#94A3B8]">
              <div className="p-4 rounded-xl border border-[#4A9AFA]/30 bg-[#4A9AFA]/5 space-y-2">
                <p className="text-[#F1F5F9] font-medium">
                  ✅ Permitted Uses:
                </p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  You may view, study, fork, and modify QRFusion for personal, educational, research, and non-commercial project purposes.
                </p>
                <p className="text-[#F87171] font-medium pt-2">
                  ❌ Prohibited Uses:
                </p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Commercial use, resale, paid SaaS hosting, commercial integration, rebranding, or removing author copyright notices without prior written permission from Bhoomin Patel is strictly prohibited.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-[#F1F5F9]">
              <div className="w-8 h-8 rounded-lg bg-[#4A9AFA]/10 border border-[#4A9AFA]/30 flex items-center justify-center text-[#4A9AFA]">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">3. Acceptable Use & Prohibited Conduct</h2>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed pl-11">
              You agree not to use QRFusion to generate QR codes that encode:
            </p>
            <ul className="space-y-2 text-sm text-[#94A3B8] pl-16 list-disc">
              <li>Phishing links, malware downloads, or deceptive content.</li>
              <li>Illegal, harassing, or harmful material.</li>
              <li>Automated denial-of-service traffic intended to disrupt backend servers.</li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-[#F1F5F9]">
              <div className="w-8 h-8 rounded-lg bg-[#4A9AFA]/10 border border-[#4A9AFA]/30 flex items-center justify-center text-[#4A9AFA]">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">4. Disclaimer of Warranty & Liability</h2>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed pl-11">
              QRFusion is provided <strong className="text-[#F1F5F9]">"AS IS"</strong> without warranty of any kind. While our graphics engines calculate Error Correction Code (ECC) headroom and safety zones, users are advised to test-scan generated QR codes prior to commercial print runs.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-[#F1F5F9]">
              <div className="w-8 h-8 rounded-lg bg-[#4A9AFA]/10 border border-[#4A9AFA]/30 flex items-center justify-center text-[#4A9AFA]">
                <Mail className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold font-heading">5. Commercial Inquiries & Contact</h2>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed pl-11">
              For commercial licensing inquiries or permission to integrate QRFusion into paid products:
            </p>
            <div className="pl-11 pt-2">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0A1420] text-sm text-[#F1F5F9] inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#4A9AFA]" />
                <span>Email Bhoomin Patel: <strong className="text-[#4A9AFA]">patelbhoomin345@gmail.com</strong></span>
              </div>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link to="/" className="text-xs text-[#64748B] hover:text-[#4A9AFA] transition-colors">
            ← Return to QRFusion Home
          </Link>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
