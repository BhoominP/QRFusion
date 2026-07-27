import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
  onError?: (msg: string) => void;
}

export function GoogleSignInButton({ onCredential, onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');

  useEffect(() => {
    let checkInterval: any;
    let attempts = 0;
    const MAX_ATTEMPTS = 15; // ~4.5s at 300ms intervals

    const initGoogleButton = () => {
      if (!window.google || !buttonRef.current) return false;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error('VITE_GOOGLE_CLIENT_ID is not configured.');
        setStatus('unavailable');
        return true; // stop polling, this won't resolve itself
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              onCredential(response.credential);
            } else if (onError) {
              onError('Google authentication returned no credentials.');
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          shape: 'pill',
        });

        setStatus('ready');
        return true;
      } catch (err: any) {
        console.warn('Google Identity Services render warning:', err);
        return false;
      }
    };

    if (!initGoogleButton()) {
      checkInterval = setInterval(() => {
        attempts += 1;
        if (initGoogleButton() || attempts >= MAX_ATTEMPTS) {
          clearInterval(checkInterval);
          if (attempts >= MAX_ATTEMPTS) setStatus('unavailable');
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [onCredential, onError]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={buttonRef}
        className={status === 'ready' ? 'min-h-[44px] flex items-center justify-center' : 'hidden'}
      />

      {status === 'unavailable' && (
        <p className="text-xs text-text-muted text-center max-w-[320px]">
          Google Sign-In couldn't load — this can happen with an ad-blocker or privacy
          extension enabled. Try disabling it for this site, or sign in with email instead.
        </p>
      )}
    </div>
  );
}