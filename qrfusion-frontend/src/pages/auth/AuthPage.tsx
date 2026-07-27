import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Logo } from '../../components/brand/Logo';
import { GlassPanel } from '../../components/brand/GlassPanel';
import { CompassNeedleIllustration } from '../../components/brand/illustrations/CompassNeedleIllustration';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Checkbox } from '../../components/ui/Checkbox';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { apiFetch } from '../../lib/api/client';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // Password Visibility Toggles
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error & Loading States
  const [signInErrors, setSignInErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [signUpErrors, setSignUpErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Handler & Client-side Validation
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string; general?: string } = {};

    if (!signInEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(signInEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!signInPassword) {
      errors.password = 'Password is required.';
    } else if (signInPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setSignInErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      apiFetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem('qrfusion_token', data.token);
            navigate('/dashboard');
          }
        })
        .catch((err) => {
          setSignInErrors({ general: err.message || 'Authentication failed.' });
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  // Sign Up Handler & Client-side Validation
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
      general?: string;
    } = {};

    if (!signUpName.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!signUpEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!signUpPassword) {
      errors.password = 'Password is required.';
    } else if (signUpPassword.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!signUpConfirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (signUpPassword !== signUpConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the Terms and Privacy Policy to create an account.';
    }

    setSignUpErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      apiFetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signUpName, email: signUpEmail, password: signUpPassword }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem('qrfusion_token', data.token);
            navigate('/dashboard');
          }
        })
        .catch((err) => {
          setSignUpErrors({ general: err.message || 'Registration failed.' });
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  // Google Credential Callback Handler
  const handleGoogleCredential = async (idToken: string) => {
    setIsSubmitting(true);
    try {
      const response = await apiFetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('qrfusion_token', data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (activeTab === 'signin') {
        setSignInErrors({ general: err.message || 'Google authentication failed.' });
      } else {
        setSignUpErrors({ general: err.message || 'Google authentication failed.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40">
        <div className="inline-block">
          <Logo variant="lockup" />
        </div>

        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
          
          {/* Left Column: Form Panel */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-md w-full mx-auto py-4">
            
            {/* Sign in / Sign up Tab Toggle */}
            <div className="flex bg-surface/80 p-1.5 rounded-2xl border border-border/80 mb-8 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-primary text-white shadow-md dark:bg-secondary dark:text-slate-950'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-primary text-white shadow-md dark:bg-secondary dark:text-slate-950'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Form Cross-fade Animation Container */}
            <AnimatePresence mode="wait">
              {activeTab === 'signin' ? (
                <motion.form
                  key="signin-form"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 6 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text tracking-tight">
                      Welcome back
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Enter your credentials to access your studio dashboard.
                    </p>
                  </div>

                  {/* Banner Error State */}
                  {signInErrors.general && (
                    <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{signInErrors.general}</span>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email">Email address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      error={signInErrors.email}
                      autoComplete="email"
                    />
                  </div>

                  {/* Password Input with Show/Hide Eye Toggle */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        error={signInErrors.password}
                        className="pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-3 text-text-secondary/60 hover:text-text transition-colors cursor-pointer"
                        title={showSignInPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      label="Remember me"
                    />

                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent.'); }} className="text-primary dark:text-secondary hover:underline font-medium">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full shadow-md shadow-primary/20 mt-2"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  onSubmit={handleSignUpSubmit}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text tracking-tight">
                      Create an account
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Start building studio-grade vector & dynamic QR codes.
                    </p>
                  </div>

                  {/* Banner Error State */}
                  {signUpErrors.general && (
                    <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{signUpErrors.general}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name">Full name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Bhoomin Patel"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      error={signUpErrors.name}
                      autoComplete="name"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email">Email address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      error={signUpErrors.email}
                      autoComplete="email"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignUpPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        error={signUpErrors.password}
                        className="pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 top-3 text-text-secondary/60 hover:text-text transition-colors cursor-pointer"
                        title={showSignUpPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm-password">Confirm password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showSignUpConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        error={signUpErrors.confirmPassword}
                        className="pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                        className="absolute right-3 top-3 text-text-secondary/60 hover:text-text transition-colors cursor-pointer"
                        title={showSignUpConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignUpConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <Checkbox
                      id="signup-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      error={signUpErrors.terms}
                      label={
                        <span>
                          I agree to the{' '}
                          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service'); }} className="text-primary dark:text-secondary hover:underline font-medium">
                            Terms
                          </a>{' '}
                          and{' '}
                          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy'); }} className="text-primary dark:text-secondary hover:underline font-medium">
                            Privacy Policy
                          </a>
                        </span>
                      }
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full shadow-md shadow-primary/20 mt-2"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Muted Divider & Official Google Sign-In */}
            <div className="mt-8 pt-6 border-t border-border/60 space-y-4">
              <div className="relative flex items-center justify-center">
                <span className="absolute bg-bg px-3 text-xs text-text-secondary font-medium uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              <div className="flex justify-center pt-2">
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  onError={(msg) => {
                    if (activeTab === 'signin') {
                      setSignInErrors({ general: msg });
                    } else {
                      setSignUpErrors({ general: msg });
                    }
                  }}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Illustration Panel (~45% width on desktop, collapsed strip on mobile) */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-5 h-48 lg:h-auto min-h-[220px] lg:min-h-[540px] flex items-center justify-center"
          >
            <GlassPanel className="w-full h-full p-6 lg:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
              
              {/* Theme-aware Compass Needle Illustration */}
              <div className="w-full max-w-[280px] lg:max-w-[340px] h-32 sm:h-44 lg:h-64 flex items-center justify-center">
                <CompassNeedleIllustration className="h-full" />
              </div>

              {/* Exact Copy Specification */}
              <div className="mt-4 lg:mt-6 space-y-1 max-w-sm">
                <h3 className="font-heading font-bold text-lg text-text">
                  Chart your own course.
                </h3>
                <p className="text-sm text-text-secondary font-normal">
                  Every scan starts with a single, well-made code.
                </p>
              </div>

            </GlassPanel>
          </motion.div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-4 text-center text-xs text-text-secondary border-t border-border/40">
        © {new Date().getFullYear()} QRFusion. All rights reserved.
      </footer>
    </div>
  );
}
