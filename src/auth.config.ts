import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnCaseStudy = nextUrl.pathname.startsWith('/case-study');
      const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');
      const isOnTemplates = nextUrl.pathname.startsWith('/templates');
      const isOnSettings = nextUrl.pathname.startsWith('/settings');
      const isOnExports = nextUrl.pathname.startsWith('/exports');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin') && !nextUrl.pathname.startsWith('/admin/login');
      const isProtected =
        isOnDashboard || isOnCaseStudy || isOnOnboarding || isOnTemplates || isOnSettings || isOnExports || isOnAdmin;
      if (isProtected) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
};
