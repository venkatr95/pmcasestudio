import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { SettingsClient } from '@/components/settings/settings-client';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id! },
  });

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-app">Settings</h1>
        <p className="text-muted-app mt-1">Manage your workspace preferences and account settings.</p>
      </div>
      <SettingsClient
        user={{ name: session.user.name, email: session.user.email, image: session.user.image }}
        preferences={preferences ?? { theme: 'aurora', mode: 'detailed', aiAssistance: true, autoSave: true }}
      />
    </div>
  );
}
