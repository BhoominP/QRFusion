import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What vector formats are supported for professional printing?',
      a: 'QRFusion renders native vector SVG markup and high-resolution PDF bytes directly from the Java backend server. SVG exports scale infinitely without pixelation, making them ideal for billboards, packaging, and high-DPI print media.',
    },
    {
      q: 'How does the logo safety zone prevent scan failures?',
      a: 'When you upload a logo, our render engine reserves a center safety plate while adjusting the QR code error correction level (ECC) to high headroom (Level H, 30% recovery). This ensures the logo does not interfere with optical scanner readability.',
    },
    {
      q: 'Can I generate animated GIF QR codes?',
      a: 'Yes! The backend supports animated GIF exports with custom frame delays (50ms - 2000ms), allowing you to create eye-catching dynamic QR codes for digital signage and social media.',
    },
    {
      q: 'Who built QRFusion?',
      a: 'QRFusion is a solo project built by Bhoomin, a final-year (4th year) Computer Science & Engineering student. It started as a way to explore backend architecture and rendering pipelines in depth, and has grown into a full QR generation platform with custom styling, logo embedding, and export options.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text">
            Everything You Need to Know
          </h2>
          <p className="text-base text-text-secondary">
            Got questions about vector exports, logo safety, or who built QRFusion? We've got answers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="border border-border/80 rounded-2xl bg-surface overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-text hover:bg-bg/50 transition-colors"
                >
                  <span className="text-base font-heading">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-text-secondary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                    strokeWidth={1.5}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border/40 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
