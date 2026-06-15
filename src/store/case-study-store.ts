'use client';
import { create } from 'zustand';
import type {
  Phase1Data, Phase2Data, Phase3Data, Phase4Data,
  Phase5Data, Phase6Data, Phase7Data
} from '@/types';

interface CaseStudyStore {
  id: string | null;
  title: string;
  currentPhase: number;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  phase1: Partial<Phase1Data>;
  phase2: Partial<Phase2Data>;
  phase3: Partial<Phase3Data>;
  phase4: Partial<Phase4Data>;
  phase5: Partial<Phase5Data>;
  phase6: Partial<Phase6Data>;
  phase7: Partial<Phase7Data>;
  setId: (id: string) => void;
  setTitle: (title: string) => void;
  setCurrentPhase: (phase: number) => void;
  setAutoSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setPhase1: (data: Partial<Phase1Data>) => void;
  setPhase2: (data: Partial<Phase2Data>) => void;
  setPhase3: (data: Partial<Phase3Data>) => void;
  setPhase4: (data: Partial<Phase4Data>) => void;
  setPhase5: (data: Partial<Phase5Data>) => void;
  setPhase6: (data: Partial<Phase6Data>) => void;
  setPhase7: (data: Partial<Phase7Data>) => void;
  reset: () => void;
}

const initialState = {
  id: null,
  title: '',
  currentPhase: 1,
  autoSaveStatus: 'idle' as const,
  phase1: {},
  phase2: {},
  phase3: {},
  phase4: {},
  phase5: {},
  phase6: {},
  phase7: {},
};

export const useCaseStudyStore = create<CaseStudyStore>((set) => ({
  ...initialState,
  setId: (id) => set({ id }),
  setTitle: (title) => set({ title }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),
  setPhase1: (data) => set((s) => ({ phase1: { ...s.phase1, ...data } })),
  setPhase2: (data) => set((s) => ({ phase2: { ...s.phase2, ...data } })),
  setPhase3: (data) => set((s) => ({ phase3: { ...s.phase3, ...data } })),
  setPhase4: (data) => set((s) => ({ phase4: { ...s.phase4, ...data } })),
  setPhase5: (data) => set((s) => ({ phase5: { ...s.phase5, ...data } })),
  setPhase6: (data) => set((s) => ({ phase6: { ...s.phase6, ...data } })),
  setPhase7: (data) => set((s) => ({ phase7: { ...s.phase7, ...data } })),
  reset: () => set(initialState),
}));
