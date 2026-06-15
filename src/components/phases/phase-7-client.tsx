'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, Trash2, AlertTriangle, BarChart3 } from 'lucide-react';
import type { Phase7Data, Risk, TradeOff, RoadmapItem } from '@/types';

const RISK_CATEGORIES = ['product', 'engineering', 'security', 'legal', 'adoption'] as const;
const LIKELIHOOD_COLORS = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };
const IMPACT_COLORS = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' };
const ROADMAP_TIMEFRAMES = [{ id: 'now', label: 'Now', desc: '0-3 months', color: 'phase-3-color' }, { id: 'next', label: 'Next', desc: '3-6 months', color: 'phase-5-color' }, { id: 'later', label: 'Later', desc: '6+ months', color: 'phase-7-color' }] as const;

const defaultRisk = (): Risk => ({ id: crypto.randomUUID(), category: 'product', description: '', likelihood: 'medium', impact: 'medium', mitigation: '' });
const defaultTradeOff = (): TradeOff => ({ id: crypto.randomUUID(), title: '', pros: '', cons: '', rationale: '' });
const defaultRoadmapItem = (): RoadmapItem => ({ id: crypto.randomUUID(), title: '', description: '', timeframe: 'now', priority: 'p2', status: 'planned' });

export function Phase7Client({ caseStudyId, caseStudyTitle, completedPhases, initialData }: { caseStudyId: string; caseStudyTitle: string; completedPhases: number[]; initialData: Partial<Phase7Data>; }) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'risks' | 'tradeoffs' | 'roadmap' | 'swot'>('risks');
  const [data, setData] = useState<Phase7Data>({
    risks: initialData.risks ?? [],
    tradeOffs: initialData.tradeOffs ?? [],
    roadmapItems: initialData.roadmapItems ?? [],
    swot: initialData.swot ?? { strengths: [], weaknesses: [], opportunities: [], threats: [] },
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSave = useCallback((updated: Phase7Data) => { if (timer.current) clearTimeout(timer.current); setSaveStatus('saving'); timer.current = setTimeout(async () => { try { await savePhaseData(caseStudyId, 7, updated as unknown as Record<string, unknown>); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); } catch { setSaveStatus('error'); } }, 1500); }, [caseStudyId]);
  const update = (patch: Partial<Phase7Data>) => { const u = { ...data, ...patch }; setData(u); autoSave(u); };
  const handleNext = async () => { setSaveStatus('saving'); try { await savePhaseData(caseStudyId, 7, data as unknown as Record<string, unknown>, true); router.push(`/case-study/${caseStudyId}/deliverables`); } catch { setSaveStatus('error'); toast.error('Failed to save'); } };

  return (
    <PhaseLayout caseStudyId={caseStudyId} caseStudyTitle={caseStudyTitle} currentPhase={7} completedPhases={completedPhases} saveStatus={saveStatus} onNext={handleNext}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div><h1 className="text-xl font-bold text-primary-app mb-1">Trade-Offs, Risks & Roadmap</h1><p className="text-sm text-muted-app">Document risks, trade-off decisions, and plan your product roadmap.</p></div>
        <div className="flex gap-2 flex-wrap">{(['risks','tradeoffs','roadmap','swot'] as const).map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${ activeTab === tab ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>{tab === 'risks' ? 'Risk Register' : tab === 'tradeoffs' ? 'Trade-Offs' : tab === 'roadmap' ? 'Roadmap' : 'SWOT'}</button>))}</div>

        {/* Risks */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">Risk Register</h2><button onClick={() => update({ risks: [...data.risks, defaultRisk()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Risk</button></div>
            {data.risks.map((risk) => (
              <div key={risk.id} className="card-app p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div><label className="text-xs text-muted-app mb-1 block">Category</label><select value={risk.category} onChange={(e) => update({ risks: data.risks.map((r) => r.id === risk.id ? { ...r, category: e.target.value as Risk['category'] } : r) })} className="input-app text-sm capitalize">{RISK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div><label className="text-xs text-muted-app mb-1 block">Likelihood</label><select value={risk.likelihood} onChange={(e) => update({ risks: data.risks.map((r) => r.id === risk.id ? { ...r, likelihood: e.target.value as Risk['likelihood'] } : r) })} className={`input-app text-sm ${LIKELIHOOD_COLORS[risk.likelihood]}`}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                  <div><label className="text-xs text-muted-app mb-1 block">Impact</label><select value={risk.impact} onChange={(e) => update({ risks: data.risks.map((r) => r.id === risk.id ? { ...r, impact: e.target.value as Risk['impact'] } : r) })} className={`input-app text-sm ${IMPACT_COLORS[risk.impact]}`}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                  <div className="flex items-end"><button onClick={() => update({ risks: data.risks.filter((r) => r.id !== risk.id) })} className="p-2 text-muted-app hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-app mb-1 block">Risk Description</label><textarea rows={2} value={risk.description} onChange={(e) => update({ risks: data.risks.map((r) => r.id === risk.id ? { ...r, description: e.target.value } : r) })} className="input-app resize-none text-sm" placeholder="Describe the risk..." /></div>
                  <div><label className="text-xs text-muted-app mb-1 block">Mitigation Strategy</label><textarea rows={2} value={risk.mitigation} onChange={(e) => update({ risks: data.risks.map((r) => r.id === risk.id ? { ...r, mitigation: e.target.value } : r) })} className="input-app resize-none text-sm" placeholder="How will you mitigate this?" /></div>
                </div>
              </div>
            ))}
            {data.risks.length === 0 && <div className="card-app p-8 text-center"><AlertTriangle className="w-8 h-8 text-muted-app mx-auto mb-3 opacity-40" /><p className="text-muted-app text-sm">No risks documented yet.</p></div>}
          </div>
        )}

        {/* Trade-offs */}
        {activeTab === 'tradeoffs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">Trade-Off Log</h2><button onClick={() => update({ tradeOffs: [...data.tradeOffs, defaultTradeOff()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Trade-Off</button></div>
            {data.tradeOffs.map((to) => (
              <div key={to.id} className="card-app p-5">
                <div className="flex items-start gap-3 mb-4">
                  <input type="text" value={to.title} onChange={(e) => update({ tradeOffs: data.tradeOffs.map((t) => t.id === to.id ? { ...t, title: e.target.value } : t) })} placeholder="Trade-off title..." className="input-app font-medium flex-1" />
                  <button onClick={() => update({ tradeOffs: data.tradeOffs.filter((t) => t.id !== to.id) })} className="p-2 text-muted-app hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs font-medium text-green-400 mb-1 block">Pros</label><textarea rows={3} value={to.pros} onChange={(e) => update({ tradeOffs: data.tradeOffs.map((t) => t.id === to.id ? { ...t, pros: e.target.value } : t) })} className="input-app resize-none text-sm" placeholder="Benefits..." /></div>
                  <div><label className="text-xs font-medium text-red-400 mb-1 block">Cons</label><textarea rows={3} value={to.cons} onChange={(e) => update({ tradeOffs: data.tradeOffs.map((t) => t.id === to.id ? { ...t, cons: e.target.value } : t) })} className="input-app resize-none text-sm" placeholder="Drawbacks..." /></div>
                  <div><label className="text-xs font-medium text-muted-app mb-1 block">Rationale</label><textarea rows={3} value={to.rationale} onChange={(e) => update({ tradeOffs: data.tradeOffs.map((t) => t.id === to.id ? { ...t, rationale: e.target.value } : t) })} className="input-app resize-none text-sm" placeholder="Why this decision?" /></div>
                </div>
              </div>
            ))}
            {data.tradeOffs.length === 0 && <div className="card-app p-8 text-center text-muted-app text-sm">No trade-offs documented yet.</div>}
          </div>
        )}

        {/* Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-primary-app">Product Roadmap</h2><button onClick={() => update({ roadmapItems: [...data.roadmapItems, defaultRoadmapItem()] })} className="btn-secondary py-1.5 px-3 text-xs"><Plus className="w-3.5 h-3.5" /> Add Item</button></div>
            {ROADMAP_TIMEFRAMES.map((tf) => {
              const items = data.roadmapItems.filter((i) => i.timeframe === tf.id);
              return (
                <div key={tf.id}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-3 ${tf.color}`}><BarChart3 className="w-4 h-4" />{tf.label} <span className="font-normal opacity-70">({tf.desc})</span></div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="card-app p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <select value={item.priority} onChange={(e) => update({ roadmapItems: data.roadmapItems.map((r) => r.id === item.id ? { ...r, priority: e.target.value as RoadmapItem['priority'] } : r) })} className="input-app text-xs py-1 w-16">{['p1','p2','p3'].map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}</select>
                          <input type="text" value={item.title} onChange={(e) => update({ roadmapItems: data.roadmapItems.map((r) => r.id === item.id ? { ...r, title: e.target.value } : r) })} placeholder="Initiative title..." className="input-app text-sm font-medium flex-1" />
                          <select value={item.status} onChange={(e) => update({ roadmapItems: data.roadmapItems.map((r) => r.id === item.id ? { ...r, status: e.target.value as RoadmapItem['status'] } : r) })} className="input-app text-xs py-1 w-28">{['planned','in_progress','done'].map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}</select>
                          <button onClick={() => update({ roadmapItems: data.roadmapItems.filter((r) => r.id !== item.id) })} className="p-1.5 text-muted-app hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <input type="text" value={item.description} onChange={(e) => update({ roadmapItems: data.roadmapItems.map((r) => r.id === item.id ? { ...r, description: e.target.value } : r) })} placeholder="Brief description..." className="input-app text-xs" />
                      </div>
                    ))}
                    {items.length === 0 && <div className="card-app p-4 text-center text-muted-app text-xs border-dashed">No items in {tf.label}. Add an item and assign it here.</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SWOT */}
        {activeTab === 'swot' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-primary-app">SWOT Analysis</h2>
              <button 
                onClick={async () => {
                  toast.loading('Generating AI SWOT...', { id: 'ai' });
                  try {
                    const res = await fetch('/api/ai/generate', { method: 'POST', body: JSON.stringify({ type: 'swot', prompt: `Generate a SWOT analysis.` }) });
                    const d = await res.json();
                    toast.success('Generated! See console for output.', { id: 'ai' });
                    console.log('AI Output:', d.text);
                  } catch {
                    toast.error('AI generation failed', { id: 'ai' });
                  }
                }}
                className="btn-secondary py-1.5 px-3 text-xs text-purple-400 border-purple-400/20 bg-purple-400/10 hover:bg-purple-400/20"
              >✨ Generate with AI</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {([
                { key: 'strengths', label: 'Strengths', color: 'text-green-400 bg-green-400/10 border-green-400/20', emoji: '✅' },
                { key: 'weaknesses', label: 'Weaknesses', color: 'text-red-400 bg-red-400/10 border-red-400/20', emoji: '⚠️' },
                { key: 'opportunities', label: 'Opportunities', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', emoji: '🚀' },
                { key: 'threats', label: 'Threats', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', emoji: '⚡' },
              ] as const).map((quadrant) => (
                <div key={quadrant.key} className={`p-5 rounded-xl border ${quadrant.color}`}>
                  <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm">{quadrant.emoji} {quadrant.label}</h3><button onClick={() => update({ swot: { ...data.swot, [quadrant.key]: [...data.swot[quadrant.key], ''] } })} className="text-xs opacity-70 hover:opacity-100">+ Add</button></div>
                  <div className="space-y-2">
                    {data.swot[quadrant.key].map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={item} onChange={(e) => { const arr = [...data.swot[quadrant.key]]; arr[idx] = e.target.value; update({ swot: { ...data.swot, [quadrant.key]: arr } }); }} className="input-app text-xs py-1.5 flex-1" placeholder={`${quadrant.label.slice(0,-1)} point...`} />
                        <button onClick={() => { const arr = data.swot[quadrant.key].filter((_, i) => i !== idx); update({ swot: { ...data.swot, [quadrant.key]: arr } }); }} className="p-1 text-muted-app hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    {data.swot[quadrant.key].length === 0 && <p className="text-xs opacity-50 text-center py-2">Click + Add to start</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PhaseLayout>
  );
}
