import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, image } = await req.json();

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (image !== undefined) dataToUpdate.image = image;
    if (email) {
      // Check if email already in use
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
      dataToUpdate.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.hashedPassword = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
