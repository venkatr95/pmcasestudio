'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Globe, Mail, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading('email');
    try {
      await signIn('nodemailer', { email, redirect: false, callbackUrl: '/dashboard' });
      setMagicSent(true);
      toast.success('Authentication code sent! Check your email.');
    } catch {
      toast.error('Failed to send code. Please try again.');
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

  if (magicSent) {
    return (
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

        <button
          type="button"
          onClick={() => {
            setMagicSent(false);
            setOtp('');
          }}
          className="mt-4 text-sm text-muted-app hover:text-primary-app transition-colors block mx-auto"
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
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
  );
}
