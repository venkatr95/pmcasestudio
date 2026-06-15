export type UserRole = 'USER' | 'ADMIN';

export type ProductType = 'digital' | 'physical' | 'hybrid';

export type StudyStyle =
  | 'executive'
  | 'consulting'
  | 'startup'
  | 'investor'
  | 'interview';

export type ThemeType = 'aurora' | 'midnight' | 'minimal' | 'corporate' | 'neon';

export type CaseStudyStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

export type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'marp' | 'pptx' | 'zip' | 'json';

export interface Phase1Data {
  problemStatement: string;
  businessGoal: string;
  constraints: Array<{ id: string; type: string; description: string }>;
  assumptions: string;
  dependencies: string;
}

export interface UserSegment {
  id: string;
  name: string;
  demographics: string;
  psychographics: string;
  behaviors: string;
}

export interface Persona {
  id: string;
  name: string;
  age: string;
  occupation: string;
  goals: string;
  motivations: string;
  frustrations: string;
  functionalJTBD: string;
  emotionalJTBD: string;
  socialJTBD: string;
  imageUrl?: string;
}

export interface Competitor {
  id: string;
  product: string;
  strengths: string;
  weaknesses: string;
  marketPosition: string;
}

export interface JourneyStage {
  stage: string;
  actions: string;
  emotions: string;
  painPoints: string;
  opportunities: string;
}

export interface Phase2Data {
  userSegments: UserSegment[];
  personas: Persona[];
  competitors: Competitor[];
  journeyStages: JourneyStage[];
}

export interface Metric {
  id: string;
  name: string;
  description?: string;
}

export interface AARRRData {
  acquisition: string;
  activation: string;
  retention: string;
  revenue: string;
  referral: string;
}

export interface HEARTData {
  happiness: string;
  engagement: string;
  adoption: string;
  retention: string;
  taskSuccess: string;
}

export interface Phase3Data {
  visionAlignment: string;
  northStarMetric: string;
  northStarCustom?: string;
  secondaryMetrics: Metric[];
  guardrailMetrics: Metric[];
  activeFramework: 'aarrr' | 'heart';
  aarrr: AARRRData;
  heart: HEARTData;
}

export interface Idea {
  id: string;
  name: string;
  description: string;
  customerValue: string;
  businessValue: string;
  risks: string;
  category: 'customer' | 'business' | 'growth' | 'operational';
  tags: string[];
  votes: number;
  rank?: number;
}

export interface Phase4Data {
  ideas: Idea[];
}

export interface RICEItem {
  id: string;
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  score?: number;
  quadrant?: 'high-high' | 'high-low' | 'low-high' | 'low-low';
}

export interface MoSCoWItem {
  id: string;
  name: string;
  category: 'must' | 'should' | 'could' | 'wont';
}

export interface Phase5Data {
  riceItems: RICEItem[];
  moscowItems: MoSCoWItem[];
  resourcePlanning: {
    engineering: string;
    design: string;
    marketing: string;
    operations: string;
  };
  timeline: string;
  dependencies: string;
}

export interface UserStory {
  id: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  edgeCases: string;
  dependencies: string;
}

export interface RolloutStage {
  stage: 'alpha' | 'closed_beta' | 'open_beta' | 'launch';
  description: string;
  criteria: string;
  timeline: string;
}

export interface Phase6Data {
  userStories: UserStory[];
  rolloutStrategy: RolloutStage[];
  marketingPlan: {
    email: string;
    seo: string;
    paid: string;
    social: string;
    partnerships: string;
    inApp: string;
  };
}

export interface Risk {
  id: string;
  category: 'product' | 'engineering' | 'security' | 'legal' | 'adoption';
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface TradeOff {
  id: string;
  title: string;
  pros: string;
  cons: string;
  rationale: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  timeframe: 'now' | 'next' | 'later';
  priority: 'p1' | 'p2' | 'p3';
  status: 'planned' | 'in_progress' | 'done';
}

export interface Phase7Data {
  risks: Risk[];
  tradeOffs: TradeOff[];
  roadmapItems: RoadmapItem[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface CaseStudyWithPhases {
  id: string;
  title: string;
  description?: string | null;
  productType: string;
  studyStyle: string;
  status: string;
  currentPhase: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  phases: Array<{
    phase: number;
    data: string;
    completed: boolean;
  }>;
}
