'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, Sparkles, Search, ArrowRight, BookOpen } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  featured: boolean;
  tags: string;
  usageCount: number;
  builtIn: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Growth Strategy': 'text-green-400 bg-green-400/10',
  'Product Strategy': 'text-blue-400 bg-blue-400/10',
  'Product Launch': 'text-orange-400 bg-orange-400/10',
  'SaaS Product': 'text-purple-400 bg-purple-400/10',
  'AI Product': 'text-cyan-400 bg-cyan-400/10',
  'Consumer App': 'text-pink-400 bg-pink-400/10',
  'Marketplace': 'text-yellow-400 bg-yellow-400/10',
  'E-commerce': 'text-red-400 bg-red-400/10',
  'Product Redesign': 'text-indigo-400 bg-indigo-400/10',
  'Platform Product': 'text-teal-400 bg-teal-400/10',
  'Product Sense': 'text-violet-400 bg-violet-400/10',
  'PM Interview': 'text-amber-400 bg-amber-400/10',
  default: 'text-accent-app bg-accent-subtle-app',
};

export function TemplatesGrid({ templates }: { templates: Template[] }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(templates.map((t) => t.category)))];
  const filtered = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || (t.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.filter((t) => t.featured);
  const rest = filtered.filter((t) => !t.featured);

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-app" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="input-app pl-10" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-app w-full sm:w-48">
          {categories.map((cat) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
        </select>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((template, i) => {
              const tags = JSON.parse(template.tags) as string[];
              const colorClass = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.default;
              return (
                <motion.div key={template.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="card-app p-6 group relative overflow-hidden ring-1 ring-accent-app/20">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-5 gradient-accent" />
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass}`}><Sparkles className="w-3 h-3" />{template.category}</div>
                      <div className="flex items-center gap-1 text-xs text-yellow-400 font-medium"><Star className="w-3.5 h-3.5 fill-yellow-400" /> Featured</div>
                    </div>
                    <h3 className="text-lg font-bold text-primary-app mb-2">{template.name}</h3>
                    {template.description && <p className="text-sm text-muted-app mb-4 line-clamp-2">{template.description}</p>}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {tags.slice(0,4).map((tag) => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-app-secondary text-muted-app border border-app">{tag}</span>)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-app">{template.usageCount} uses</span>
                      <Link href={`/case-study/new?templateId=${template.id}`} className="btn-primary py-2 px-4 text-sm">Use Template <ArrowRight className="w-3.5 h-3.5" /></Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Templates */}
      {rest.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide mb-4">{featured.length > 0 ? 'All Templates' : `${filtered.length} Templates`}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((template, i) => {
              const tags = JSON.parse(template.tags) as string[];
              const colorClass = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.default;
              return (
                <motion.div key={template.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="card-app p-5 group">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium mb-3 ${colorClass}`}><BookOpen className="w-3 h-3" />{template.category}</div>
                    <h3 className="font-semibold text-primary-app text-sm mb-1 group-hover:text-accent-app transition-colors">{template.name}</h3>
                    {template.description && <p className="text-xs text-muted-app line-clamp-2 mb-3">{template.description}</p>}
                    <div className="flex flex-wrap gap-1 mb-3">{tags.slice(0,3).map((tag) => <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-app-secondary text-muted-app">{tag}</span>)}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-app">{template.usageCount} uses</span>
                      <Link href={`/case-study/new?templateId=${template.id}`} className="text-xs text-accent-app hover:underline flex items-center gap-1">Use <ArrowRight className="w-3 h-3" /></Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="card-app p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-app mx-auto mb-4 opacity-40" />
          <p className="text-muted-app">No templates found for your search.</p>
        </div>
      )}
    </div>
  );
}
