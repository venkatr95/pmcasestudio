import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your PM Case Studio account',
};

export default function LoginPage() {
  return (
    <div className="animate-in-up">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-accent mb-4 glow-accent">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8h20M6 14h14M6 20h10M6 26h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="26" cy="22" r="5" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="2"/>
            <path d="M24 22l1.5 1.5L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-primary-app">PM Case Studio</h1>
        <p className="text-muted-app text-sm mt-1">Welcome back. Sign in to continue.</p>
      </div>

      {/* Card */}
      <div className="glass-strong rounded-2xl p-8">
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-app">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent-app font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
