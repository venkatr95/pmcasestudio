'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCaseStudy } from '@/lib/actions/case-studies';
import { Check, ChevronRight, ChevronLeft, Loader2, Sparkles, Star, FileText } from 'lucide-react';

type ProductType = 'digital' | 'physical' | 'hybrid';
type StudyStyle = 'executive' | 'consulting' | 'startup' | 'investor' | 'interview';
type Theme = 'aurora' | 'midnight' | 'minimal' | 'corporate' | 'neon';

const PRODUCT_TYPES: { id: ProductType; label: string; icon: string; examples: string[] }[] = [
  { id: 'digital', label: 'Digital Product', icon: '💻', examples: ['SaaS', 'Marketplace', 'Mobile App', 'Platform'] },
  { id: 'physical', label: 'Physical Product', icon: '📦', examples: ['Hardware', 'Consumer Electronics', 'Automotive', 'Medical Device'] },
  { id: 'hybrid', label: 'Hybrid Product', icon: '🔗', examples: ['IoT', 'Wearables', 'Smart Home', 'Connected Vehicle'] },
];

const STUDY_STYLES: { id: StudyStyle; label: string; icon: string; desc: string }[] = [
  { id: 'executive', label: 'Executive', icon: '🏛️', desc: 'Board-ready format with strategic clarity' },
  { id: 'consulting', label: 'Consulting', icon: '📊', desc: 'McKinsey/Bain structured analysis' },
  { id: 'startup', label: 'Startup', icon: '🚀', desc: 'Growth-focused with lean principles' },
  { id: 'investor', label: 'Investor', icon: '💼', desc: 'Business-centric with metrics & ROI' },
  { id: 'interview', label: 'PM Interview', icon: '🎯', desc: 'Structured for PM interview scenarios' },
];

const THEMES: { id: Theme; label: string; from: string; to: string; desc: string }[] = [
  { id: 'aurora', label: 'Aurora', from: '#8B5CF6', to: '#EC4899', desc: 'Purple-pink gradient, dark slate' },
  { id: 'midnight', label: 'Midnight', from: '#06B6D4', to: '#3B82F6', desc: 'Deep blue with cyan accents' },
  { id: 'minimal', label: 'Minimal', from: '#18181B', to: '#3F3F46', desc: 'Clean white, black accent' },
  { id: 'corporate', label: 'Corporate', from: '#EA580C', to: '#F97316', desc: 'Navy blue with orange accent' },
  { id: 'neon', label: 'Neon', from: '#9333EA', to: '#39FF14', desc: 'Electric black with neon green' },
];

const STEPS = [
  { id: 1, label: 'Product' },
  { id: 2, label: 'Type' },
  { id: 3, label: 'Style' },
  { id: 4, label: 'Theme' },
];

