import React from 'react';
import { FEATURED_TEMPLATES } from '../../../lib/constants';
import { TemplateCard } from './TemplateCard';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function TemplateGallery() {
  return (
    <section id="templates" className="py-24 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              CURATED DESIGN PRESETS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text tracking-tight">
              Preset Template Gallery
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              Start with expertly curated combinations of module geometries, eye finders, color harmonies, and decorative frames.
            </p>
          </div>

          <Link to="/generator" className="shrink-0">
            <Button variant="outline" size="md" className="group">
              <span>Open Blank Studio</span>
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* 6 Template Cards Grid - Featured Popular template spans col-span-2 on md/lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {FEATURED_TEMPLATES.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              isPopular={tmpl.category === 'Popular'}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
