import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserManagementTable } from '@/components/admin/user-management-table';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Admin Panel | PM Case Studio',
};

export default async function AdminPage() {
  const session = await auth();

  // Strict server-side role check
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary-app">Administrator Access</h1>
          <p className="text-sm text-secondary-app mt-1">
            You are viewing this page because you hold the <strong>ADMIN</strong> role. You have elevated privileges to review platform activity, view other users' contents, and modify user permissions.
          </p>
        </div>
      </div>

      <UserManagementTable />
    </div>
  );
}
