'use server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveOnboardingPreferences(
  userId: string,
  prefs: {
    productType: string;
    studyStyle: string;
    theme: string;
    mode: string;
    aiAssistance: boolean;
    autoSave: boolean;
  }
) {
  await prisma.userPreferences.upsert({
    where: { userId },
    update: {
      theme: prefs.theme,
      mode: prefs.mode,
      aiAssistance: prefs.aiAssistance,
      autoSave: prefs.autoSave,
      productType: prefs.productType,
      studyStyle: prefs.studyStyle,
      onboarded: true,
    },
    create: {
      userId,
      theme: prefs.theme,
      mode: prefs.mode,
      aiAssistance: prefs.aiAssistance,
      autoSave: prefs.autoSave,
      productType: prefs.productType,
      studyStyle: prefs.studyStyle,
      onboarded: true,
    },
  });
  revalidatePath('/dashboard');
}
