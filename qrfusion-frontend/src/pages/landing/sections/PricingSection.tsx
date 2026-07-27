import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Switch } from '../../../components/ui/Switch';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for individuals, students, and basic link sharing.',
      features: [
        'PNG & SVG standard export',
        'Basic module shapes & classic finders',
        'Solid background color options',
        'Up to 10 active QR codes',
        'Community support',
      ],
      cta: 'Get Started Free',
      variant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Pro Studio',
      price: annual ? '$12' : '$15',
      period: 'per month',
      description: 'Perfect for businesses, designers, and marketing campaigns.',
      features: [
        'High-res PNG, SVG, PDF & GIF exports',
        'All 5 module shapes & 5 finder eye styles',
        'Linear & Radial gradient painters',
        'Logo embedding with ECC auto-safety',
        'Scan analytics & 1,000 active codes',
        'Priority REST API access',
      ],
      cta: 'Start 14-Day Free Trial',
      variant: 'primary' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: annual ? '$39' : '$49',
      period: 'per month',
      description: 'For high-volume teams requiring API keys and custom branding.',
      features: [
        'Unlimited vector SVG & print PDF exports',
        'Custom background image blending',
        'Dedicated API key rate limits (10,000 req/min)',
        'Team folders & role permissions',
        'Custom domain redirect shortlinks',
        'SLA 99.9% uptime & 24/7 priority support',
      ],
      cta: 'Contact Sales / Upgrade',
      variant: 'outline' as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-surface/50 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text">
            Simple Plans for Every Horizon
          </h2>
          <p className="text-base text-text-secondary">
            No hidden charges. Upgrade or downgrade at any time.
          </p>

          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-sm font-medium ${!annual ? 'text-text' : 'text-text-secondary'}`}>
              Monthly Billing
            </span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={`text-sm font-medium ${annual ? 'text-text' : 'text-text-secondary'}`}>
              Annual Billing <Badge variant="accent" className="ml-1">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col justify-between p-8 space-y-6 relative ${
                tier.popular ? 'border-2 border-primary shadow-xl scale-102 bg-surface' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="accent">MOST POPULAR</Badge>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text font-heading">{tier.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text font-heading">{tier.price}</span>
                  <span className="text-sm text-text-secondary">/{tier.period}</span>
                </div>

                <ul className="space-y-3 text-sm text-text">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-xs sm:text-sm text-text-secondary">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/generator">
                <Button variant={tier.variant} className="w-full">
                  {tier.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
