import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';
import { formatPhaseToPlainText } from '@/lib/exports/formatters';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { email } = await req.json() as { email: string };
  const caseStudy = await prisma.caseStudy.findFirst({
    where: { id, userId: session.user.id },
    include: { phases: true },
  });
  if (!caseStudy) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    await sendEmail({
      to: email,
      subject: `PM Case Studio: ${caseStudy.title}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #8B5CF6, #EC4899); margin-bottom: 16px;"></div>
            <h1 style="margin: 0; font-size: 24px; color: #1a1a2e;">PM Case Studio</h1>
          </div>
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Case Study Shared With You</h2>
          <p style="color: #666; margin-bottom: 24px;">${session.user.name ?? session.user.email} has shared a case study with you:</p>
          <div style="background: #f8f9fc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px; color: #1a1a2e;">${caseStudy.title}</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">${caseStudy.description ?? ''}</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; color: #1a1a2e; border-bottom: 2px solid #8B5CF6; padding-bottom: 8px;">Case Study Data</h3>
            ${caseStudy.phases.sort((a, b) => a.phase - b.phase).map(p => `
              <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px; color: #8B5CF6;">Phase ${p.phase}</h4>
                <pre style="margin: 0; white-space: pre-wrap; font-family: Inter, sans-serif; font-size: 13px; line-height: 1.6; color: #444;">${formatPhaseToPlainText(p.phase, p.data)}</pre>
              </div>
            `).join('<hr style="border:0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />')}
            ${caseStudy.phases.length === 0 ? '<p style="color: #666; font-size: 13px;">No data has been filled yet.</p>' : ''}
          </div>

          <p style="color: #999; font-size: 12px; text-align: center;">Powered by PM Case Studio</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }
}
