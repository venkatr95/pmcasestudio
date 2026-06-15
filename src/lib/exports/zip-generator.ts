import JSZip from 'jszip';
import type { CaseStudyWithPhases } from '@/types';
import { generatePDF } from './pdf-generator';
import { generateDOCX } from './docx-generator';
import { generatePPTX } from './pptx-generator';
import { generateMarpMarkdown } from './marp-generator';

export async function generateZIP(caseStudy: CaseStudyWithPhases): Promise<Buffer> {
  const zip = new JSZip();
  const slug = caseStudy.title.replace(/[^a-z0-9]/gi, '_');

  // Add JSON
  const jsonData = JSON.stringify({ caseStudy }, null, 2);
  zip.file(`${slug}.json`, jsonData);

  // Add Marp / Markdown
  zip.file(`${slug}-presentation.md`, generateMarpMarkdown(caseStudy));

  // Add DOCX
  try {
    const docxBuffer = await generateDOCX(caseStudy);
    zip.file(`${slug}.docx`, docxBuffer);
  } catch (e) {
    console.error('DOCX generation failed', e);
  }

  // Add PPTX
  try {
    const pptxBuffer = await generatePPTX(caseStudy);
    zip.file(`${slug}.pptx`, pptxBuffer);
  } catch (e) {
    console.error('PPTX generation failed', e);
  }

  // Add PDF
  try {
    const pdfBuffer = await generatePDF(caseStudy);
    zip.file(`${slug}.pdf`, pdfBuffer);
  } catch (e) {
    console.error('PDF generation failed', e);
  }

  return await zip.generateAsync({ type: 'nodebuffer' });
}
