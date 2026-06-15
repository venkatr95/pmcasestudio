'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, Trash2, Target } from 'lucide-react';
import type { Phase3Data, Metric } from '@/types';

const NORTH_STAR_OPTIONS = ['DAU','MAU','NPS','Revenue','Retention Rate','Activation Rate','LTV','GMV','Custom'];

export function Phase3Client({ caseStudyId, caseStudyTitle, completedPhases, initialData }: { caseStudyId: string; caseStudyTitle: string; completedPhases: number[]; initialData: Partial<Phase3Data>; }) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [data, setData] = useState<Phase3Data>({
    visionAlignment: initialData.visionAlignment ?? '',
    northStarMetric: initialData.northStarMetric ?? '',
    northStarCustom: initialData.northStarCustom ?? '',
    secondaryMetrics: initialData.secondaryMetrics ?? [],
    guardrailMetrics: initialData.guardrailMetrics ?? [],
    activeFramework: initialData.activeFramework ?? 'aarrr',
    aarrr: initialData.aarrr ?? { acquisition: '', activation: '', retention: '', revenue: '', referral: '' },
    heart: initialData.heart ?? { happiness: '', engagement: '', adoption: '', retention: '', taskSuccess: '' },
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updated: Phase3Data) => { if (timer.current) clearTimeout(timer.current); setSaveStatus('saving'); timer.current = setTimeout(async () => { try { await savePhaseData(caseStudyId, 3, updated as unknown as Record<string, unknown>); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); } catch { setSaveStatus('error'); } }, 1500); }, [caseStudyId]);
  const update = (patch: Partial<Phase3Data>) => { const u = { ...data, ...patch }; setData(u); autoSave(u); };
  const addMetric = (field: 'secondaryMetrics' | 'guardrailMetrics') => update({ [field]: [...data[field], { id: crypto.randomUUID(), name: '', description: '' }] });
  const removeMetric = (field: 'secondaryMetrics' | 'guardrailMetrics', id: string) => update({ [field]: data[field].filter((m: Metric) => m.id !== id) });
  const handleNext = async () => { setSaveStatus('saving'); try { await savePhaseData(caseStudyId, 3, data as unknown as Record<string, unknown>, true); router.push(`/case-study/${caseStudyId}/phase-4`); } catch { setSaveStatus('error'); toast.error('Failed to save'); } };

  return (
    <PhaseLayout caseStudyId={caseStudyId} caseStudyTitle={caseStudyTitle} currentPhase={3} completedPhases={completedPhases} saveStatus={saveStatus} onNext={handleNext}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div><h1 className="text-xl font-bold text-primary-app mb-1">Strategy, Goals & Metrics</h1><p className="text-sm text-muted-app">Define your product vision, north star, and measurement framework.</p></div>
        <div className="card-app p-6"><label className="block text-sm font-semibold text-primary-app mb-1">Vision Alignment</label><p className="text-xs text-muted-app mb-3">How does this connect to the company vision?</p><textarea value={data.visionAlignment} onChange={(e) => update({ visionAlignment: e.target.value })} rows={4} placeholder="This aligns with our mission to..." className="input-app resize-none text-sm" /></div>
        <div className="card-app p-6"><div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-accent-app" /><label className="text-sm font-semibold text-primary-app">North Star Metric</label></div><div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">{NORTH_STAR_OPTIONS.map((opt) => (<button key={opt} onClick={() => update({ northStarMetric: opt })} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${ data.northStarMetric === opt ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app hover:border-border-hover-app' }`}>{opt}</button>))}</div>{data.northStarMetric === 'Custom' && <input type="text" value={data.northStarCustom} onChange={(e) => update({ northStarCustom: e.target.value })} placeholder="Custom north star metric..." className="input-app text-sm" />}</div>
        {(['secondaryMetrics','guardrailMetrics'] as const).map((field) => (<div key={field} className="card-app p-6"><div className="flex items-center justify-between mb-3"><div><label className="block text-sm font-semibold text-primary-app">{field === 'secondaryMetrics' ? 'Secondary Metrics' : 'Guardrail Metrics'}</label><p className="text-xs text-muted-app">{field === 'secondaryMetrics' ? 'Supporting metrics.' : 'Metrics that must not degrade.'}</p></div><button onClick={() => addMetric(field)} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add</button></div><div className="space-y-2">{data[field].map((m: Metric) => (<div key={m.id} className="flex gap-2"><input type="text" value={m.name} onChange={(e) => update({ [field]: data[field].map((x: Metric) => x.id === m.id ? { ...x, name: e.target.value } : x) })} placeholder="Metric name" className="input-app w-40 shrink-0 text-sm" /><input type="text" value={m.description ?? ''} onChange={(e) => update({ [field]: data[field].map((x: Metric) => x.id === m.id ? { ...x, description: e.target.value } : x) })} placeholder="Target or description" className="input-app flex-1 text-sm" /><button onClick={() => removeMetric(field, m.id)} className="p-2 text-muted-app hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div>))}{data[field].length === 0 && <p className="text-xs text-muted-app text-center py-3">No metrics added.</p>}</div></div>))}
        <div className="card-app p-6"><label className="block text-sm font-semibold text-primary-app mb-3">Analytics Framework</label><div className="flex gap-2 mb-5">{(['aarrr','heart'] as const).map((fw) => (<button key={fw} onClick={() => update({ activeFramework: fw })} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all uppercase ${ data.activeFramework === fw ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>{fw}</button>))}</div>{data.activeFramework === 'aarrr' ? (<div className="space-y-3">{(['acquisition','activation','retention','revenue','referral'] as const).map((key) => (<div key={key}><label className="text-xs font-medium text-muted-app capitalize mb-1 block">{key}</label><textarea rows={2} value={data.aarrr[key]} onChange={(e) => update({ aarrr: { ...data.aarrr, [key]: e.target.value } })} placeholder={`How will you measure ${key}?`} className="input-app resize-none text-sm" /></div>))}</div>) : (<div className="space-y-3">{(['happiness','engagement','adoption','retention','taskSuccess'] as const).map((key) => (<div key={key}><label className="text-xs font-medium text-muted-app capitalize mb-1 block">{key.replace(/([A-Z])/g,' $1')}</label><textarea rows={2} value={data.heart[key]} onChange={(e) => update({ heart: { ...data.heart, [key]: e.target.value } })} placeholder={`How will you measure ${key}?`} className="input-app resize-none text-sm" /></div>))}</div>)}</div>
      </div>
    </PhaseLayout>
  );
}
