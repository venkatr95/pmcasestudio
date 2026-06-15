'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FileText, Clock, CheckCircle, ChevronRight, Plus } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

interface CaseStudyCard {
  id: string;
  title: string;
  description: string | null;
  status: string;
  currentPhase: number;
  phaseCount: number;
  productType: string;
  studyStyle: string;
  tags: string[];
  updatedAt: Date;
}

const PHASE_LABELS = [
  '', 'Problem', 'Customer', 'Strategy', 'Ideation',
  'Prioritization', 'Execution', 'Roadmap'
];

const STATUS_CONFIG = {
  draft: { icon: Clock, label: 'Draft', color: 'warning' },
  in_progress: { icon: FileText, label: 'In Progress', color: 'info' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'success' },
  archived: { icon: FileText, label: 'Archived', color: 'muted' },
};

export function RecentCaseStudies({ caseStudies }: { caseStudies: CaseStudyCard[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide">Recent Case Studies</h2>
      </div>

      {caseStudies.length === 0 ? (
        <div className="card-app p-12 text-center">
          <FileText className="w-12 h-12 text-muted-app mx-auto mb-4 opacity-40" />
          <h3 className="text-primary-app font-medium mb-2">No case studies yet</h3>
          <p className="text-muted-app text-sm mb-6">Create your first case study to get started.</p>
          <Link href="/case-study/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Create First Study
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseStudies.map((cs, i) => {

            const progress = Math.round((cs.phaseCount / 7) * 100);
            return (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/case-study/${cs.id}/phase-${cs.currentPhase}`}>
                  <div className="card-app p-5 h-full group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`phase-badge phase-${cs.currentPhase}-color`}>
                          {cs.currentPhase}
                        </div>
                        {cs.status && STATUS_CONFIG[cs.status as keyof typeof STATUS_CONFIG] && (() => {
                          const conf = STATUS_CONFIG[cs.status as keyof typeof STATUS_CONFIG];
                          const StatusIcon = conf.icon;
                          return (
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-app border border-app px-1.5 py-0.5 rounded-md bg-app">
                              <StatusIcon className="w-3 h-3" />
                              {conf.label}
                            </span>
                          );
                        })()}
                      </div>
                      <span className="text-xs text-muted-app">{formatRelativeDate(cs.updatedAt)}</span>
                    </div>
                    <h3 className="font-semibold text-primary-app line-clamp-2 mb-1 group-hover:text-accent-app transition-colors">
                      {cs.title}
                    </h3>
                    {cs.description && (
                      <p className="text-xs text-muted-app line-clamp-2 mb-3">{cs.description}</p>
                    )}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-app mb-1.5">
                        <span>Phase {cs.currentPhase} of 7 — {PHASE_LABELS[cs.currentPhase]}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-app-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-accent transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-subtle-app text-accent-app capitalize">
                        {cs.productType}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-app group-hover:text-accent-app transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
