import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export const metadata: Metadata = { title: 'New Case Study' };

export default async function NewCaseStudyPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const templates = await prisma.template.findMany({
    where: { builtIn: true },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    select: { id: true, name: true, category: true, featured: true, description: true },
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <OnboardingWizard userName={session.user.name || 'PM'} templates={templates} />
    </div>
  );
}
