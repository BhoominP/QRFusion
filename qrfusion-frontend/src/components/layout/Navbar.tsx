import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { SpotlightNavItem } from './SpotlightNavItem';
import { getCurrentUser, UserDto } from '../../lib/api/auth';
import logo4 from '../../assets/QrFusion_logo_4.svg';
import { Sun, Moon, Monitor, Menu, X, LayoutDashboard, QrCode, User, LogOut, ChevronDown, Home, Sliders, Mail } from 'lucide-react';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);
  
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';
  const isGeneratorPage = location.pathname.startsWith('/generator');
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isSettingsPage = location.pathname.startsWith('/settings');
  const isContactPage = location.pathname === '/contact';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 15);

      if (currentScrollY <= 15) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling DOWN: move navbar up out of view
        setVisible(false);
        setUserMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP: move navbar back down into view
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
    });

    const handleUserUpdate = (e: any) => {
      if (e.detail) setUser(e.detail);
      else getCurrentUser().then(setUser);
    };

    window.addEventListener('qrfusion_user_updated', handleUserUpdate);
    return () => window.removeEventListener('qrfusion_user_updated', handleUserUpdate);
  }, [location.pathname]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const handleSignOut = () => {
    localStorage.getItem('qrfusion_token') && localStorage.removeItem('qrfusion_token');
    setUser(null);
    setUserMenuOpen(false);
    navigate('/');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4 text-amber-500" strokeWidth={1.5} />;
    if (theme === 'dark') return <Moon className="h-4 w-4 text-secondary" strokeWidth={1.5} />;
    return <Monitor className="h-4 w-4 text-text-secondary" strokeWidth={1.5} />;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-full shadow-none'
      } ${
        scrolled
          ? 'border-b border-primary/20 bg-bg/85 backdrop-blur-2xl shadow-lg shadow-black/40 py-0.5'
          : 'border-b border-border/60 bg-surface-glass backdrop-blur-xl py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - Always visible at top left */}
        <div className="shrink-0 transition-transform hover:scale-[1.02] active:scale-95">
          <div className="hidden sm:block">
            <Logo variant="lockup" badgeOnDark={false} />
          </div>
          <div className="block sm:hidden">
            <Logo variant="icon" badgeOnDark={false} />
          </div>
        </div>

        {/* Desktop Navigation Links Pill Container - Unified Style Across Landing & App Pages */}
        {isLandingPage ? (
          <nav className="hidden md:flex items-center gap-1 bg-surface/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-border/80 shadow-xs backdrop-blur-md">
            <SpotlightNavItem href="#features" label="Features" />
            <SpotlightNavItem href="#demo" label="Live Demo" />
            <SpotlightNavItem href="#templates" label="Templates" />
            <SpotlightNavItem href="#faq" label="FAQ" />
            <SpotlightNavItem to="/contact" icon={Mail} label="Contact" isActive={isContactPage} />
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-1 bg-surface/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-border/80 shadow-xs backdrop-blur-md">
            <SpotlightNavItem to="/" icon={Home} label="Home" isActive={isLandingPage} />
            <SpotlightNavItem to="/generator" icon={QrCode} label="Generator" isActive={isGeneratorPage} />
            {user && (
              <>
                <SpotlightNavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" isActive={isDashboardPage} />
                <SpotlightNavItem to="/settings" icon={Sliders} label="Settings" isActive={isSettingsPage} />
              </>
            )}
            <SpotlightNavItem to="/contact" icon={Mail} label="Contact" isActive={isContactPage} />
          </nav>
        )}

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Current theme: ${theme}. Click to switch.`}
            className="rounded-full hover:bg-surface/80 border border-border/40"
          >
            {getThemeIcon()}
          </Button>

          {/* User Profile Pill or Sign In Button */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-bg transition-all cursor-pointer shadow-xs hover:border-primary/40"
              >
                <div className="w-6 h-6 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover object-center" />
                  ) : (
                    <span className="text-[11px] font-bold text-primary dark:text-secondary">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-text max-w-[110px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-surface shadow-2xl p-1.5 space-y-1 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-border/60 mb-1">
                    <p className="text-xs font-bold text-text truncate">{user.name}</p>
                    <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text hover:bg-bg rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary dark:text-secondary" />
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text hover:bg-bg rounded-xl transition-colors"
                  >
                    <User className="h-4 w-4 text-primary dark:text-secondary" />
                    Account & Profile
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text hover:bg-bg rounded-xl transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary dark:text-secondary" />
                    Contact Support
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="primary" size="sm" className="shadow-sm shadow-primary/20 rounded-full px-4">
                Sign in / Sign up
              </Button>
            </Link>
          )}

          {/* Open Generator Button with animated QrFusion_logo_4.svg */}
          {!isGeneratorPage && (
            <Link to="/generator">
              <Button variant="outline" size="sm" className="rounded-full gap-2 group border-primary/40 hover:border-primary/80 bg-surface/80 hover:bg-primary/10 transition-all shadow-xs hover:shadow-md hover:shadow-primary/20">
                <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping opacity-75" />
                  <img
                    src={logo4}
                    alt="QRFusion Logo"
                    className="w-4 h-4 object-contain relative z-10 transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-[360deg] drop-shadow-[0_0_8px_rgba(248,188,73,0.85)]"
                  />
                </div>
                <span>Open Generator</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {getThemeIcon()}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="rounded-full"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3 shadow-xl backdrop-blur-xl">
          {isLandingPage && (
            <nav className="flex flex-col space-y-2 text-sm font-medium text-text-secondary">
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-border/30 hover:text-text transition-colors"
              >
                Features
              </a>
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-border/30 hover:text-text transition-colors"
              >
                Live Demo
              </a>
              <a
                href="#templates"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-border/30 hover:text-text transition-colors"
              >
                Templates
              </a>
              <a
                href="#faq"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-border/30 hover:text-text transition-colors"
              >
                FAQ
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-border/30 hover:text-text transition-colors font-semibold text-primary"
              >
                Contact Us
              </Link>
            </nav>
          )}

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Sliders className="h-4 w-4" strokeWidth={1.5} />
                    Settings
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                    Contact Support
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full justify-start rounded-xl">
                    Sign in / Sign up
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                    Contact Us
                  </Button>
                </Link>
              </>
            )}

            {!isGeneratorPage && (
              <Link to="/generator" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full justify-start rounded-xl gap-2.5 group">
                  <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping opacity-75" />
                    <img
                      src={logo4}
                      alt="QRFusion Logo"
                      className="w-4 h-4 object-contain relative z-10 transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-[360deg] drop-shadow-[0_0_8px_rgba(248,188,73,0.85)]"
                    />
                  </div>
                  <span>Open Generator</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
