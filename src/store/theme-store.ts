'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeType } from '@/types';

interface ThemeStore {
  theme: ThemeType;
  mode: 'compact' | 'detailed';
  setTheme: (theme: ThemeType) => void;
  setMode: (mode: 'compact' | 'detailed') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'aurora',
      mode: 'detailed',
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
    }),
    { name: 'pm-theme' }
  )
);
