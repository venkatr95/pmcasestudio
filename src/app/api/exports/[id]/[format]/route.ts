import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { generatePDF } from '@/lib/exports/pdf-generator';
import { generateDOCX } from '@/lib/exports/docx-generator';
import { generatePPTX } from '@/lib/exports/pptx-generator';
import { generateMarpMarkdown } from '@/lib/exports/marp-generator';
import { generateZIP } from '@/lib/exports/zip-generator';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; format: string }> }
) {
  const { id, format } = await params;
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const caseStudy = await prisma.caseStudy.findFirst({
    where: { id, userId: session.user.id },
    include: { phases: true },
  });

  if (!caseStudy) return new NextResponse('Not found', { status: 404 });

  const titleSlug = caseStudy.title.replace(/[^a-z0-9]/gi, '_');

  try {
    if (format === 'json') {
      const data = JSON.stringify({ caseStudy }, null, 2);
      return new NextResponse(data, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${titleSlug}.json"`,
        },
      });
    }

    if (format === 'markdown' || format === 'marp') {
      const md = generateMarpMarkdown(caseStudy);
      return new NextResponse(md, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${titleSlug}.${format === 'marp' ? 'md' : 'md'}"`,
        },
      });
    }

    if (['pdf', 'summary', 'strategy', 'prd', 'roadmap'].includes(format)) {
      const pdfBuffer = await generatePDF(caseStudy, format);
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${titleSlug}_${format}.pdf"`,
        },
      });
    }

    if (format === 'docx') {
      const docxBuffer = await generateDOCX(caseStudy);
      return new NextResponse(docxBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${titleSlug}.docx"`,
        },
      });
    }

    if (format === 'pptx') {
      const pptxBuffer = await generatePPTX(caseStudy);
      return new NextResponse(pptxBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="${titleSlug}.pptx"`,
        },
      });
    }

    if (format === 'zip') {
      const zipBuffer = await generateZIP(caseStudy);
      return new NextResponse(zipBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${titleSlug}.zip"`,
        },
      });
    }

    return new NextResponse('Unsupported format', { status: 400 });
  } catch (error) {
    console.error(`Export error for ${format}:`, error);
    return new NextResponse('Export generation failed', { status: 500 });
  }
}
