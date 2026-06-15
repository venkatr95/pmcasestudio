import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { TemplatesGrid } from '@/components/templates/templates-grid';

export const metadata: Metadata = { title: 'Template Library' };

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: [{ featured: 'desc' }, { category: 'asc' }, { name: 'asc' }],
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-app">Template Library</h1>
        <p className="text-muted-app mt-1">Start faster with pre-built PM frameworks and case studies.</p>
      </div>
      <TemplatesGrid templates={templates} />
    </div>
  );
}
