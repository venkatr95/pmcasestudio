'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeStore } from '@/store/theme-store';
import { useUIStore } from '@/store/ui-store';
import {
  LayoutDashboard, FileText, BookOpen, BookText, GraduationCap, Download, Settings,
  Plus, ChevronRight, LogOut, Bell, Search,
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import type { ThemeType } from '@/types';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserSettingsModal } from '@/components/settings/user-settings-modal';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/templates', label: 'Templates', icon: BookOpen },
  { href: '/glossary', label: 'Glossary', icon: BookText },
  { href: '/guide', label: 'PM Guide', icon: GraduationCap },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const ADMIN_ITEM = { href: '/admin', label: 'Admin Panel', icon: Settings };

const THEMES: { id: ThemeType; label: string; from: string; to: string }[] = [
  { id: 'aurora', label: 'Aurora', from: '#8B5CF6', to: '#EC4899' },
  { id: 'midnight', label: 'Midnight', from: '#06B6D4', to: '#3B82F6' },
  { id: 'minimal', label: 'Minimal', from: '#18181B', to: '#3F3F46' },
  { id: 'corporate', label: 'Corporate', from: '#EA580C', to: '#F97316' },
  { id: 'neon', label: 'Neon', from: '#9333EA', to: '#39FF14' },
];

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string };
  preferences: { theme: string; mode: string };
}

export function DashboardShell({ children, user, preferences }: DashboardShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useThemeStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    setMounted(true);
    setTheme(preferences.theme as ThemeType);
  }, [preferences.theme, setTheme]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-app overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="bg-sidebar-app border-r border-app flex flex-col overflow-hidden shrink-0"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-app">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0 glow-accent-sm">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <path d="M6 8h20M6 14h14M6 20h10M6 26h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm text-primary-app whitespace-nowrap">PM Case Studio</div>
                <div className="text-xs text-muted-app whitespace-nowrap">Professional Workspace</div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="px-4 pt-4 pb-2">
              <Link
                href="/case-study/new"
                className="btn-primary w-full justify-center py-2.5 text-sm"
              >
                <Plus className="w-4 h-4" /> New Case Study
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
              {[...NAV_ITEMS, ...(user.role === 'ADMIN' ? [ADMIN_ITEM] : [])].map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent-subtle-app text-accent-app border border-accent-app/20'
                        : 'text-muted-app hover:text-primary-app hover:bg-app-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </nav>

            {/* Theme Switcher */}
            <div className="px-4 py-3 border-t border-app space-y-4">
              <div>
                <p className="text-xs text-muted-app mb-2 px-1">Mode</p>
                <ThemeToggle />
              </div>
              <div>
                <p className="text-xs text-muted-app mb-2 px-1">Color Theme</p>
                <div className="flex gap-1.5">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      title={t.label}
                      className={`w-6 h-6 rounded-full transition-all ${
                        theme === t.id ? 'ring-2 ring-offset-1 ring-offset-transparent scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
                        '--tw-ring-color': t.from,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* User */}
            <div className="px-3 py-3 border-t border-app">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name?.[0] ?? user.email?.[0] ?? 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-primary-app truncate">{user.name ?? 'User'}</div>
                  <div className="text-xs text-muted-app truncate">{user.email}</div>
                </div>
                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = '/login';
                  }}
                  className="p-1.5 rounded-md text-muted-app hover:text-primary-app hover:bg-app-secondary transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-app bg-app-secondary/50 backdrop-blur-sm shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-muted-app hover:text-primary-app hover:bg-app-secondary transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-app" />
              <input
                type="text"
                placeholder="Search case studies..."
                className="input-app pl-10 py-2 text-sm bg-app"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4 relative">
            <button className="p-2 rounded-lg text-muted-app hover:text-primary-app hover:bg-app-secondary transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-app shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold border border-app shadow-sm hover:scale-105 transition-transform">
                    {user.name?.[0] ?? user.email?.[0] ?? 'U'}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 bg-app border border-app rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-app bg-app-secondary/30">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name || 'User'} className="w-10 h-10 rounded-full object-cover border border-app" />
                        ) : (
                          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {user.name?.[0] ?? user.email?.[0] ?? 'U'}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <div className="text-sm font-semibold text-primary-app truncate">{user.name || 'User'}</div>
                          <div className="text-xs text-muted-app truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsSettingsModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-app hover:text-primary-app hover:bg-app-secondary rounded-lg transition-colors text-left"
                      >
                        <Settings className="w-4 h-4" /> Account Settings
                      </button>
                    </div>
                    
                    <div className="p-2 border-t border-app">
                      <button 
                        onClick={async () => {
                          await signOut({ redirect: false });
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
      
      {isSettingsModalOpen && (
        <UserSettingsModal user={user as any} onClose={() => setIsSettingsModalOpen(false)} />
      )}
    </div>
  );
}
