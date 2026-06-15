'use client';
import { motion } from 'motion/react';
import { FileText, CheckCircle, Clock, Presentation } from 'lucide-react';

interface MetricsProps {
  metrics: { total: number; completed: number; drafts: number; inProgress: number };
}

const METRIC_CARDS = [
  { key: 'total', label: 'Total Studies', icon: FileText, color: 'var(--accent)' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'var(--success)' },
  { key: 'drafts', label: 'Drafts', icon: Clock, color: 'var(--warning)' },
  { key: 'inProgress', label: 'In Progress', icon: Presentation, color: 'var(--info)' },
] as const;

export function DashboardMetrics({ metrics }: MetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {METRIC_CARDS.map((card, i) => {
        const Icon = card.icon;
        const value = metrics[card.key];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="card-app p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-app font-medium uppercase tracking-wide">{card.label}</p>
                <p className="text-3xl font-bold text-primary-app mt-1">{value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `rgb(${card.color} / 0.12)` }}
              >
                <Icon className="w-5 h-5" style={{ color: `rgb(${card.color})` }} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