export function OnboardingWizard({ userName, templates }: { userName: string; templates?: any[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    title: '',
    description: '',
    productType: 'digital' as ProductType,
    studyStyle: 'executive' as StudyStyle,
    theme: 'aurora' as Theme,
    templateId: '',
  });

  const canNext = () => {
    if (step === 1) return !!prefs.title.trim();
    if (step === 2) return !!prefs.productType;
    if (step === 3) return !!prefs.studyStyle;
    return true;
  };

  const handleNext = async () => {
    if (step < 4) { setStep(step + 1); return; }
    setLoading(true);
    try {
      const cs = await createCaseStudy({
        title: prefs.title,
        description: prefs.description,
        productType: prefs.productType,
        studyStyle: prefs.studyStyle,
        theme: prefs.theme,
        templateId: prefs.templateId,
      });
      document.documentElement.setAttribute('data-theme', prefs.theme);
      toast.success('Workspace created!');
      router.push(`/case-study/${cs.id}/phase-1`);
    } catch {
      toast.error('Failed to create case study.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in-fade w-full max-w-2xl mx-auto px-4">
      {/* Header Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-app bg-app-secondary flex items-center justify-center mb-6">
        <span className="text-3xl">👩‍💼</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full text-center"
        >
          {step === 1 && (
            <div className="space-y-8">
              <h1 className="text-3xl sm:text-4xl font-serif text-primary-app">
                Hey! I&apos;m your PM Assistant.<br/>What product are you building?
              </h1>
              
              <div className="max-w-md mx-auto space-y-4 text-left">
                <input
                  type="text"
                  value={prefs.title}
                  onChange={(e) => setPrefs({ ...prefs, title: e.target.value })}
                  placeholder="e.g., District by Zomato"
                  className="w-full bg-app-secondary border border-app rounded-md py-3 px-4 text-primary-app focus:outline-none focus:border-accent-app focus:ring-1 focus:ring-accent-app transition-all text-center placeholder:text-muted-app"
                  autoFocus
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h1 className="text-3xl sm:text-4xl font-serif text-primary-app">
                Got it.<br/>What type of product is it?
              </h1>
              
              <div className="max-w-md mx-auto space-y-3">
                {PRODUCT_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setPrefs({ ...prefs, productType: pt.id })}
                    className="w-full flex items-center gap-4 bg-app-secondary hover:bg-app border border-app rounded-md py-4 px-6 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      prefs.productType === pt.id ? 'border-accent-app' : 'border-muted-app'
                    }`}>
                      {prefs.productType === pt.id && <div className="w-2.5 h-2.5 rounded-full bg-accent-app" />}
                    </div>
                    <span className="text-primary-app font-medium text-sm tracking-wide">{pt.label.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h1 className="text-3xl sm:text-4xl font-serif text-primary-app">
                Perfect.<br/>Choose your case study style.
              </h1>
              
              <div className="max-w-md mx-auto space-y-3">
                {STUDY_STYLES.map((ss) => (
                  <button
                    key={ss.id}
                    onClick={() => setPrefs({ ...prefs, studyStyle: ss.id })}
                    className="w-full flex items-center gap-4 bg-app-secondary hover:bg-app border border-app rounded-md py-4 px-6 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      prefs.studyStyle === ss.id ? 'border-accent-app' : 'border-muted-app'
                    }`}>
                      {prefs.studyStyle === ss.id && <div className="w-2.5 h-2.5 rounded-full bg-accent-app" />}
                    </div>
                    <span className="text-primary-app font-medium text-sm tracking-wide">{ss.label.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <h1 className="text-3xl sm:text-4xl font-serif text-primary-app">
                Almost done.<br/>Pick a visual theme.
              </h1>
              
              <div className="max-w-md mx-auto space-y-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setPrefs({ ...prefs, theme: t.id });
                      document.documentElement.setAttribute('data-theme', t.id);
                    }}
                    className="w-full flex items-center gap-4 bg-app-secondary hover:bg-app border border-app rounded-md py-4 px-6 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      prefs.theme === t.id ? 'border-accent-app' : 'border-muted-app'
                    }`}>
                      {prefs.theme === t.id && <div className="w-2.5 h-2.5 rounded-full bg-accent-app" />}
                    </div>
                    <span className="text-primary-app font-medium text-sm tracking-wide">{t.label.toUpperCase()}</span>
                    <div
                      className="ml-auto w-6 h-6 rounded-full shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 w-full max-w-md mx-auto text-center flex flex-col items-center">
        <button
          onClick={handleNext}
          disabled={!canNext() || loading}
          className="bg-app-tertiary text-primary-app hover:bg-accent-app hover:text-white disabled:opacity-50 disabled:hover:bg-app-tertiary disabled:hover:text-primary-app transition-all py-3 px-12 rounded-md font-bold tracking-widest text-sm uppercase"
        >
          {loading ? 'WAIT...' : step === 4 ? 'CREATE' : 'NEXT'}
        </button>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            disabled={loading}
            className="mt-4 text-xs text-muted-app hover:text-primary-app transition-colors uppercase tracking-wider"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
