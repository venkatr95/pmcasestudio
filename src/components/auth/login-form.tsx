'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { toast } from 'sonner';
import { Globe, Mail, Loader2, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const RESEND_COOLDOWN = 30; // seconds

function StaleSessionModal({
  email,
  onConfirm,
  onCancel,
  loading,
}: {
  email: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-app border border-app rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-app">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-base font-bold text-primary-app">Active Session Detected</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-md text-muted-app hover:text-primary-app hover:bg-app-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-secondary-app leading-relaxed">
            There is already an active session running for{' '}
            <span className="text-primary-app font-semibold">{email}</span>.
          </p>
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-sm text-amber-600 dark:text-amber-400">
            Signing in again will end all existing sessions for this account. Any unsaved work in other tabs may be lost.
          </div>
          <p className="text-sm text-muted-app">
            Do you want to end the previous session and log in here?
          </p>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-app flex gap-3 justify-end bg-app-secondary/30">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-ghost py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-primary py-2 min-w-[160px] justify-center"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Clearing session...</>
            ) : (
              'End Session & Sign In'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showStaleSessionModal, setShowStaleSessionModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'AlreadyRunning') {
      const emailParam = searchParams.get('email') || '';
      setPendingEmail(emailParam);
      setShowStaleSessionModal(true);
      router.replace('/login', { scroll: false });
    } else if (error === 'Verification') {
      toast.error('The authentication code was invalid or expired. Please request a new one.');
      router.replace('/login', { scroll: false });
    }
  }, [searchParams, router]);

  // Countdown timer for resend
  const startCountdown = useCallback(() => {
    setResendCountdown(RESEND_COOLDOWN);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  // Shared send-code logic (used by initial send and resend)
  const sendCode = useCallback(async (targetEmail: string) => {
    const csrfToken = await getCsrfToken();
    const res = await fetch('/api/auth/signin/nodemailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        email: targetEmail,
        csrfToken: csrfToken || '',
        redirect: 'false',
        callbackUrl: `${window.location.origin}/dashboard`
      })
    });
    if (!res.ok) throw new Error('Failed to send email');
  }, []);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading('email');
    try {
      // Check for active session first
      const checkRes = await fetch('/api/auth/check-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (checkRes.ok) {
        const { hasActiveSession } = await checkRes.json();
        if (hasActiveSession) {
          setPendingEmail(email);
          setShowStaleSessionModal(true);
          setLoading(null);
          return;
        }
      }

      await sendCode(email);
      setMagicSent(true);
      startCountdown();
      toast.success('Authentication code sent! Check your email.');
    } catch {
      toast.error('Failed to send code. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleClearSessionAndLogin = async () => {
    const targetEmail = pendingEmail || email;
    if (!targetEmail) {
      setShowStaleSessionModal(false);
      return;
    }
    setLoading('clearing');
    try {
      const res = await fetch('/api/auth/clear-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      if (!res.ok) throw new Error('Failed to clear session');

      setShowStaleSessionModal(false);
      setEmail(targetEmail);
      await sendCode(targetEmail);
      setMagicSent(true);
      startCountdown();
      toast.success('Session cleared! Authentication code sent to your email.');
    } catch {
      toast.error('Failed to clear session. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || loading) return;
    setLoading('resend');
    try {
      setOtp('');
      await sendCode(email);
      startCountdown();
      toast.success('New code sent! Check your email.');
    } catch {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setLoading('verify');
    const absoluteCallbackUrl = `${window.location.origin}/dashboard`;
    window.location.href = `/api/auth/callback/nodemailer?email=${encodeURIComponent(email)}&token=${encodeURIComponent(otp)}&callbackUrl=${encodeURIComponent(absoluteCallbackUrl)}`;
  };

  const handleOAuth = async (provider: 'google') => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <>
      {/* Stale Session Modal */}
      {showStaleSessionModal && (
        <StaleSessionModal
          email={pendingEmail || email}
          loading={loading === 'clearing'}
          onConfirm={handleClearSessionAndLogin}
          onCancel={() => setShowStaleSessionModal(false)}
        />
      )}

      {magicSent ? (
        <form onSubmit={handleVerifyOtp} className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent-subtle-app flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-accent-app" />
          </div>
          <h2 className="text-lg font-semibold text-primary-app mb-2">Check your email</h2>
          <p className="text-sm text-muted-app">
            We sent a 6-digit code to <span className="text-accent-app font-medium">{email}</span>
          </p>

          <div className="pt-2 pb-2">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="input-app text-center text-2xl tracking-[0.5em] font-mono py-3"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading === 'verify' || otp.length !== 6}
            className="btn-primary w-full justify-center py-2.5"
          >
            {loading === 'verify' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : (
              'Verify Code'
            )}
          </button>

          {/* Resend button with cooldown */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0 || loading === 'resend'}
              className="flex items-center gap-1.5 text-sm text-accent-app hover:underline disabled:text-muted-app disabled:no-underline disabled:cursor-not-allowed transition-colors"
            >
              {loading === 'resend' ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
              ) : (
                <><RefreshCw className="w-3.5 h-3.5" /> Resend code</>
              )}
            </button>
            {resendCountdown > 0 && (
              <span className="text-xs text-muted-app">({resendCountdown}s)</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setMagicSent(false);
              setOtp('');
              setResendCountdown(0);
              if (countdownRef.current) clearInterval(countdownRef.current);
            }}
            className="mt-2 text-sm text-muted-app hover:text-primary-app transition-colors block mx-auto"
          >
            Use a different email
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleOAuth('google')}
              disabled={!!loading}
              className="btn-ghost justify-center py-2.5 text-sm"
            >
              {loading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-app" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card-app px-3 text-muted-app">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-app mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-app"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!!loading || !email}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading === 'email' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending code...</>
              ) : (
                <><Mail className="w-4 h-4" /> Send Login Code</>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
