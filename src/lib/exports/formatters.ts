import type { Phase1Data, Phase2Data, Phase3Data, Phase4Data, Phase5Data, Phase6Data, Phase7Data } from '@/types';

function parseJSONSafely(dataStr: string) {
  try {
    return JSON.parse(dataStr);
  } catch {
    return {};
  }
}

export function formatPhaseToMarkdown(phaseNumber: number, rawData: string): string {
  const data = parseJSONSafely(rawData);
  let md = '';

  switch (phaseNumber) {
    case 1: {
      const p1 = data as Partial<Phase1Data>;
      md += `### Problem Statement\n${p1.problemStatement || 'Not defined'}\n\n`;
      md += `### Business Goal\n${p1.businessGoal || 'Not defined'}\n\n`;
      
      md += `### Constraints\n`;
      if (p1.constraints?.length) {
        p1.constraints.forEach(c => md += `- **${c.type}**: ${c.description}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Assumptions\n${p1.assumptions || 'None'}\n\n`;
      md += `### Dependencies\n${p1.dependencies || 'None'}\n\n`;
      break;
    }

    case 2: {
      const p2 = data as Partial<Phase2Data>;
      md += `### User Segments\n`;
      if (p2.userSegments?.length) {
        p2.userSegments.forEach(s => md += `- **${s.name}**: Demographics (${s.demographics}), Psychographics (${s.psychographics}), Behaviors (${s.behaviors})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Buyer Personas\n`;
      if (p2.personas?.length) {
        p2.personas.forEach(p => md += `- **${p.name || 'Unnamed'}** (${p.age || 'N/A'}, ${p.occupation || 'N/A'}): Goals (${p.goals}), Motivations (${p.motivations}), Frustrations (${p.frustrations})\n  JTBD: Functional (${p.functionalJTBD}), Emotional (${p.emotionalJTBD}), Social (${p.socialJTBD})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Competitors\n`;
      if (p2.competitors?.length) {
        p2.competitors.forEach(c => md += `- **${c.product}**: Strengths (${c.strengths}), Weaknesses (${c.weaknesses}), Market Position (${c.marketPosition})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### User Journey\n`;
      if (p2.journeyStages?.length) {
        p2.journeyStages.forEach(j => md += `- **${j.stage}**: Actions (${j.actions}), Emotions (${j.emotions}), Pain Points (${j.painPoints}), Opportunities (${j.opportunities})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';
      break;
    }

    case 3: {
      const p3 = data as Partial<Phase3Data>;
      md += `### Vision Alignment\n${p3.visionAlignment || 'Not defined'}\n\n`;
      md += `### North Star Metric\n${p3.northStarCustom || p3.northStarMetric || 'Not defined'}\n\n`;
      
      md += `### Secondary Metrics\n`;
      if (p3.secondaryMetrics?.length) {
        p3.secondaryMetrics.forEach(m => md += `- **${m.name}**: ${m.description || ''}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Guardrail Metrics\n`;
      if (p3.guardrailMetrics?.length) {
        p3.guardrailMetrics.forEach(m => md += `- **${m.name}**: ${m.description || ''}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      if (p3.activeFramework === 'aarrr' && p3.aarrr) {
        md += `### AARRR Framework Metrics\n`;
        md += `- **Acquisition**: ${p3.aarrr.acquisition}\n`;
        md += `- **Activation**: ${p3.aarrr.activation}\n`;
        md += `- **Retention**: ${p3.aarrr.retention}\n`;
        md += `- **Revenue**: ${p3.aarrr.revenue}\n`;
        md += `- **Referral**: ${p3.aarrr.referral}\n\n`;
      } else if (p3.activeFramework === 'heart' && p3.heart) {
        md += `### HEART Framework Metrics\n`;
        md += `- **Happiness**: ${p3.heart.happiness}\n`;
        md += `- **Engagement**: ${p3.heart.engagement}\n`;
        md += `- **Adoption**: ${p3.heart.adoption}\n`;
        md += `- **Retention**: ${p3.heart.retention}\n`;
        md += `- **Task Success**: ${p3.heart.taskSuccess}\n\n`;
      }
      break;
    }

    case 4: {
      const p4 = data as Partial<Phase4Data>;
      md += `### Ideation\n`;
      if (p4.ideas?.length) {
        p4.ideas.forEach(i => md += `- **${i.name}** (${i.category}): ${i.description}\n  Customer Value: ${i.customerValue}\n  Business Value: ${i.businessValue}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';
      break;
    }

    case 5: {
      const p5 = data as Partial<Phase5Data>;
      md += `### MoSCoW Prioritization\n`;
      if (p5.moscowItems?.length) {
        p5.moscowItems.forEach(m => md += `- **${m.name}**: ${m.category.toUpperCase()}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### RICE Scoring\n`;
      if (p5.riceItems?.length) {
        p5.riceItems.forEach(r => md += `- **${r.name}**: Score ${r.score?.toFixed(1) || 'N/A'} (R:${r.reach}, I:${r.impact}, C:${r.confidence}, E:${r.effort})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Resource Planning\n`;
      if (p5.resourcePlanning) {
        md += `- **Engineering**: ${p5.resourcePlanning.engineering || 'N/A'}\n`;
        md += `- **Design**: ${p5.resourcePlanning.design || 'N/A'}\n`;
        md += `- **Marketing**: ${p5.resourcePlanning.marketing || 'N/A'}\n`;
        md += `- **Operations**: ${p5.resourcePlanning.operations || 'N/A'}\n\n`;
      }

      md += `### Timeline & Dependencies\n`;
      md += `- **Timeline**: ${p5.timeline || 'Not defined'}\n`;
      md += `- **Dependencies**: ${p5.dependencies || 'Not defined'}\n\n`;
      break;
    }

    case 6: {
      const p6 = data as Partial<Phase6Data>;
      md += `### User Stories\n`;
      if (p6.userStories?.length) {
        p6.userStories.forEach(u => md += `- As a **${u.asA}**, I want to **${u.iWant}**, so that **${u.soThat}**. (Acceptance: ${u.acceptanceCriteria?.join(', ')}, Edge Cases: ${u.edgeCases})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Rollout Strategy\n`;
      if (p6.rolloutStrategy?.length) {
        p6.rolloutStrategy.forEach(r => md += `- **${r.stage.toUpperCase()}**: ${r.timeline} - ${r.description} (Criteria: ${r.criteria})\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Marketing Plan\n`;
      if (p6.marketingPlan) {
        md += `- **Email**: ${p6.marketingPlan.email || 'N/A'}\n`;
        md += `- **SEO**: ${p6.marketingPlan.seo || 'N/A'}\n`;
        md += `- **Paid**: ${p6.marketingPlan.paid || 'N/A'}\n`;
        md += `- **Social**: ${p6.marketingPlan.social || 'N/A'}\n`;
        md += `- **Partnerships**: ${p6.marketingPlan.partnerships || 'N/A'}\n`;
        md += `- **In-App**: ${p6.marketingPlan.inApp || 'N/A'}\n\n`;
      }
      break;
    }

    case 7: {
      const p7 = data as Partial<Phase7Data>;
      md += `### Roadmap\n`;
      if (p7.roadmapItems?.length) {
        p7.roadmapItems.forEach(r => md += `- **${r.timeframe.toUpperCase()}** (${r.priority.toUpperCase()}, Status: ${r.status}): ${r.title} - ${r.description}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Risks & Mitigations\n`;
      if (p7.risks?.length) {
        p7.risks.forEach(r => md += `- **${r.category.toUpperCase()} Risk**: ${r.description} (Likelihood: ${r.likelihood}, Impact: ${r.impact})\n  Mitigation: ${r.mitigation}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### Trade-Offs\n`;
      if (p7.tradeOffs?.length) {
        p7.tradeOffs.forEach(t => md += `- **${t.title}**\n  Pros: ${t.pros}\n  Cons: ${t.cons}\n  Rationale: ${t.rationale}\n`);
      } else {
        md += `None listed.\n`;
      }
      md += '\n';

      md += `### SWOT Analysis\n`;
      if (p7.swot) {
        md += `- **Strengths**: ${p7.swot.strengths?.filter(Boolean).join(', ') || 'None'}\n`;
        md += `- **Weaknesses**: ${p7.swot.weaknesses?.filter(Boolean).join(', ') || 'None'}\n`;
        md += `- **Opportunities**: ${p7.swot.opportunities?.filter(Boolean).join(', ') || 'None'}\n`;
        md += `- **Threats**: ${p7.swot.threats?.filter(Boolean).join(', ') || 'None'}\n\n`;
      }
      break;
    }

    default:
      md += `### Phase ${phaseNumber} Data\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;
      break;
  }

  return md;
}

export function formatPhaseToPlainText(phaseNumber: number, rawData: string): string {
  // Plain text can just be a slightly cleaner version of markdown
  const md = formatPhaseToMarkdown(phaseNumber, rawData);
  return md
    .replace(/### /g, '') // Remove headings
    .replace(/\*\*/g, '') // Remove bold
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}
