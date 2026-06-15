import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import { RecentCaseStudies } from '@/components/dashboard/recent-case-studies';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { TemplatesPreview } from '@/components/dashboard/templates-preview';


export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const userId = session.user.id!;

  const [caseStudies, templates] = await Promise.all([
    prisma.caseStudy.findMany({
      where: { userId },
      include: { phases: true },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.template.findMany({
      where: { builtIn: true },
      orderBy: [{ featured: 'desc' }, { usageCount: 'desc' }],
      take: 6,
    }),
  ]);

  const allStudies = await prisma.caseStudy.findMany({
    where: { userId },
    select: { status: true },
  });

  const metrics = {
    total: allStudies.length,
    completed: allStudies.filter((s: any) => s.status === 'completed').length,
    drafts: allStudies.filter((s: any) => s.status === 'draft').length,
    inProgress: allStudies.filter((s: any) => s.status === 'in_progress').length,
  };

  const userName = session.user.name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-app">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-muted-app mt-1">
          {metrics.inProgress > 0
            ? `You have ${metrics.inProgress} case ${metrics.inProgress === 1 ? 'study' : 'studies'} in progress.`
            : 'Ready to build your next case study?'}
        </p>
      </div>

      {/* Metrics */}
      <DashboardMetrics metrics={metrics} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Case Studies */}
      <RecentCaseStudies
        caseStudies={caseStudies.map((cs: any) => ({
          ...cs,
          tags: JSON.parse(cs.tags),
          phaseCount: cs.phases.filter((p: any) => p.completed).length,
          updatedAt: cs.updatedAt,
        }))}
      />

      {/* Templates */}
      <TemplatesPreview templates={templates} />
    </div>
  );
}
