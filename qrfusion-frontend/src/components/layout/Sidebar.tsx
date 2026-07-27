import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { getCurrentUser, UserDto } from '../../lib/api/auth';
import {
  LayoutDashboard,
  QrCode,
  Sliders,
  BarChart3,
  DownloadCloud,
  User,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation();
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUser(u);
    });

    const handleUserUpdate = (e: any) => {
      if (e.detail) setUser(e.detail);
    };

    window.addEventListener('qrfusion_user_updated', handleUserUpdate);
    return () => window.removeEventListener('qrfusion_user_updated', handleUserUpdate);
  }, []);

  const mainNav = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'QR Generator', href: '/generator', icon: QrCode },
    { label: 'Analytics', href: '/dashboard#analytics', icon: BarChart3 },
    { label: 'Downloads', href: '/dashboard#downloads', icon: DownloadCloud },
  ];

  const settingsNav = [
    { label: 'Preferences', href: '/settings', icon: Sliders },
    { label: 'Account', href: '/settings', icon: User },
  ];

  return (
    <aside className={`w-64 border-r border-border bg-surface flex flex-col justify-between p-4 shrink-0 h-screen sticky top-0 ${className}`}>
      <div className="space-y-6">
        {/* Brand Logo - Clean without button wrapper */}
        <div className="px-2 pt-2 pb-1">
          <Logo variant="lockup" badgeOnDark={false} />
        </div>

        {/* Main Nav Section */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2">
            Workspace
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:text-secondary font-bold'
                    : 'text-text-secondary hover:text-text hover:bg-bg'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Settings Nav Section */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2">
            Settings & Profile
          </div>
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:text-secondary font-bold'
                    : 'text-text-secondary hover:text-text hover:bg-bg'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile Card Footer */}
      <Link
        to="/settings"
        className="p-3 rounded-xl bg-bg hover:bg-bg/80 border border-border/80 text-xs text-text-secondary flex items-center justify-between transition-colors group cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover object-center" />
            ) : (
              <span className="text-xs font-bold text-primary dark:text-secondary">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text truncate max-w-[110px] text-xs">
              {user?.name || 'Account'}
            </p>
            <p className="text-[10px] text-text-secondary truncate max-w-[110px]">
              {user?.email || 'Profile settings'}
            </p>
          </div>
        </div>
        <Sliders className="h-4 w-4 text-text-secondary group-hover:text-primary dark:group-hover:text-secondary transition-colors shrink-0" />
      </Link>
    </aside>
  );
}
