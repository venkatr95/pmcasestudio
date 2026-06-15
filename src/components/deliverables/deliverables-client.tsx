'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Download, FileText, Presentation, Code, Archive, FileJson, Loader2, CheckCircle, Share2, Mail, Copy } from 'lucide-react';
import Link from 'next/link';
import type { ExportFormat } from '@/types';

interface Props {
  caseStudy: { id: string; title: string; status: string; progress: number };
  completedPhases: number[];
  phases: { phase: number; data: string; completed: boolean }[];
}

const EXPORT_OPTIONS: { format: ExportFormat; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { format: 'pdf', label: 'PDF Report', desc: 'Branded, print-ready PDF with all phases', icon: FileText, color: 'phase-1-color' },
  { format: 'docx', label: 'Word Document', desc: 'Editable DOCX with structured content', icon: FileText, color: 'phase-2-color' },
  { format: 'pptx', label: 'PowerPoint Deck', desc: 'Presentation-ready PPTX slides', icon: Presentation, color: 'phase-3-color' },
  { format: 'marp', label: 'Marp Deck', desc: 'Markdown-based presentation slides', icon: Presentation, color: 'phase-4-color' },
  { format: 'markdown', label: 'Markdown', desc: 'Clean markdown for Notion, GitHub', icon: Code, color: 'phase-5-color' },
  { format: 'json', label: 'JSON Export', desc: 'Full data export for import/backup', icon: FileJson, color: 'phase-6-color' },
  { format: 'zip', label: 'ZIP Bundle', desc: 'All formats in a single download', icon: Archive, color: 'phase-7-color' },
];

const DELIVERABLE_DOCS = [
  { id: 'summary', label: 'Executive Summary', icon: '📋', desc: 'Board-ready one-page summary' },
  { id: 'strategy', label: 'Product Strategy Doc', icon: '🎯', desc: 'Full strategy with vision & metrics' },
  { id: 'prd', label: 'PRD Summary', icon: '📝', desc: 'Requirements & user stories' },
  { id: 'roadmap', label: 'Product Roadmap', icon: '🗺️', desc: 'Now/Next/Later visual timeline' },
  { id: 'deck', label: 'Presentation Deck', icon: '🎨', desc: 'Investor/stakeholder presentation' },
];

export function DeliverablesClient({ caseStudy, completedPhases, phases }: Props) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    try {
      const response = await fetch(`/api/exports/${caseStudy.id}/${format}`, { method: 'POST' });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const isPdfSlice = ['summary', 'strategy', 'prd', 'roadmap'].includes(format);
      const extension = format === 'zip' ? 'zip' : format === 'markdown' || format === 'marp' ? 'md' : isPdfSlice ? 'pdf' : format;
      const fileNameSuffix = isPdfSlice ? `_${format}` : '';
      
      a.download = `${caseStudy.title.replace(/[^a-z0-9]/gi, '_')}${fileNameSuffix}.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} exported successfully!`);
    } catch {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setExporting(null);
    }
  };

  const handleShare = async () => {
    if (!shareEmail) return;
    setSharing(true);
    try {
      await fetch(`/api/case-studies/${caseStudy.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: shareEmail }),
      });
      toast.success(`Case study shared with ${shareEmail}`);
      setShareEmail('');
    } catch {
      toast.error('Failed to share. Check SMTP settings.');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/case-study/${caseStudy.id}`);
    toast.success('Link copied to clipboard!');
  };

  const generateMarkdown = () => {
    const content = phases.map((p) => {
      const data = JSON.parse(p.data) as Record<string, unknown>;
      return `## Phase ${p.phase}\n\n${JSON.stringify(data, null, 2)}`;
    }).join('\n\n---\n\n');
    const blob = new Blob([`# ${caseStudy.title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseStudy.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Markdown exported!');
  };

  const generateJSON = () => {
    const data = { caseStudy, phases: phases.map((p) => ({ ...p, data: JSON.parse(p.data) })) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${caseStudy.title.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON exported!');
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link href={`/case-study/${caseStudy.id}/phase-7`} className="text-sm text-muted-app hover:text-primary-app transition-colors">← Back to Phase 7</Link>
        </div>
        <h1 className="text-2xl font-bold text-primary-app">Deliverables</h1>
        <p className="text-muted-app mt-1">Generate and export your case study in multiple formats.</p>
      </div>

      {/* Progress */}
      <div className="card-app p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-primary-app">Completion Status</h2>
          <span className="text-2xl font-bold gradient-accent-text">{caseStudy.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-app-secondary overflow-hidden mb-3">
          <div className="h-full rounded-full gradient-accent transition-all" style={{ width: `${caseStudy.progress}%` }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[1,2,3,4,5,6,7].map((ph) => (
            <Link key={ph} href={`/case-study/${caseStudy.id}/phase-${ph}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${ completedPhases.includes(ph) ? 'gradient-accent text-white' : 'border border-app text-muted-app hover:border-border-hover-app' }`}>
              {completedPhases.includes(ph) ? <CheckCircle className="w-3 h-3" /> : <span>{ph}</span>}
              Phase {ph}
            </Link>
          ))}
        </div>
      </div>

      {/* Generated Documents */}
      <div>
        <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide mb-4">Generated Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DELIVERABLE_DOCS.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-app p-5">
              <div className="text-3xl mb-3">{doc.icon}</div>
              <h3 className="font-semibold text-primary-app text-sm mb-1">{doc.label}</h3>
              <p className="text-xs text-muted-app mb-4">{doc.desc}</p>
              <button onClick={() => {
                if (doc.id === 'deck') handleExport('pptx');
                else handleExport(doc.id as ExportFormat);
              }} className="btn-secondary py-1.5 px-3 text-xs w-full justify-center">
                <Download className="w-3.5 h-3.5" /> Generate {doc.id === 'deck' ? 'PPTX' : 'PDF'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Formats */}
      <div>
        <h2 className="text-sm font-semibold text-muted-app uppercase tracking-wide mb-4">Export Formats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPORT_OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            const isExporting = exporting === opt.format;
            return (
              <motion.button
                key={opt.format}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => {
                  if (opt.format === 'markdown') { generateMarkdown(); return; }
                  if (opt.format === 'json') { generateJSON(); return; }
                  handleExport(opt.format);
                }}
                disabled={!!exporting}
                className="card-app p-4 text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${opt.color}`}>
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary-app group-hover:text-accent-app transition-colors">{opt.label}</div>
                    <div className="text-xs text-muted-app">{opt.desc}</div>
                  </div>
                  <Download className="w-4 h-4 text-muted-app ml-auto group-hover:text-accent-app transition-colors" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Share */}
      <div className="card-app p-6">
        <h2 className="font-semibold text-primary-app mb-4 flex items-center gap-2"><Share2 className="w-4 h-4" /> Share Case Study</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-app mb-2">Share via Email</label>
            <div className="flex gap-2">
              <input type="email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} placeholder="recipient@company.com" className="input-app flex-1" />
              <button onClick={handleShare} disabled={sharing || !shareEmail} className="btn-primary py-2 px-4 text-sm disabled:opacity-50">
                {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-app mb-2">Copy Link</label>
            <button onClick={handleCopyLink} className="btn-secondary w-full py-2.5 justify-center text-sm">
              <Copy className="w-4 h-4" /> Copy Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
