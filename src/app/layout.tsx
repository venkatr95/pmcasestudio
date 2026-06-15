import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    template: '%s | PM Case Studio',
    default: 'PM Case Studio — Professional Product Management Workspace',
  },
  description:
    'Create, analyze, structure, and export high-quality product case studies. The professional workspace for Product Managers, MBA students, and PM interview candidates.',
  keywords: [
    'product management',
    'case study',
    'pm interview',
    'product strategy',
    'product roadmap',
    'PM workspace',
  ],
  authors: [{ name: 'PM Case Studio' }],
  openGraph: {
    title: 'PM Case Studio',
    description: 'Professional Product Management Case Study Workspace',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <NextTopLoader
            color="var(--accent)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px var(--accent),0 0 5px var(--accent)"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
                      <div class="spinner" role="spinner">
                        <div class="fixed inset-0 z-[99999] bg-app/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                          <div class="w-16 h-16 rounded-full border-4 border-transparent border-t-accent-app animate-spin shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"></div>
                          <div class="absolute w-12 h-12 rounded-full border-4 border-accent-app/20 animate-pulse"></div>
                          <p class="mt-4 text-sm font-bold text-primary-app animate-pulse">Loading Workspace...</p>
                        </div>
                      </div>'
          />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgb(var(--bg-card))',
                color: 'rgb(var(--text-primary))',
                border: '1px solid rgb(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
