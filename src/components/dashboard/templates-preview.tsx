'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, Star, ChevronRight, ArrowRight } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  featured: boolean;
  tags: string;
  usageCount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Growth Strategy': 'text-green-400 bg-green-400/10',
  'Product Strategy': 'text-blue-400 bg-blue-400/10',
  'Product Launch': 'text-orange-400 bg-orange-400/10',
  'SaaS Product': 'text-purple-400 bg-purple-400/10',
  'AI Product': 'text-cyan-400 bg-cyan-400/10',
  default: 'text-accent-app bg-accent-subtle-app',
};

export function TemplatesPreview({ templates }: { templates: Template[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide">Template Library</h2>
        <Link href="/templates" className="text-sm text-accent-app hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, i) => {

          const colorClass = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.default;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link href={`/templates/${template.id}`}>
                <div className={`card-app p-5 group relative overflow-hidden ${template.featured ? 'ring-1 ring-accent-app/30' : ''}`}>
                  {template.featured && (
                    <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl gradient-accent text-white text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </div>
                  )}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mb-3 ${colorClass}`}>
                    <Sparkles className="w-3 h-3" />
                    {template.category}
                  </div>
                  <h3 className="font-semibold text-primary-app text-sm mb-1 group-hover:text-accent-app transition-colors">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-xs text-muted-app line-clamp-2">{template.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-app">{template.usageCount} uses</span>
                    <ChevronRight className="w-4 h-4 text-muted-app group-hover:text-accent-app transition-colors" />
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
