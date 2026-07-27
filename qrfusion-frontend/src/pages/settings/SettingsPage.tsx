import { PageContainer } from '../../components/layout/PageContainer';
import { ThemeSettings } from './sections/ThemeSettings';
import { QualitySettings } from './sections/QualitySettings';
import { AccountSettings } from './sections/AccountSettings';
import { Logo } from '../../components/brand/Logo';

export function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2 border-b border-border/80">
          <Logo variant="compact" badgeOnDark={false} className="h-10 w-10 shrink-0" />
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-text">Workspace Settings</h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your theme, export quality defaults, and account preferences.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <ThemeSettings />
          <QualitySettings />
          <AccountSettings />
        </div>
      </div>
    </PageContainer>
  );
}
