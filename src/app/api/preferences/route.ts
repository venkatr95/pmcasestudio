import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json() as Record<string, unknown>;
  const preferences = await prisma.userPreferences.update({
    where: { userId: session.user.id },
    data: {
      theme: body.theme as string,
      mode: body.mode as string,
      aiAssistance: body.aiAssistance as boolean,
      autoSave: body.autoSave as boolean,
    },
  });
  return NextResponse.json(preferences);
}
