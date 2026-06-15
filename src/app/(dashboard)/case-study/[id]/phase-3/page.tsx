import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Phase3Client } from '@/components/phases/phase-3-client';
import { parseJSON } from '@/lib/utils';
import type { Phase3Data } from '@/types';

export default async function Phase3Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');
  const caseStudy = await prisma.caseStudy.findFirst({ where: { id, userId: session.user.id! }, include: { phases: { where: { phase: 3 } } } });
  if (!caseStudy) redirect('/dashboard');
  const allPhases = await prisma.phaseData.findMany({ where: { caseStudyId: id } });
  const completedPhases = allPhases.filter((p: any) => p.completed).map((p: any) => p.phase);
  const existingData = parseJSON<Partial<Phase3Data>>(caseStudy.phases[0]?.data ?? '{}', {});
  return <Phase3Client caseStudyId={id} caseStudyTitle={caseStudy.title} completedPhases={completedPhases} initialData={existingData} />;
}
