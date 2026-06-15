import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Phase5Client } from '@/components/phases/phase-5-client';
import { parseJSON } from '@/lib/utils';
import type { Phase5Data } from '@/types';

export default async function Phase5Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');
  const caseStudy = await prisma.caseStudy.findFirst({ where: { id, userId: session.user.id! }, include: { phases: { where: { phase: 5 } } } });
  if (!caseStudy) redirect('/dashboard');
  const allPhases = await prisma.phaseData.findMany({ where: { caseStudyId: id } });
  const completedPhases = allPhases.filter((p: any) => p.completed).map((p: any) => p.phase);
  const existingData = parseJSON<Partial<Phase5Data>>(caseStudy.phases[0]?.data ?? '{}', {});
  return <Phase5Client caseStudyId={id} caseStudyTitle={caseStudy.title} completedPhases={completedPhases} initialData={existingData} />;
}
