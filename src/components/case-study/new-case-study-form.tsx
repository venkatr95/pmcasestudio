'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { createCaseStudy } from '@/lib/actions/case-studies';
import { Loader2, Star, FileText, Sparkles } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  featured: boolean;
  description: string | null;
}

const PRODUCT_TYPES = [
  { id: 'digital', label: 'Digital', icon: '💻' },
  { id: 'physical', label: 'Physical', icon: '📦' },
  { id: 'hybrid', label: 'Hybrid', icon: '🔗' },
];

const STUDY_STYLES = [
  { id: 'executive', label: 'Executive' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'startup', label: 'Startup' },
  { id: 'investor', label: 'Investor' },
  { id: 'interview', label: 'PM Interview' },
];

export function NewCaseStudyForm({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    productType: 'digital',
    studyStyle: 'executive',
    templateId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Please enter a title'); return; }
    setLoading(true);
    try {
      const cs = await createCaseStudy({
        title: form.title,
        description: form.description || undefined,
        productType: form.productType,
        studyStyle: form.studyStyle,
        templateId: form.templateId || undefined,
      });
      toast.success('Case study created!');
      router.push(`/case-study/${cs.id}/phase-1`);
    } catch {
      toast.error('Failed to create case study.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="card-app p-6 space-y-4">
        <h2 className="font-semibold text-primary-app">Basic Information</h2>
        <div>
          <label className="block text-sm font-medium text-secondary-app mb-1.5">Case Study Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., District by Zomato — Growth Strategy"
            className="input-app"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-app mb-1.5">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief summary of what this case study covers..."
            rows={3}
            className="input-app resize-none"
          />
        </div>
      </div>

      {/* Product Type */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-4">Product Type</h2>
        <div className="grid grid-cols-3 gap-3">
          {PRODUCT_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => setForm({ ...form, productType: pt.id })}
              className={`p-3 rounded-xl border text-center transition-all ${
                form.productType === pt.id
                  ? 'border-accent-app bg-accent-subtle-app'
                  : 'border-app hover:border-border-hover-app'
              }`}
            >
              <div className="text-2xl mb-1">{pt.icon}</div>
              <div className="text-sm font-medium text-primary-app">{pt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Style */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-4">Case Study Style</h2>
        <div className="flex flex-wrap gap-2">
          {STUDY_STYLES.map((ss) => (
            <button
              key={ss.id}
              type="button"
              onClick={() => setForm({ ...form, studyStyle: ss.id })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                form.studyStyle === ss.id
                  ? 'border-accent-app bg-accent-subtle-app text-accent-app'
                  : 'border-app text-muted-app hover:border-border-hover-app'
              }`}
            >
              {ss.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-1">Start from Template</h2>
        <p className="text-xs text-muted-app mb-4">Optional. Pre-populates all 7 phases with structured content.</p>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
          <button
            type="button"
            onClick={() => setForm({ ...form, templateId: '' })}
            className={`text-left p-3 rounded-xl border transition-all ${
              !form.templateId ? 'border-accent-app bg-accent-subtle-app' : 'border-app hover:border-border-hover-app'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-app" />
              <div>
                <div className="text-sm font-medium text-primary-app">Blank Template</div>
                <div className="text-xs text-muted-app">Start with an empty workspace</div>
              </div>
            </div>
          </button>
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setForm({ ...form, templateId: t.id })}
              className={`text-left p-3 rounded-xl border transition-all ${
                form.templateId === t.id ? 'border-accent-app bg-accent-subtle-app' : 'border-app hover:border-border-hover-app'
              }`}
            >
              <div className="flex items-center gap-3">
                {t.featured ? <Star className="w-4 h-4 text-yellow-400" /> : <Sparkles className="w-4 h-4 text-muted-app" />}
                <div>
                  <div className="text-sm font-medium text-primary-app">{t.name}</div>
                  <div className="text-xs text-muted-app">{t.category}</div>
                </div>
                {t.featured && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full gradient-accent text-white">Featured</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
        ) : (
          'Create Case Study →'
        )}
      </button>
    </motion.form>
  );
}
