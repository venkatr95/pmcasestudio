'use server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';


export async function createCaseStudy(data: {
  title: string;
  description?: string;
  productType: string;
  studyStyle: string;
  theme?: string;
  templateId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const caseStudy = await prisma.caseStudy.create({
    data: {
      userId: session.user.id,
      title: data.title,
      description: data.description,
      productType: data.productType,
      studyStyle: data.studyStyle,
      theme: data.theme || 'aurora',
      templateId: data.templateId || undefined,
      status: 'draft',
    },
  });

  // If template provided, clone template phase data
  if (data.templateId) {
    const template = await prisma.template.findUnique({
      where: { id: data.templateId },
    });
    if (template) {
      const templateData = JSON.parse(template.data) as Record<string, unknown>;
      const phases = (templateData.phases as { phase: number; data: unknown }[]) ?? [];
      await prisma.$transaction(
        phases.map((p) =>
          prisma.phaseData.create({
            data: {
              caseStudyId: caseStudy.id,
              phase: p.phase,
              data: JSON.stringify(p.data),
            },
          })
        )
      );
      await prisma.template.update({
        where: { id: data.templateId },
        data: { usageCount: { increment: 1 } },
      });
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/case-study');
  return caseStudy;
}

export async function savePhaseData(
  caseStudyId: string,
  phase: number,
  data: Record<string, unknown>,
  completed?: boolean
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Verify ownership
  const cs = await prisma.caseStudy.findUnique({ where: { id: caseStudyId } });
  if (!cs || cs.userId !== session.user.id) throw new Error('Forbidden');

  const phaseData = await prisma.phaseData.upsert({
    where: { caseStudyId_phase: { caseStudyId, phase } },
    update: { data: JSON.stringify(data), ...(completed !== undefined && { completed }) },
    create: { caseStudyId, phase, data: JSON.stringify(data), completed: completed ?? false },
  });

  // Update case study progress and current phase
  const allPhases = await prisma.phaseData.findMany({ where: { caseStudyId } });
  const completedCount = allPhases.filter((p) => p.completed).length;
  const progress = Math.round((completedCount / 7) * 100);
  const maxPhase = Math.max(...allPhases.map((p) => p.phase), phase);

  await prisma.caseStudy.update({
    where: { id: caseStudyId },
    data: {
      progress,
      currentPhase: Math.min(maxPhase + (completed ? 1 : 0), 7),
      status: progress === 100 ? 'completed' : 'in_progress',
    },
  });

  revalidatePath(`/case-study/${caseStudyId}`);
  return phaseData;
}

export async function getCaseStudyWithPhases(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.caseStudy.findFirst({
    where: { id, userId: session.user.id },
    include: { phases: true },
  });
}

export async function deleteCaseStudy(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const cs = await prisma.caseStudy.findUnique({ where: { id } });
  if (!cs || cs.userId !== session.user.id) throw new Error('Forbidden');

  await prisma.caseStudy.delete({ where: { id } });
  revalidatePath('/dashboard');
  revalidatePath('/case-study');
}
