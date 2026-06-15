import { z } from 'zod';

export const createCaseStudySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  productType: z.enum(['digital', 'physical', 'hybrid']),
  studyStyle: z.enum(['executive', 'consulting', 'startup', 'investor', 'interview']),
  templateId: z.string().optional(),
});

export const phase1Schema = z.object({
  problemStatement: z.string().min(1, 'Problem statement is required'),
  businessGoal: z.enum(['revenue_growth', 'retention', 'acquisition', 'expansion', 'other']),
  constraints: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      description: z.string(),
    })
  ),
  assumptions: z.string(),
  dependencies: z.string(),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['aurora', 'midnight', 'minimal', 'corporate', 'neon']),
  mode: z.enum(['compact', 'detailed']),
  aiAssistance: z.boolean(),
  autoSave: z.boolean(),
  productType: z.string().optional(),
  studyStyle: z.string().optional(),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type Phase1Input = z.infer<typeof phase1Schema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
