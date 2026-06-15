import pptxgen from 'pptxgenjs';
import type { CaseStudyWithPhases } from '@/types';
import { formatPhaseToPlainText } from './formatters';

export async function generatePPTX(caseStudy: CaseStudyWithPhases): Promise<Buffer> {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  // Title Slide
  const slide = pres.addSlide();
  slide.background = { color: '1a1a2e' };
  slide.addText(caseStudy.title, { x: 1, y: 2, w: '80%', h: 1, fontSize: 36, color: 'ffffff', bold: true });
  slide.addText(caseStudy.description || 'PM Case Studio Presentation', { x: 1, y: 3, w: '80%', h: 1, fontSize: 18, color: 'cccccc' });

  // Phase Slides
  for (const p of caseStudy.phases.sort((a, b) => a.phase - b.phase)) {
    const contentStr = formatPhaseToPlainText(p.phase, p.data);
    // Split into chunks if too long (pptxgenjs text wrapping isn't perfect for huge blocks)
    const chunks = contentStr.match(/[\s\S]{1,1000}/g) || [''];
    
    chunks.forEach((chunk, idx) => {
      const phaseSlide = pres.addSlide();
      phaseSlide.addText(`Phase ${p.phase}${idx > 0 ? ' (cont.)' : ''}`, { x: 0.5, y: 0.5, w: '90%', h: 0.5, fontSize: 24, bold: true, color: '8B5CF6' });
      phaseSlide.addText(chunk, { x: 0.5, y: 1.5, w: '90%', h: 4.5, fontSize: 14, color: '333333', valign: 'top' });
    });
  }

  // Generate buffer
  const buffer = (await pres.write({ outputType: 'nodebuffer' })) as Buffer;
  return buffer;
}
