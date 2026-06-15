'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, Trash2, ThumbsUp, Tag, Lightbulb } from 'lucide-react';
import type { Phase4Data, Idea } from '@/types';

const CATEGORIES = [
  { id: 'customer', label: 'Customer-Centric', color: 'phase-1-color' },
  { id: 'business', label: 'Business-Centric', color: 'phase-2-color' },
  { id: 'growth', label: 'Growth', color: 'phase-3-color' },
  { id: 'operational', label: 'Operational', color: 'phase-4-color' },
] as const;

const defaultIdea = (): Idea => ({ id: crypto.randomUUID(), name: '', description: '', customerValue: '', businessValue: '', risks: '', category: 'customer', tags: [], votes: 0 });

export function Phase4Client({ caseStudyId, caseStudyTitle, completedPhases, initialData }: { caseStudyId: string; caseStudyTitle: string; completedPhases: number[]; initialData: Partial<Phase4Data>; }) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);
  const [data, setData] = useState<Phase4Data>({ ideas: initialData.ideas ?? [] });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoSave = useCallback((updated: Phase4Data) => {
    if (timer.current) clearTimeout(timer.current);
    setSaveStatus('saving');
    timer.current = setTimeout(async () => {
      try { await savePhaseData(caseStudyId, 4, updated as unknown as Record<string, unknown>); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }
      catch { setSaveStatus('error'); }
    }, 1500);
  }, [caseStudyId]);

  const update = (ideas: Idea[]) => { setData({ ideas }); autoSave({ ideas }); };
  const addIdea = () => { const newIdea = defaultIdea(); update([...data.ideas, newIdea]); setExpandedIdea(newIdea.id); };
  const updateIdea = (id: string, patch: Partial<Idea>) => update(data.ideas.map((i) => i.id === id ? { ...i, ...patch } : i));
  const removeIdea = (id: string) => update(data.ideas.filter((i) => i.id !== id));
  const voteIdea = (id: string) => updateIdea(id, { votes: (data.ideas.find((i) => i.id === id)?.votes ?? 0) + 1 });

  const handleNext = async () => {
    setSaveStatus('saving');
    try { await savePhaseData(caseStudyId, 4, data as unknown as Record<string, unknown>, true); router.push(`/case-study/${caseStudyId}/phase-5`); }
    catch { setSaveStatus('error'); toast.error('Failed to save'); }
  };

  const filteredIdeas = filterCategory === 'all' ? data.ideas : data.ideas.filter((i) => i.category === filterCategory);
  const sortedIdeas = [...filteredIdeas].sort((a, b) => b.votes - a.votes);

  return (
    <PhaseLayout caseStudyId={caseStudyId} caseStudyTitle={caseStudyTitle} currentPhase={4} completedPhases={completedPhases} saveStatus={saveStatus} onNext={handleNext}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div><h1 className="text-xl font-bold text-primary-app mb-1">Ideation & Brainstorming</h1><p className="text-sm text-muted-app">Generate and organize ideas. Vote on the best ones to surface top priorities.</p></div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterCategory('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${ filterCategory === 'all' ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>All ({data.ideas.length})</button>
            {CATEGORIES.map((cat) => (<button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${ filterCategory === cat.id ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>{cat.label} ({data.ideas.filter((i) => i.category === cat.id).length})</button>))}
          </div>
          <button onClick={addIdea} className="btn-primary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Idea</button>
        </div>
        <div className="space-y-3">
          {sortedIdeas.map((idea, idx) => {
            const catConfig = CATEGORIES.find((c) => c.id === idea.category);
            return (
              <div key={idea.id} className="card-app overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button onClick={() => voteIdea(idea.id)} className="p-1.5 rounded-lg hover:bg-accent-subtle-app text-muted-app hover:text-accent-app transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                    <span className="text-xs font-bold text-primary-app">{idea.votes}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-accent-subtle-app flex items-center justify-center text-xs font-bold text-accent-app shrink-0">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <input type="text" value={idea.name} onChange={(e) => updateIdea(idea.id, { name: e.target.value })} placeholder="Idea name..." className="font-medium text-primary-app bg-transparent border-none outline-none w-full text-sm" />
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${catConfig?.color}`}><Tag className="w-2.5 h-2.5" />{catConfig?.label}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={idea.category} onChange={(e) => updateIdea(idea.id, { category: e.target.value as Idea['category'] })} className="input-app py-1 text-xs w-32">{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
                    <button onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)} className="p-1.5 text-muted-app hover:text-primary-app transition-colors"><Lightbulb className="w-4 h-4" /></button>
                    <button onClick={() => removeIdea(idea.id)} className="p-1.5 text-muted-app hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {expandedIdea === idea.id && (
                  <div className="px-4 pb-4 border-t border-app pt-4 grid grid-cols-1 gap-3">
                    <div><label className="text-xs font-medium text-muted-app mb-1 block">Description</label><textarea rows={2} value={idea.description} onChange={(e) => updateIdea(idea.id, { description: e.target.value })} className="input-app resize-none text-sm" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-medium text-muted-app mb-1 block">Customer Value</label><textarea rows={2} value={idea.customerValue} onChange={(e) => updateIdea(idea.id, { customerValue: e.target.value })} className="input-app resize-none text-sm" /></div>
                      <div><label className="text-xs font-medium text-muted-app mb-1 block">Business Value</label><textarea rows={2} value={idea.businessValue} onChange={(e) => updateIdea(idea.id, { businessValue: e.target.value })} className="input-app resize-none text-sm" /></div>
                    </div>
                    <div><label className="text-xs font-medium text-muted-app mb-1 block">Risks</label><input type="text" value={idea.risks} onChange={(e) => updateIdea(idea.id, { risks: e.target.value })} className="input-app text-sm" /></div>
                  </div>
                )}
              </div>
            );
          })}
          {sortedIdeas.length === 0 && (<div className="card-app p-12 text-center"><Lightbulb className="w-12 h-12 text-muted-app mx-auto mb-4 opacity-40" /><p className="text-muted-app text-sm">No ideas yet. Start brainstorming!</p><button onClick={addIdea} className="btn-primary mt-4 py-2 px-4 text-sm"><Plus className="w-4 h-4" /> Add First Idea</button></div>)}
        </div>
      </div>
    </PhaseLayout>
  );
}
