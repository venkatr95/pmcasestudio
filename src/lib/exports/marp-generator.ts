import type { CaseStudyWithPhases } from '@/types';
import { formatPhaseToMarkdown } from './formatters';

export function generateMarpMarkdown(caseStudy: CaseStudyWithPhases): string {
  let md = "---\nmarp: true\ntheme: default\npaginate: true\n---\n\n";

  md += `# ${caseStudy.title}\n`;
  if (caseStudy.description) md += `### ${caseStudy.description}\n`;
  md += "\n---\n\n";

  const sortedPhases = caseStudy.phases.sort((a, b) => a.phase - b.phase);

  sortedPhases.forEach((p, idx) => {
    md += `## Phase ${p.phase}\n\n`;
    md += formatPhaseToMarkdown(p.phase, p.data);
    
    if (idx < sortedPhases.length - 1) {
      md += "\n---\n\n";
    }
  });

  return md;
}
