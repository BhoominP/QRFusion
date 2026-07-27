import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { Switch } from '../../../components/ui/Switch';

export function QualitySettings() {
  const [defaultFormat, setDefaultFormat] = useState('PNG');
  const [defaultScale, setDefaultScale] = useState('X2');
  const [eccProtection, setEccProtection] = useState(true);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold font-heading text-text">Default Export Quality & Standards</h3>
        <p className="text-xs text-text-secondary">Configure studio defaults for new QR codes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Default Export File Format</Label>
          <Select
            value={defaultFormat}
            onChange={(e) => setDefaultFormat(e.target.value)}
            options={[
              { label: 'PNG Image', value: 'PNG' },
              { label: 'SVG Vector', value: 'SVG' },
              { label: 'PDF Document', value: 'PDF' },
              { label: 'Animated GIF', value: 'GIF' },
            ]}
          />
        </div>

        <div className="space-y-2">
          <Label>Default Resolution Scale</Label>
          <Select
            value={defaultScale}
            onChange={(e) => setDefaultScale(e.target.value)}
            options={[
              { label: '1x (Standard 400px)', value: 'X1' },
              { label: '2x (HD 800px)', value: 'X2' },
              { label: '4x (Ultra HD 1600px)', value: 'X4' },
              { label: '8x (Print 3200px)', value: 'X8' },
            ]}
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border/80 bg-bg/50 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-text">Automatic Level H Error Correction</span>
          <p className="text-xs text-text-secondary">Enforces 30% ECC recovery headroom for all custom logo embeds</p>
        </div>
        <Switch checked={eccProtection} onCheckedChange={setEccProtection} />
      </div>
    </Card>
  );
}
