'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, Sparkles, BookOpen } from 'lucide-react';

const ACTIONS = [
  {
    href: '/case-study/new',
    icon: Plus,
    label: 'New Case Study',
    desc: 'Start from scratch or use a template',
    primary: true,
  },
  {
    href: '/templates',
    icon: Sparkles,
    label: 'Browse Templates',
    desc: 'Including District by Zomato',
    primary: false,
  },
  {
    href: '/glossary',
    icon: BookOpen,
    label: 'PM Glossary',
    desc: 'Frameworks & concepts',
    primary: false,
  },
];

export function QuickActions() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Link href={action.href}>
                <div
                  className={`p-5 rounded-xl border transition-all cursor-pointer group ${
                    action.primary
                      ? 'gradient-accent border-transparent glow-accent-sm hover:opacity-90'
                      : 'card-app'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-3 transition-transform group-hover:scale-110 ${
                      action.primary ? 'text-white' : 'text-accent-app'
                    }`}
                  />
                  <div className={`font-semibold text-sm ${action.primary ? 'text-white' : 'text-primary-app'}`}>
                    {action.label}
                  </div>
                  <div className={`text-xs mt-1 ${action.primary ? 'text-white/70' : 'text-muted-app'}`}>
                    {action.desc}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
