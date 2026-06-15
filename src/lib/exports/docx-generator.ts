import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import type { CaseStudyWithPhases } from '@/types';
import { formatPhaseToPlainText } from './formatters';

export async function generateDOCX(caseStudy: CaseStudyWithPhases): Promise<Buffer> {
  const children = [
    new Paragraph({
      text: caseStudy.title,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      text: caseStudy.description || 'PM Case Studio Report',
      heading: HeadingLevel.HEADING_2,
    }),
  ];

  for (const p of caseStudy.phases.sort((a, b) => a.phase - b.phase)) {
    children.push(
      new Paragraph({
        text: `Phase ${p.phase}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    const contentStr = formatPhaseToPlainText(p.phase, p.data);
    const lines = contentStr.split('\n').filter(l => l.trim().length > 0);

    for (const line of lines) {
      if (line.startsWith('- ')) {
        children.push(new Paragraph({ text: line.substring(2), bullet: { level: 0 } }));
      } else {
        children.push(new Paragraph({ text: line, spacing: { after: 100 } }));
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
