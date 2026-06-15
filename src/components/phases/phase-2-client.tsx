'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Phase2Data, UserSegment, Persona, Competitor, JourneyStage } from '@/types';

const JOURNEY_STAGES = ['Awareness', 'Consideration', 'Activation', 'Usage', 'Retention'];
const defaultPersona = (): Persona => ({ id: crypto.randomUUID(), name: '', age: '', occupation: '', goals: '', motivations: '', frustrations: '', functionalJTBD: '', emotionalJTBD: '', socialJTBD: '' });
const defaultSegment = (): UserSegment => ({ id: crypto.randomUUID(), name: '', demographics: '', psychographics: '', behaviors: '' });
const defaultCompetitor = (): Competitor => ({ id: crypto.randomUUID(), product: '', strengths: '', weaknesses: '', marketPosition: '' });
const defaultJourneyStage = (stage: string): JourneyStage => ({ stage, actions: '', emotions: '', painPoints: '', opportunities: '' });

export function Phase2Client({ caseStudyId, caseStudyTitle, completedPhases, initialData }: { caseStudyId: string; caseStudyTitle: string; completedPhases: number[]; initialData: Partial<Phase2Data>; }) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'segments' | 'personas' | 'competitors' | 'journey'>('segments');
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [data, setData] = useState<Phase2Data>({
    userSegments: initialData.userSegments ?? [],
    personas: initialData.personas ?? [],
    competitors: initialData.competitors ?? [],
    journeyStages: initialData.journeyStages ?? JOURNEY_STAGES.map(defaultJourneyStage),
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoSave = useCallback((updated: Phase2Data) => {
    if (timer.current) clearTimeout(timer.current);
    setSaveStatus('saving');
    timer.current = setTimeout(async () => {
      try { await savePhaseData(caseStudyId, 2, updated as unknown as Record<string, unknown>); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }
      catch { setSaveStatus('error'); }
    }, 1500);
  }, [caseStudyId]);

  const update = (patch: Partial<Phase2Data>) => { const u = { ...data, ...patch }; setData(u); autoSave(u); };
  const handleNext = async () => { setSaveStatus('saving'); try { await savePhaseData(caseStudyId, 2, data as unknown as Record<string, unknown>, true); router.push(`/case-study/${caseStudyId}/phase-3`); } catch { setSaveStatus('error'); toast.error('Failed to save'); } };

  const handleImageUpload = (id: string, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      update({ personas: data.personas.map((p) => p.id === id ? { ...p, imageUrl: base64 } : p) });
    };
    reader.readAsDataURL(file);
  };

  const TABS = [{ id: 'segments', label: 'User Segments', count: data.userSegments.length }, { id: 'personas', label: 'Personas', count: data.personas.length }, { id: 'competitors', label: 'Competitors', count: data.competitors.length }, { id: 'journey', label: 'User Journey', count: data.journeyStages.length }] as const;

  return (
    <PhaseLayout caseStudyId={caseStudyId} caseStudyTitle={caseStudyTitle} currentPhase={2} completedPhases={completedPhases} saveStatus={saveStatus} onNext={handleNext}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div><h1 className="text-xl font-bold text-primary-app mb-1">Customer & Market Analysis</h1><p className="text-sm text-muted-app">Define your users, map the market, and understand the competitive landscape.</p></div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${ activeTab === tab.id ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app hover:border-border-hover-app' }`}>{tab.label} {tab.count > 0 && <span className="ml-1 text-xs opacity-60">({tab.count})</span>}</button>))}
        </div>
        {activeTab === 'segments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">User Segments</h2><button onClick={() => update({ userSegments: [...data.userSegments, defaultSegment()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Segment</button></div>
            {data.userSegments.map((seg) => (
              <div key={seg.id} className="card-app p-5 space-y-3">
                <div className="flex items-center gap-2"><input type="text" value={seg.name} onChange={(e) => update({ userSegments: data.userSegments.map((s) => s.id === seg.id ? { ...s, name: e.target.value } : s) })} placeholder="Segment name" className="input-app font-medium" /><button onClick={() => update({ userSegments: data.userSegments.filter((s) => s.id !== seg.id) })} className="p-2 text-muted-app hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></div>
                {(['demographics', 'psychographics', 'behaviors'] as const).map((field) => (<div key={field}><label className="text-xs font-medium text-muted-app capitalize mb-1 block">{field}</label><textarea rows={2} value={seg[field]} onChange={(e) => update({ userSegments: data.userSegments.map((s) => s.id === seg.id ? { ...s, [field]: e.target.value } : s) })} placeholder={`Describe ${field}...`} className="input-app resize-none text-sm" /></div>))}
              </div>
            ))}
            {data.userSegments.length === 0 && <div className="card-app p-8 text-center text-muted-app text-sm">No segments yet.</div>}
          </div>
        )}
        {activeTab === 'personas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">Buyer Personas</h2><button onClick={() => update({ personas: [...data.personas, defaultPersona()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Persona</button></div>
            {data.personas.map((persona) => (
              <div key={persona.id} className="card-app overflow-hidden">
                <button className="w-full flex items-center justify-between p-5" onClick={() => setExpandedPersona(expandedPersona === persona.id ? null : persona.id)}>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-app bg-app-tertiary flex items-center justify-center text-muted-app font-bold text-sm overflow-hidden">{persona.imageUrl ? <img src={persona.imageUrl} alt={persona.name} className="w-full h-full object-cover" /> : (persona.name?.[0] ?? '?')}</div><div className="text-left"><div className="font-medium text-primary-app">{persona.name || 'Unnamed Persona'}</div><div className="text-xs text-muted-app">{persona.age ? `Age ${persona.age}` : ''} {persona.occupation ? `· ${persona.occupation}` : ''}</div></div></div>
                  <div className="flex items-center gap-2"><button onClick={(e) => { e.stopPropagation(); update({ personas: data.personas.filter((p) => p.id !== persona.id) }); }} className="p-1.5 text-muted-app hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>{expandedPersona === persona.id ? <ChevronUp className="w-4 h-4 text-muted-app" /> : <ChevronDown className="w-4 h-4 text-muted-app" />}</div>
                </button>
                {expandedPersona === persona.id && (
                  <div className="px-5 pb-5 border-t border-app pt-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-muted-app capitalize mb-1 block">Avatar Image</label>
                      <div className="flex items-center gap-3">
                        {persona.imageUrl && <img src={persona.imageUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-app" />}
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(persona.id, e.target.files?.[0] as File)} className="text-xs text-muted-app file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent-subtle-app file:text-accent-app hover:file:bg-accent-app hover:file:text-white transition-colors cursor-pointer" />
                        {persona.imageUrl && <button onClick={() => update({ personas: data.personas.map((p) => p.id === persona.id ? { ...p, imageUrl: undefined } : p) })} className="text-xs text-red-400 hover:underline">Remove</button>}
                      </div>
                    </div>
                    {(['name', 'age', 'occupation', 'goals', 'motivations', 'frustrations'] as const).map((field) => (
                      <div key={field} className={['goals','motivations','frustrations'].includes(field) ? 'col-span-2' : ''}>
                        <label className="text-xs font-medium text-muted-app capitalize mb-1 block">{field}</label>
                        {['goals','motivations','frustrations'].includes(field) ? <textarea rows={2} value={persona[field]} onChange={(e) => update({ personas: data.personas.map((p) => p.id === persona.id ? { ...p, [field]: e.target.value } : p) })} className="input-app resize-none text-sm" /> : <input type="text" value={persona[field]} onChange={(e) => update({ personas: data.personas.map((p) => p.id === persona.id ? { ...p, [field]: e.target.value } : p) })} className="input-app text-sm" />}
                      </div>
                    ))}
                    <div className="col-span-2"><p className="text-xs font-semibold text-primary-app mb-2">Jobs To Be Done</p>{(['functionalJTBD', 'emotionalJTBD', 'socialJTBD'] as const).map((field) => (<div key={field} className="mb-2"><label className="text-xs text-muted-app mb-1 block">{field.replace('JTBD','').replace('functional','Functional ').replace('emotional','Emotional ').replace('social','Social ')} JTBD</label><input type="text" value={persona[field]} onChange={(e) => update({ personas: data.personas.map((p) => p.id === persona.id ? { ...p, [field]: e.target.value } : p) })} className="input-app text-sm" /></div>))}</div>
                  </div>
                )}
              </div>
            ))}
            {data.personas.length === 0 && <div className="card-app p-8 text-center text-muted-app text-sm">No personas yet.</div>}
          </div>
        )}
        {activeTab === 'competitors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">Competitive Landscape</h2><button onClick={() => update({ competitors: [...data.competitors, defaultCompetitor()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Competitor</button></div>
            <div className="card-app overflow-x-auto"><table className="w-full"><thead><tr className="text-xs text-muted-app uppercase"><th className="text-left p-3">Product</th><th className="text-left p-3">Strengths</th><th className="text-left p-3">Weaknesses</th><th className="text-left p-3">Market Position</th><th className="p-3" /></tr></thead><tbody>{data.competitors.map((comp) => (<tr key={comp.id} className="border-t border-app">{(['product','strengths','weaknesses','marketPosition'] as const).map((field) => (<td key={field} className="p-2"><input type="text" value={comp[field]} onChange={(e) => update({ competitors: data.competitors.map((c) => c.id === comp.id ? { ...c, [field]: e.target.value } : c) })} className="input-app text-sm" /></td>))}<td className="p-2"><button onClick={() => update({ competitors: data.competitors.filter((c) => c.id !== comp.id) })} className="p-1.5 text-muted-app hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody></table>{data.competitors.length === 0 && <p className="text-center text-muted-app text-sm py-8">No competitors added.</p>}</div>
          </div>
        )}
        {activeTab === 'journey' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-primary-app">User Journey Mapping</h2>
            {data.journeyStages.map((stage, idx) => (
              <div key={stage.stage} className="card-app p-5">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 phase-${idx+1}-color`}>{stage.stage}</div>
                <div className="grid grid-cols-2 gap-3">
                  {(['actions','emotions','painPoints','opportunities'] as const).map((field) => (<div key={field}><label className="text-xs font-medium text-muted-app capitalize mb-1 block">{field.replace(/([A-Z])/g,' $1')}</label><textarea rows={2} value={stage[field]} onChange={(e) => update({ journeyStages: data.journeyStages.map((s) => s.stage === stage.stage ? { ...s, [field]: e.target.value } : s) })} className="input-app resize-none text-sm" /></div>))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PhaseLayout>
  );
}
