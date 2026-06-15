import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DeliverablesClient } from '@/components/deliverables/deliverables-client';

export default async function DeliverablesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');
  const caseStudy = await prisma.caseStudy.findFirst({
    where: { id, userId: session.user.id! },
    include: { phases: true },
  });
  if (!caseStudy) redirect('/dashboard');
  const completedPhases = caseStudy.phases.filter((p: any) => p.completed).map((p: any) => p.phase);
  return <DeliverablesClient caseStudy={{ id: caseStudy.id, title: caseStudy.title, status: caseStudy.status, progress: caseStudy.progress }} completedPhases={completedPhases} phases={caseStudy.phases.map((p: any) => ({ phase: p.phase, data: p.data, completed: p.completed }))} />;
}
