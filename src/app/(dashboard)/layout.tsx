import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const preferences = await prisma.userPreferences.upsert({
    where: { userId: session.user.id! },
    update: {},
    create: { userId: session.user.id! },
  });

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  const activeUser = {
    ...session.user,
    name: dbUser?.name ?? session.user.name,
    email: dbUser?.email ?? session.user.email,
    image: dbUser?.image ?? session.user.image,
    role: dbUser?.role ?? session.user.role,
  };

  return <DashboardShell user={activeUser} preferences={preferences}>{children}</DashboardShell>;
}
