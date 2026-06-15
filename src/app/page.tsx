import Link from 'next/link';
import type { Metadata } from 'next';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const metadata: Metadata = {
  title: 'PM Case Studio — Professional Product Management Workspace',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-app overflow-hidden">
      {/* Animated bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: 'rgb(var(--accent-from))' }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: 'rgb(var(--accent-to))' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-app">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M6 8h20M6 14h14M6 20h10M6 26h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-primary-app">PM Case Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn-ghost py-2 px-4 text-sm">Sign In</Link>
          <Link href="/register" className="btn-primary py-2 px-4 text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-subtle-app border border-accent-app/20 text-accent-app text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-app animate-pulse" />
          The Professional PM Workspace
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-primary-app leading-tight max-w-4xl mb-6">
          Build{' '}
          <span className="gradient-accent-text">Product Case Studies</span>
          {' '}That Win
        </h1>

        <p className="text-xl text-secondary-app max-w-2xl mb-10 leading-relaxed">
          A McKinsey-grade workspace combining the best of Notion, Linear, and Pitch.
          From problem definition to executive-ready presentations — in one platform.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/register" className="btn-primary text-base px-8 py-3">
            Start Building Free
          </Link>
          <Link href="/demo" className="btn-secondary text-base px-8 py-3">
            View Demo Template
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl">
          {[
            { value: '7 Phases', label: 'Guided PM Framework' },
            { value: '13+', label: 'Built-in Templates' },
            { value: '5 Formats', label: 'Export Options' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-accent-text">{stat.value}</div>
              <div className="text-sm text-muted-app mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {[
            {
              icon: '🎯',
              title: 'Structured PM Framework',
              desc: '7-phase guided wizard from problem definition to roadmap. Never miss a critical PM lens.',
            },
            {
              icon: '📊',
              title: 'RICE, MoSCoW & AARRR',
              desc: 'Built-in prioritization frameworks with auto-calculation and interactive matrices.',
            },
            {
              icon: '🚀',
              title: 'Export Everything',
              desc: 'Generate PDF, DOCX, Marp decks, PPTX, and Markdown. Share via email instantly.',
            },
            {
              icon: '🏢',
              title: 'District by Zomato Template',
              desc: 'Fully pre-configured growth strategy case study. Clone and adapt in minutes.',
            },
            {
              icon: '🤖',
              title: 'AI-Assisted Analysis',
              desc: 'AI-powered SWOT, personas, PRDs, and executive summaries. You stay in control.',
            },
            {
              icon: '🎨',
              title: '5 Visual Themes',
              desc: 'Aurora, Midnight, Minimal, Corporate, Neon. Themes affect exports and presentations.',
            },
          ].map((feature) => (
            <div key={feature.title} className="card-app p-6 text-left">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-primary-app mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-app leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
