'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseLayout } from '@/components/case-study/phase-layout';
import { savePhaseData } from '@/lib/actions/case-studies';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import type { Phase1Data } from '@/types';

const BUSINESS_GOALS = [
  { id: 'revenue_growth', label: 'Revenue Growth', icon: '📈' },
  { id: 'retention', label: 'Retention', icon: '🔄' },
  { id: 'acquisition', label: 'Acquisition', icon: '🎯' },
  { id: 'expansion', label: 'Expansion', icon: '🌍' },
  { id: 'other', label: 'Other', icon: '⚡' },
];

const CONSTRAINT_TYPES = ['Budget', 'Engineering Capacity', 'Timeline', 'Compliance', 'Technical Debt', 'Other'];

export function Phase1Client({
  caseStudyId,
  caseStudyTitle,
  completedPhases,
  initialData,
}: {
  caseStudyId: string;
  caseStudyTitle: string;
  completedPhases: number[];
  initialData: Partial<Phase1Data>;
}) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [data, setData] = useState<Phase1Data>({
    problemStatement: initialData.problemStatement ?? '',
    businessGoal: initialData.businessGoal ?? '',
    constraints: initialData.constraints ?? [],
    assumptions: initialData.assumptions ?? '',
    dependencies: initialData.dependencies ?? '',
  });
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAutoSave = useCallback(
    (updated: Phase1Data) => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      setSaveStatus('saving');
      autoSaveTimer.current = setTimeout(async () => {
        try {
          await savePhaseData(caseStudyId, 1, updated as unknown as Record<string, unknown>);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
          setSaveStatus('error');
        }
      }, 1500);
    },
    [caseStudyId]
  );

  const update = (patch: Partial<Phase1Data>) => {
    const updated = { ...data, ...patch };
    setData(updated);
    triggerAutoSave(updated);
  };

  const addConstraint = () => {
    update({
      constraints: [...data.constraints, { id: crypto.randomUUID(), type: 'Budget', description: '' }],
    });
  };

  const removeConstraint = (id: string) => {
    update({ constraints: data.constraints.filter((c) => c.id !== id) });
  };

  const handleNext = async () => {
    if (!data.problemStatement.trim()) { toast.error('Problem statement is required'); return; }
    setSaveStatus('saving');
    try {
      await savePhaseData(caseStudyId, 1, data as unknown as Record<string, unknown>, true);
      setSaveStatus('saved');
      router.push(`/case-study/${caseStudyId}/phase-2`);
    } catch {
      setSaveStatus('error');
      toast.error('Failed to save phase data');
    }
  };

  return (
    <PhaseLayout
      caseStudyId={caseStudyId}
      caseStudyTitle={caseStudyTitle}
      currentPhase={1}
      completedPhases={completedPhases}
      saveStatus={saveStatus}
      canGoNext={!!data.problemStatement.trim()}
      onNext={handleNext}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-primary-app mb-1">Problem Definition & Context</h1>
          <p className="text-sm text-muted-app">Define the core problem you are solving and the business context around it.</p>
        </div>

        {/* Problem Statement */}
        <div className="card-app p-6">
          <label className="block text-sm font-semibold text-primary-app mb-1">
            Problem Statement <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-muted-app mb-3">One concise sentence that captures the core problem.</p>
          <textarea
            value={data.problemStatement}
            onChange={(e) => update({ problemStatement: e.target.value })}
            rows={3}
            placeholder="e.g., Users churn within the first 7 days because they fail to experience the core value of the product..."
            className="input-app resize-none text-sm"
          />
          <p className="text-xs text-muted-app mt-2">{data.problemStatement.length}/300 characters</p>
        </div>

        {/* Business Goal */}
        <div className="card-app p-6">
          <label className="block text-sm font-semibold text-primary-app mb-3">Business Goal</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BUSINESS_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => update({ businessGoal: goal.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  data.businessGoal === goal.id
                    ? 'border-accent-app bg-accent-subtle-app'
                    : 'border-app hover:border-border-hover-app'
                }`}
              >
                <span className="text-lg block mb-1">{goal.icon}</span>
                <span className="text-xs font-medium text-primary-app">{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="card-app p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-semibold text-primary-app">Constraints</label>
              <p className="text-xs text-muted-app">List known limitations that impact the solution.</p>
            </div>
            <button onClick={addConstraint} className="btn-secondary py-1.5 px-3 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {data.constraints.map((constraint) => (
              <div key={constraint.id} className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-2">
                <select
                  value={constraint.type}
                  onChange={(e) => update({ constraints: data.constraints.map((c) => c.id === constraint.id ? { ...c, type: e.target.value } : c) })}
                  className="input-app w-full sm:w-48 shrink-0"
                >
                  {CONSTRAINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  type="text"
                  value={constraint.description}
                  onChange={(e) => update({ constraints: data.constraints.map((c) => c.id === constraint.id ? { ...c, description: e.target.value } : c) })}
                  placeholder="Describe the constraint..."
                  className="input-app flex-1 min-w-[150px]"
                />
                <button
                  onClick={() => removeConstraint(constraint.id)}
                  className="p-2 text-muted-app hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.constraints.length === 0 && (
              <p className="text-xs text-muted-app text-center py-4">No constraints added yet. Click Add to start.</p>
            )}
          </div>
        </div>

        {/* Assumptions */}
        <div className="card-app p-6">
          <label className="block text-sm font-semibold text-primary-app mb-1">Assumptions</label>
          <p className="text-xs text-muted-app mb-3">What are you assuming to be true about the market, users, or technical constraints?</p>
          <textarea
            value={data.assumptions}
            onChange={(e) => update({ assumptions: e.target.value })}
            rows={4}
            placeholder="e.g., We assume that users who complete onboarding have a 60%+ chance of converting..."
            className="input-app resize-none text-sm"
          />
        </div>

        {/* Dependencies */}
        <div className="card-app p-6">
          <label className="block text-sm font-semibold text-primary-app mb-1">Dependencies</label>
          <p className="text-xs text-muted-app mb-3">List any external dependencies, teams, or systems this solution relies on.</p>
          <textarea
            value={data.dependencies}
            onChange={(e) => update({ dependencies: e.target.value })}
            rows={4}
            placeholder="e.g., Requires data from analytics team, integration with payment gateway..."
            className="input-app resize-none text-sm"
          />
        </div>
      </div>
    </PhaseLayout>
  );
}
