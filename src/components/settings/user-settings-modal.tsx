'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { X, User, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

interface UserSettingsModalProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  onClose: () => void;
}

export function UserSettingsModal({ user, onClose }: UserSettingsModalProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(user.image || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    setStatus('saving');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || undefined, image }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }
      
      setStatus('success');
      router.refresh();
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-app border border-app rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-app">
          <h2 className="text-lg font-bold text-primary-app">Account Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-md text-muted-app hover:text-primary-app hover:bg-app-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {status === 'error' && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
              {errorMessage}
            </div>
          )}
          {status === 'success' && (
            <div className="p-3 text-sm text-green-500 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          <div className="flex flex-col items-center gap-3 pb-2">
            <div className="relative group">
              {image ? (
                <img src={image} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-app shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {name?.[0] ?? email?.[0] ?? 'U'}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                Change
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-app uppercase tracking-wide mb-2">Display Name</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-muted-app" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-app w-full"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Jane Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-muted-app uppercase tracking-wide mb-2">Email Address</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-muted-app" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-app w-full"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="jane@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-muted-app uppercase tracking-wide mb-2">New Password (Optional)</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-muted-app" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-app w-full"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-app flex justify-end gap-3 bg-app-secondary/30">
          <button onClick={onClose} className="btn-ghost py-2">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={status === 'saving'}
            className="btn-primary py-2 min-w-[120px] justify-center"
          >
            {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
