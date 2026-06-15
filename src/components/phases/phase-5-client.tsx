'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import type { Phase5Data, RICEItem, MoSCoWItem } from '@/types';

const MOSCOW_COLUMNS: { id: MoSCoWItem['category']; label: string; color: string }[] = [
  { id: 'must', label: 'Must Have', color: 'text-red-400 bg-red-400/10' },
  { id: 'should', label: 'Should Have', color: 'text-orange-400 bg-orange-400/10' },
  { id: 'could', label: 'Could Have', color: 'text-blue-400 bg-blue-400/10' },
  { id: 'wont', label: "Won't Have", color: 'text-muted-app bg-app-tertiary' },
];

const defaultRICE = (): RICEItem => ({ id: crypto.randomUUID(), name: '', reach: 0, impact: 0, confidence: 0, effort: 0 });
const defaultMoSCoW = (): MoSCoWItem => ({ id: crypto.randomUUID(), name: '', category: 'must' });
const calcRICE = (item: RICEItem) => item.effort > 0 ? Math.round((item.reach * item.impact * (item.confidence / 100)) / item.effort) : 0;

export function Phase5Client({ caseStudyId, caseStudyTitle, completedPhases, initialData }: { caseStudyId: string; caseStudyTitle: string; completedPhases: number[]; initialData: Partial<Phase5Data>; }) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'rice' | 'moscow' | 'resources'>('rice');
  const [data, setData] = useState<Phase5Data>({
    riceItems: initialData.riceItems ?? [],
    moscowItems: initialData.moscowItems ?? [],
    resourcePlanning: initialData.resourcePlanning ?? { engineering: '', design: '', marketing: '', operations: '' },
    timeline: initialData.timeline ?? '',
    dependencies: initialData.dependencies ?? '',
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updated: Phase5Data) => { if (timer.current) clearTimeout(timer.current); setSaveStatus('saving'); timer.current = setTimeout(async () => { try { await savePhaseData(caseStudyId, 5, updated as unknown as Record<string, unknown>); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); } catch { setSaveStatus('error'); } }, 1500); }, [caseStudyId]);
  const update = (patch: Partial<Phase5Data>) => { const u = { ...data, ...patch }; setData(u); autoSave(u); };
  const handleNext = async () => { setSaveStatus('saving'); try { await savePhaseData(caseStudyId, 5, data as unknown as Record<string, unknown>, true); router.push(`/case-study/${caseStudyId}/phase-6`); } catch { setSaveStatus('error'); toast.error('Failed to save'); } };

  return (
    <PhaseLayout caseStudyId={caseStudyId} caseStudyTitle={caseStudyTitle} currentPhase={5} completedPhases={completedPhases} saveStatus={saveStatus} onNext={handleNext}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div><h1 className="text-xl font-bold text-primary-app mb-1">Prioritization & Decision Making</h1><p className="text-sm text-muted-app">Score and rank your initiatives using RICE, MoSCoW, and resource planning.</p></div>
        <div className="flex gap-2">
          {(['rice','moscow','resources'] as const).map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${ activeTab === tab ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>{tab === 'rice' ? 'RICE Scoring' : tab === 'moscow' ? 'MoSCoW' : 'Resources'}</button>))}
        </div>
        {activeTab === 'rice' && (
          <div>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-primary-app">RICE Scoring</h2><button onClick={() => update({ riceItems: [...data.riceItems, defaultRICE()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Initiative</button></div>
            <div className="card-app overflow-x-auto">
              <table className="w-full"><thead><tr className="text-xs text-muted-app uppercase border-b border-app"><th className="text-left p-3">Initiative</th><th className="p-3 text-center">Reach</th><th className="p-3 text-center">Impact</th><th className="p-3 text-center">Confidence%</th><th className="p-3 text-center">Effort</th><th className="p-3 text-center">Score</th><th className="p-3" /></tr></thead>
              <tbody>{data.riceItems.map((item) => (<tr key={item.id} className="border-b border-app"><td className="p-2"><input type="text" value={item.name} onChange={(e) => update({ riceItems: data.riceItems.map((r) => r.id === item.id ? { ...r, name: e.target.value } : r) })} placeholder="Initiative name" className="input-app text-sm" /></td>{(['reach','impact','confidence','effort'] as const).map((field) => (<td key={field} className="p-2"><input type="number" min={0} max={field === 'confidence' ? 100 : 10} value={item[field]} onChange={(e) => update({ riceItems: data.riceItems.map((r) => r.id === item.id ? { ...r, [field]: Number(e.target.value) } : r) })} className="input-app text-sm text-center w-20" /></td>))}<td className="p-2 text-center"><span className="text-sm font-bold text-accent-app">{calcRICE(item)}</span></td><td className="p-2"><button onClick={() => update({ riceItems: data.riceItems.filter((r) => r.id !== item.id) })} className="p-1.5 text-muted-app hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody></table>
              {data.riceItems.length === 0 && <p className="text-center text-muted-app text-sm py-8">No initiatives yet.</p>}
            </div>
          </div>
        )}
        {activeTab === 'moscow' && (
          <div>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-primary-app">MoSCoW Prioritization</h2><button onClick={() => update({ moscowItems: [...data.moscowItems, defaultMoSCoW()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Item</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOSCOW_COLUMNS.map((col) => (
                <div key={col.id} className="card-app p-4"><div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${col.color}`}>{col.label}</div><div className="space-y-2">{data.moscowItems.filter((i) => i.category === col.id).map((item) => (<div key={item.id} className="flex gap-2 items-start"><input type="text" value={item.name} onChange={(e) => update({ moscowItems: data.moscowItems.map((m) => m.id === item.id ? { ...m, name: e.target.value } : m) })} placeholder="Feature" className="input-app text-xs py-1.5 flex-1" /><button onClick={() => update({ moscowItems: data.moscowItems.filter((m) => m.id !== item.id) })} className="p-1.5 text-muted-app hover:text-red-400 shrink-0 mt-0.5"><Trash2 className="w-3.5 h-3.5" /></button></div>))}{data.moscowItems.filter((i) => i.category === col.id).length === 0 && <p className="text-xs text-muted-app text-center py-4">Drop items here</p>}</div></div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-primary-app">Resource Planning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['engineering','design','marketing','operations'] as const).map((team) => (<div key={team} className="card-app p-5"><label className="block text-sm font-medium text-primary-app capitalize mb-2">{team}</label><textarea rows={3} value={data.resourcePlanning[team]} onChange={(e) => update({ resourcePlanning: { ...data.resourcePlanning, [team]: e.target.value } })} placeholder={`${team} resources needed...`} className="input-app resize-none text-sm" /></div>))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-app p-5"><label className="block text-sm font-medium text-primary-app mb-2">Timeline</label><textarea rows={3} value={data.timeline} onChange={(e) => update({ timeline: e.target.value })} className="input-app resize-none text-sm" /></div>
              <div className="card-app p-5"><label className="block text-sm font-medium text-primary-app mb-2">Dependencies</label><textarea rows={3} value={data.dependencies} onChange={(e) => update({ dependencies: e.target.value })} className="input-app resize-none text-sm" /></div>
            </div>
          </div>
        )}
      </div>
    </PhaseLayout>
  );
}
