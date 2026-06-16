import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { sessions: true },
    });

    if (!user) {
      return NextResponse.json({ hasActiveSession: false });
    }

    const hasActiveSession = user.sessions.some(
      (s: { expires: Date }) => new Date(s.expires) > new Date()
    );

    return NextResponse.json({ hasActiveSession });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ error: 'Failed to check session' }, { status: 500 });
  }
}
