import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Phase4Client } from '@/components/phases/phase-4-client';
import { parseJSON } from '@/lib/utils';
import type { Phase4Data } from '@/types';

export default async function Phase4Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');
  const caseStudy = await prisma.caseStudy.findFirst({ where: { id, userId: session.user.id! }, include: { phases: { where: { phase: 4 } } } });
  if (!caseStudy) redirect('/dashboard');
  const allPhases = await prisma.phaseData.findMany({ where: { caseStudyId: id } });
  const completedPhases = allPhases.filter((p: any) => p.completed).map((p: any) => p.phase);
  const existingData = parseJSON<Partial<Phase4Data>>(caseStudy.phases[0]?.data ?? '{}', {});
  return <Phase4Client caseStudyId={id} caseStudyTitle={caseStudy.title} completedPhases={completedPhases} initialData={existingData} />;
}
