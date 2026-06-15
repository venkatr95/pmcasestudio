'use client';
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  commandOpen: boolean;
  activeModal: string | null;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarOpen: true,
  commandOpen: false,
  activeModal: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
}));
