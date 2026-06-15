'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/theme-store';
import { Loader2, Save } from 'lucide-react';
import type { ThemeType } from '@/types';

const THEMES: { id: ThemeType; label: string; from: string; to: string }[] = [
  { id: 'aurora', label: 'Aurora', from: '#8B5CF6', to: '#EC4899' },
  { id: 'midnight', label: 'Midnight', from: '#06B6D4', to: '#3B82F6' },
  { id: 'minimal', label: 'Minimal', from: '#18181B', to: '#3F3F46' },
  { id: 'corporate', label: 'Corporate', from: '#EA580C', to: '#F97316' },
  { id: 'neon', label: 'Neon', from: '#9333EA', to: '#39FF14' },
];

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null };
  preferences: { theme: string; mode: string; aiAssistance: boolean; autoSave: boolean };
}

export function SettingsClient({ user, preferences }: Props) {
  const { setTheme } = useThemeStore();
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    theme: preferences.theme as ThemeType,
    mode: preferences.mode as 'compact' | 'detailed',
    aiAssistance: preferences.aiAssistance,
    autoSave: preferences.autoSave,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      setTheme(prefs.theme);
      document.documentElement.setAttribute('data-theme', prefs.theme);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Account */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-4">Account</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-white text-xl font-bold">{user.name?.[0] ?? user.email?.[0] ?? 'U'}</div>
          <div>
            <div className="font-medium text-primary-app">{user.name ?? 'User'}</div>
            <div className="text-sm text-muted-app">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-4">Visual Theme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setPrefs({ ...prefs, theme: t.id }); document.documentElement.setAttribute('data-theme', t.id); }}
              className={`p-4 rounded-xl border text-left transition-all ${ prefs.theme === t.id ? 'border-accent-app bg-accent-subtle-app' : 'border-app hover:border-border-hover-app' }`}
            >
              <div className="w-full h-8 rounded-lg mb-3" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
              <div className="text-sm font-medium text-primary-app">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-4">Workspace Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary-app mb-2 block">Display Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {(['detailed', 'compact'] as const).map((m) => (
                <button key={m} onClick={() => setPrefs({ ...prefs, mode: m })} className={`p-3 rounded-xl border text-sm font-medium transition-all capitalize ${ prefs.mode === m ? 'border-accent-app bg-accent-subtle-app text-accent-app' : 'border-app text-muted-app' }`}>
                  {m === 'detailed' ? '📋 Detailed' : '⚡ Compact'}
                </button>
              ))}
            </div>
          </div>
          {[{ key: 'aiAssistance', label: 'AI Assistance', desc: 'AI-powered suggestions and analysis', icon: '🤖' }, { key: 'autoSave', label: 'Auto Save', desc: 'Save automatically every 2 seconds', icon: '💾' }].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-4 rounded-xl border border-app">
              <div className="flex items-center gap-3"><span className="text-xl">{toggle.icon}</span><div><div className="text-sm font-medium text-primary-app">{toggle.label}</div><div className="text-xs text-muted-app">{toggle.desc}</div></div></div>
              <button onClick={() => setPrefs({ ...prefs, [toggle.key]: !prefs[toggle.key as keyof typeof prefs] })} className={`w-11 h-6 rounded-full transition-all relative ${ prefs[toggle.key as keyof typeof prefs] ? 'gradient-accent' : 'bg-app-tertiary' }`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${ prefs[toggle.key as keyof typeof prefs] ? 'left-5' : 'left-0.5' }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary py-3 px-6 disabled:opacity-50">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>
    </motion.div>
  );
}
