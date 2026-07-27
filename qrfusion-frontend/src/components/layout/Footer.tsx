import { Logo } from '../brand/Logo';
import { HorizonLine } from '../brand/HorizonLine';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border pt-12 pb-8 overflow-hidden">
      {/* Echoed Horizon Line at top of footer */}
      <div className="absolute top-0 left-0 right-0">
        <HorizonLine flip />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Logo variant="lockup" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Craft high-performance, studio-grade custom QR codes with precision vector rendering, custom finder styles, embedded brand logos, and animated exports.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/generator" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors">
                  QR Studio Generator
                </Link>
              </li>
              <li>
                <a href="#templates" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors">
                  Template Gallery
                </a>
              </li>
              <li>
                <a href="#features" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors">
                  Design Engine Features
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors">
                  Analytics & Scan History
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developers & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Developers & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors font-medium">
                  Contact Developer / Support
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors">
                  Workspace Settings
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-text-secondary hover:text-primary dark:hover:text-secondary transition-colors">
                  Spring Boot Backend Specs
                </a>
              </li>
              <li>
                <span className="text-text-secondary/60 cursor-not-allowed">SDK & Webhooks (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quality & Safety */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Quality & Safety</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-text-secondary">ISO/IEC 18004 Compliant</li>
              <li className="text-text-secondary">Automated ECC Headroom Safety</li>
              <li className="text-text-secondary">Vector SVG & Print PDF Export</li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-4">
          <p>© {new Date().getFullYear()} QRFusion Inc. All rights reserved. Ocean & Navigation inspired design engine.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:underline text-primary">Contact Us</Link>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
