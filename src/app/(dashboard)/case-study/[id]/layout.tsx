import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { CaseStudyThemeProvider } from '@/components/providers/theme-provider';

export default async function CaseStudyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { id: resolvedParams.id, userId: session.user.id },
    select: { theme: true },
  });

  if (!caseStudy) redirect('/dashboard');

  return (
    <CaseStudyThemeProvider theme={caseStudy.theme}>
      {children}
    </CaseStudyThemeProvider>
  );
}
