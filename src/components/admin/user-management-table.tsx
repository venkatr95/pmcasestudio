'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, User, Users, ChevronDown, ChevronRight, FileText, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserManagementTable() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      router.refresh();
    } catch (e) {
      console.error(e);
      // Revert on error
      setUsers(users.map(u => u.id === userId ? { ...u, role: currentRole } : u));
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-app">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-app">User Management</h2>
          <p className="text-sm text-muted-app">Manage roles and review case study activity for all users.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-app" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-app pl-10 py-2 text-sm w-full"
          />
        </div>
      </div>

      <div className="bg-app border border-app rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-app-secondary/30 border-b border-app text-xs font-semibold text-muted-app uppercase tracking-wide">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Case Studies</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-app">No users found.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className="hover:bg-app-secondary/10 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name || 'User'} className="w-9 h-9 rounded-full object-cover border border-app shadow-sm" />
                        ) : (
                          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {user.name?.[0] ?? user.email?.[0] ?? 'U'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-primary-app">{user.name || 'Anonymous User'}</div>
                          <div className="text-xs text-muted-app">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-app">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-app-secondary text-xs font-semibold text-primary-app border border-app">
                        {user._count?.caseStudies || 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleRole(user.id, user.role)}
                          className="btn-ghost py-1.5 px-3 text-xs"
                          title="Toggle Role"
                        >
                          Make {user.role === 'ADMIN' ? 'User' : 'Admin'}
                        </button>
                        <button 
                          onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                          className={`p-1.5 rounded-md transition-colors ${expandedUserId === user.id ? 'bg-accent-subtle-app text-accent-app' : 'text-muted-app hover:bg-app-secondary hover:text-primary-app'}`}
                        >
                          {expandedUserId === user.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Content Row */}
                  <AnimatePresence>
                    {expandedUserId === user.id && (
                      <tr>
                        <td colSpan={5} className="p-0 border-b border-app">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-app-secondary/20 overflow-hidden"
                          >
                            <div className="p-5">
                              <h4 className="text-sm font-semibold text-primary-app flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-accent-app" />
                                User's Case Studies
                              </h4>
                              
                              {user.caseStudies && user.caseStudies.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {user.caseStudies.map((cs: any) => (
                                    <div key={cs.id} className="card-app p-3 flex items-start gap-3">
                                      <div className="w-8 h-8 rounded bg-accent-subtle-app border border-accent-app/20 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-accent-app">P{cs.currentPhase}</span>
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                        <h5 className="text-sm font-medium text-primary-app truncate">{cs.title}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                                            cs.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                            cs.status === 'in_progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                            'bg-app-secondary text-muted-app border-app'
                                          }`}>
                                            {cs.status.replace('_', ' ')}
                                          </span>
                                          <span className="text-xs text-muted-app truncate">Updated {new Date(cs.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-app p-4 text-center border border-dashed border-app rounded-lg">
                                  This user has not created any case studies yet.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
