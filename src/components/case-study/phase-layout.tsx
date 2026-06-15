'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, Save, Loader2, Home, ArrowLeft, ArrowRight } from 'lucide-react';

const PHASES = [
  { id: 1, label: 'Problem Definition', short: 'Problem' },
  { id: 2, label: 'Customer & Market', short: 'Customer' },
  { id: 3, label: 'Strategy & Metrics', short: 'Strategy' },
  { id: 4, label: 'Ideation', short: 'Ideas' },
  { id: 5, label: 'Prioritization', short: 'Priority' },
  { id: 6, label: 'Execution & GTM', short: 'Execution' },
  { id: 7, label: 'Risks & Roadmap', short: 'Roadmap' },
];

interface PhaseLayoutProps {
  caseStudyId: string;
  caseStudyTitle: string;
  currentPhase: number;
  completedPhases: number[];
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onSave?: () => void;
  children: React.ReactNode;
  canGoNext?: boolean;
  onNext?: () => void;
}

export function PhaseLayout({
  caseStudyId,
  caseStudyTitle,
  currentPhase,
  completedPhases,
  saveStatus,
  onSave,
  children,
  canGoNext = true,
  onNext,
}: PhaseLayoutProps) {
  const prevPhase = currentPhase > 1 ? currentPhase - 1 : null;
  const nextPhase = currentPhase < 7 ? currentPhase + 1 : null;

  return (
    <div className="flex h-full">
      {/* Phase Sidebar */}
      <div className="w-56 shrink-0 border-r border-app bg-app-secondary/30 flex flex-col">
        <div className="p-4 border-b border-app">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-app hover:text-primary-app transition-colors mb-3">
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <div className="text-xs font-medium text-primary-app line-clamp-2">{caseStudyTitle}</div>
          <div className="mt-2 h-1.5 rounded-full bg-app-tertiary overflow-hidden">
            <div
              className="h-full rounded-full gradient-accent transition-all"
              style={{ width: `${Math.round((completedPhases.length / 7) * 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-app mt-1">{Math.round((completedPhases.length / 7) * 100)}% complete</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {PHASES.map((phase) => {
            const isActive = phase.id === currentPhase;
            const isCompleted = completedPhases.includes(phase.id);
            return (
              <Link
                key={phase.id}
                href={`/case-study/${caseStudyId}/phase-${phase.id}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-accent-subtle-app text-accent-app'
                    : isCompleted
                    ? 'text-secondary-app hover:bg-app-tertiary'
                    : 'text-muted-app hover:bg-app-tertiary'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isCompleted
                      ? 'gradient-accent text-white'
                      : isActive
                      ? `phase-${phase.id}-color`
                      : 'bg-app-tertiary text-muted-app'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : phase.id}
                </div>
                <span>{phase.short}</span>
              </Link>
            );
          })}
        </nav>

        {/* Deliverables */}
        <div className="p-3 border-t border-app">
          <Link
            href={`/case-study/${caseStudyId}/deliverables`}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-muted-app hover:bg-app-tertiary hover:text-primary-app transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-app-tertiary flex items-center justify-center">
              <span className="text-xs">📄</span>
            </div>
            Deliverables
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Phase Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app bg-app-secondary/30">
          <div className="flex items-center gap-3">
            <div className={`phase-badge phase-${currentPhase}-color`}>{currentPhase}</div>
            <div>
              <h2 className="font-semibold text-primary-app text-sm">{PHASES[currentPhase - 1]?.label}</h2>
              <p className="text-xs text-muted-app">Phase {currentPhase} of 7</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Save status */}
            <div className="flex items-center gap-1.5 text-xs">
              {saveStatus === 'saving' && <><Loader2 className="w-3.5 h-3.5 animate-spin text-muted-app" /> <span className="text-muted-app">Saving...</span></>}
              {saveStatus === 'saved' && <><Check className="w-3.5 h-3.5 text-green-400" /> <span className="text-green-400">Saved</span></>}
              {saveStatus === 'error' && <span className="text-red-400">Save failed</span>}
            </div>
            {onSave && (
              <button onClick={onSave} className="btn-secondary py-1.5 px-3 text-xs">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-app">
          {prevPhase ? (
            <Link href={`/case-study/${caseStudyId}/phase-${prevPhase}`} className="btn-ghost py-2">
              <ArrowLeft className="w-4 h-4" /> Phase {prevPhase}
            </Link>
          ) : <div />}

          {nextPhase ? (
            <button
              onClick={onNext}
              disabled={saveStatus === 'saving'}
              className={`btn-primary py-2 ${!canGoNext ? 'opacity-50' : ''}`}
            >
              Next: {PHASES[nextPhase - 1]?.short} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link href={`/case-study/${caseStudyId}/deliverables`} className="btn-primary py-2">
              View Deliverables <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
