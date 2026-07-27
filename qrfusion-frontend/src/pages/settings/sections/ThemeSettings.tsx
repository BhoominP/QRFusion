import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../../../components/ui/Card';
import { Label } from '../../../components/ui/Label';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean bright ocean surface background' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep desaturated navy water background' },
    { id: 'system', label: 'System Default', icon: Monitor, desc: 'Follows operating system dark mode setting' },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold font-heading text-text">Theme & Visual Mode</h3>
        <p className="text-xs text-text-secondary">Customize appearance across all QRFusion app shell pages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => setTheme(opt.id as any)}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary dark:text-secondary shadow-md'
                  : 'border-border bg-surface text-text hover:bg-bg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-surface border border-border/80 inline-flex items-center justify-center">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                {isSelected && <Check className="h-5 w-5 text-primary dark:text-secondary" strokeWidth={2} />}
              </div>

              <div>
                <h4 className="text-sm font-bold font-heading">{opt.label}</h4>
                <p className="text-xs text-text-secondary mt-1">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
