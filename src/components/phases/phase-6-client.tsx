'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, CheckCircle2 } from 'lucide-react';
import type { Phase6Data, UserStory, RolloutStage } from '@/types';

const ROLLOUT_STAGES: { stage: RolloutStage['stage']; label: string; icon: string; desc: string }[] = [
  { stage: 'alpha', label: 'Internal Alpha', icon: '🔒', desc: 'Internal team testing only' },
  { stage: 'closed_beta', label: 'Closed Beta', icon: '👥', desc: 'Selected external users' },
  { stage: 'open_beta', label: 'Open Beta', icon: '🌐', desc: 'Wider public access with constraints' },
  { stage: 'launch', label: 'Public Launch', icon: '🚀', desc: 'Full public release' },
];

const MARKETING_CHANNELS = ['email', 'seo', 'paid', 'social', 'partnerships', 'inApp'] as const;
const defaultStory = (): UserStory => ({ id: crypto.randomUUID(), asA: '', iWant: '', soThat: '', acceptanceCriteria: [''], edgeCases: '', dependencies: '' });
const defaultRollout = (): RolloutStage[] => ROLLOUT_STAGES.map((s) => ({ stage: s.stage, description: '', criteria: '', timeline: '' }));

export function Phase6Client({ caseStudyId, caseStudyTitle, completedPhases, initialData }: { caseStudyId: string; caseStudyTitle: string; completedPhases: number[]; initialData: Partial<Phase6Data>; }) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'prd' | 'rollout' | 'marketing'>('prd');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [data, setData] = useState<Phase6Data>({
    userStories: initialData.userStories ?? [],
    rolloutStrategy: initialData.rolloutStrategy ?? defaultRollout(),
    marketingPlan: initialData.marketingPlan ?? { email: '', seo: '', paid: '', social: '', partnerships: '', inApp: '' },
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updated: Phase6Data) => { if (timer.current) clearTimeout(timer.current); setSaveStatus('saving'); timer.current = setTimeout(async () => { try { await savePhaseData(caseStudyId, 6, updated as unknown as Record<string, unknown>); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); } catch { setSaveStatus('error'); } }, 1500); }, [caseStudyId]);
  const update = (patch: Partial<Phase6Data>) => { const u = { ...data, ...patch }; setData(u); autoSave(u); };
  const handleNext = async () => { setSaveStatus('saving'); try { await savePhaseData(caseStudyId, 6, data as unknown as Record<string, unknown>, true); router.push(`/case-study/${caseStudyId}/phase-7`); } catch { setSaveStatus('error'); toast.error('Failed to save'); } };

  return (
    <PhaseLayout caseStudyId={caseStudyId} caseStudyTitle={caseStudyTitle} currentPhase={6} completedPhases={completedPhases} saveStatus={saveStatus} onNext={handleNext}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div><h1 className="text-xl font-bold text-primary-app mb-1">Execution & GTM Planning</h1><p className="text-sm text-muted-app">Build PRDs, define rollout stages, and plan your go-to-market strategy.</p></div>
        <div className="flex gap-2">{(['prd','rollout','marketing'] as const).map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${ activeTab === tab ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>{tab === 'prd' ? 'PRD Builder' : tab === 'rollout' ? 'Rollout Strategy' : 'Marketing Plan'}</button>))}</div>
        {activeTab === 'prd' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">User Stories</h2><button onClick={() => { const s = defaultStory(); update({ userStories: [...data.userStories, s] }); setExpandedStory(s.id); }} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Story</button></div>
            {data.userStories.map((story) => (
              <div key={story.id} className="card-app overflow-hidden">
                <button className="w-full text-left p-4" onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}>
                  <div className="text-sm text-secondary-app"><span className="text-muted-app">As a</span> <span className="font-medium text-primary-app">{story.asA || '...'}</span><span className="text-muted-app">, I want</span> <span className="font-medium text-primary-app">{story.iWant || '...'}</span><span className="text-muted-app">, so that</span> <span className="font-medium text-primary-app">{story.soThat || '...'}</span></div>
                </button>
                {expandedStory === story.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-app space-y-3">
                    <div className="grid grid-cols-3 gap-3">{(['asA','iWant','soThat'] as const).map((field) => (<div key={field}><label className="text-xs text-muted-app mb-1 block">{field === 'asA' ? 'As a...' : field === 'iWant' ? 'I want...' : 'So that...'}</label><input type="text" value={story[field]} onChange={(e) => update({ userStories: data.userStories.map((s) => s.id === story.id ? { ...s, [field]: e.target.value } : s) })} className="input-app text-sm" /></div>))}</div>
                    <div><div className="flex items-center justify-between mb-2"><label className="text-xs font-medium text-muted-app">Acceptance Criteria</label><button onClick={() => update({ userStories: data.userStories.map((s) => s.id === story.id ? { ...s, acceptanceCriteria: [...s.acceptanceCriteria, ''] } : s) })} className="text-xs text-accent-app hover:underline">+ Add</button></div>{story.acceptanceCriteria.map((criterion, idx) => (<div key={idx} className="flex gap-2 mb-1.5"><CheckCircle2 className="w-4 h-4 text-green-400 mt-2 shrink-0" /><input type="text" value={criterion} onChange={(e) => { const criteria = [...story.acceptanceCriteria]; criteria[idx] = e.target.value; update({ userStories: data.userStories.map((s) => s.id === story.id ? { ...s, acceptanceCriteria: criteria } : s) }); }} className="input-app text-sm flex-1" placeholder="Given/When/Then..." /></div>))}</div>
                    <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-muted-app mb-1 block">Edge Cases</label><textarea rows={2} value={story.edgeCases} onChange={(e) => update({ userStories: data.userStories.map((s) => s.id === story.id ? { ...s, edgeCases: e.target.value } : s) })} className="input-app resize-none text-sm" /></div><div><label className="text-xs text-muted-app mb-1 block">Dependencies</label><textarea rows={2} value={story.dependencies} onChange={(e) => update({ userStories: data.userStories.map((s) => s.id === story.id ? { ...s, dependencies: e.target.value } : s) })} className="input-app resize-none text-sm" /></div></div>
                    <button onClick={() => update({ userStories: data.userStories.filter((s) => s.id !== story.id) })} className="text-xs text-red-400 hover:underline">Remove story</button>
                  </div>
                )}
              </div>
            ))}
            {data.userStories.length === 0 && <div className="card-app p-8 text-center text-muted-app text-sm">No user stories yet.</div>}
          </div>
        )}
        {activeTab === 'rollout' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-primary-app">Rollout Strategy</h2>
            {ROLLOUT_STAGES.map((stageMeta, idx) => {
              const stageData = data.rolloutStrategy.find((s) => s.stage === stageMeta.stage) ?? { stage: stageMeta.stage, description: '', criteria: '', timeline: '' };
              return (<div key={stageMeta.stage} className="card-app p-5"><div className="flex items-center gap-3 mb-4"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm phase-${idx+1}-color font-bold`}>{idx+1}</div><div><div className="font-medium text-primary-app text-sm">{stageMeta.icon} {stageMeta.label}</div><div className="text-xs text-muted-app">{stageMeta.desc}</div></div></div><div className="grid grid-cols-3 gap-3"><div><label className="text-xs text-muted-app mb-1 block">Description</label><textarea rows={2} value={stageData.description} onChange={(e) => update({ rolloutStrategy: data.rolloutStrategy.map((s) => s.stage === stageMeta.stage ? { ...s, description: e.target.value } : s) })} className="input-app resize-none text-sm" /></div><div><label className="text-xs text-muted-app mb-1 block">Success Criteria</label><textarea rows={2} value={stageData.criteria} onChange={(e) => update({ rolloutStrategy: data.rolloutStrategy.map((s) => s.stage === stageMeta.stage ? { ...s, criteria: e.target.value } : s) })} className="input-app resize-none text-sm" /></div><div><label className="text-xs text-muted-app mb-1 block">Timeline</label><textarea rows={2} value={stageData.timeline} onChange={(e) => update({ rolloutStrategy: data.rolloutStrategy.map((s) => s.stage === stageMeta.stage ? { ...s, timeline: e.target.value } : s) })} className="input-app resize-none text-sm" /></div></div></div>);
            })}
          </div>
        )}
        {activeTab === 'marketing' && (
          <div className="space-y-4"><h2 className="font-semibold text-primary-app">Marketing Plan</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{MARKETING_CHANNELS.map((channel) => (<div key={channel} className="card-app p-5"><label className="block text-sm font-medium text-primary-app capitalize mb-2">{channel === 'seo' ? 'SEO' : channel === 'inApp' ? 'In-App Messaging' : channel.charAt(0).toUpperCase() + channel.slice(1)}</label><textarea rows={3} value={data.marketingPlan[channel]} onChange={(e) => update({ marketingPlan: { ...data.marketingPlan, [channel]: e.target.value } })} className="input-app resize-none text-sm" /></div>))}</div></div>
        )}
      </div>
    </PhaseLayout>
  );
}
