import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Target, Users, Search, Lightbulb, ListChecks, Route, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { HelperTooltip } from '@/components/ui/helper-tooltip';

export const metadata: Metadata = {
  title: 'Demo Case Study | PM Case Studio',
  description: 'View a fully populated PM case study generated with PM Case Studio.',
};

export default async function DemoPage() {
  const template = await prisma.template.findUnique({
    where: { slug: 'district-zomato-growth' },
  });

  if (!template) {
    notFound();
  }

  const parsedData = JSON.parse(template.data);
  const phases = parsedData.phases || [];

  const getPhaseData = (phaseNum: number) => {
    return phases.find((p: any) => p.phase === phaseNum)?.data || {};
  };

  const phase1 = getPhaseData(1);
  const phase2 = getPhaseData(2);
  const phase3 = getPhaseData(3);
  const phase4 = getPhaseData(4);
  const phase5 = getPhaseData(5);
  const phase6 = getPhaseData(6);
  const phase7 = getPhaseData(7);

  return (
    <div className="min-h-screen bg-app overflow-y-auto scrollbar-thin">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-app bg-app-secondary/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg text-muted-app hover:text-primary-app hover:bg-app transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center glow-accent-sm">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20M6 14h14M6 20h10M6 26h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-primary-app hidden sm:inline-block">PM Case Studio</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent-subtle-app text-accent-app border border-accent-app/20 ml-2">
              Demo Preview
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/register" className="btn-primary py-2 px-5 text-sm shadow-lg shadow-accent-app/20">
            Start Building Free
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-app tracking-tight">{template.name}</h1>
          <p className="text-lg text-secondary-app max-w-2xl mx-auto leading-relaxed">{template.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {JSON.parse(template.tags).map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-app-secondary border border-app rounded-full text-xs font-medium text-muted-app">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-app to-transparent" />

        {/* Phase 1: Context */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 1: Context & Goals</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-app p-6 space-y-2">
              <h3 className="font-semibold text-primary-app">Problem Statement</h3>
              <p className="text-sm text-secondary-app leading-relaxed">{phase1.problemStatement}</p>
            </div>
            <div className="card-app p-6 space-y-2">
              <h3 className="font-semibold text-primary-app">Business Goal</h3>
              <p className="text-sm text-secondary-app leading-relaxed capitalize">{phase1.businessGoal}</p>
            </div>
          </div>

          {/* Lean Canvas */}
          {phase1.leanCanvas && (
            <div className="space-y-4 mt-8">
              <h3 className="font-semibold text-lg text-primary-app">
                <HelperTooltip text="A 1-page business plan template that helps deconstruct an idea into its key assumptions.">
                  Lean Model Canvas
                </HelperTooltip>
              </h3>
              <div className="card-app overflow-hidden">
                <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-app">
                  {/* Problem & Alternatives */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Problem</h4>
                      <p className="text-xs text-secondary-app">{phase1.leanCanvas.problem}</p>
                    </div>
                  </div>
                  {/* Solution & Metrics */}
                  <div className="p-4 space-y-4 divide-y divide-app">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Solution</h4>
                      <p className="text-xs text-secondary-app">{phase1.leanCanvas.solution}</p>
                    </div>
                    <div className="pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Key Metrics</h4>
                      <p className="text-xs text-secondary-app">{phase1.leanCanvas.keyMetrics}</p>
                    </div>
                  </div>
                  {/* UVP */}
                  <div className="p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Unique Value Proposition</h4>
                    <p className="text-xs text-secondary-app leading-relaxed">{phase1.leanCanvas.uniqueValueProposition}</p>
                  </div>
                  {/* Unfair Advantage & Channels */}
                  <div className="p-4 space-y-4 divide-y divide-app">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Unfair Advantage</h4>
                      <p className="text-xs text-secondary-app">{phase1.leanCanvas.unfairAdvantage}</p>
                    </div>
                    <div className="pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Channels</h4>
                      <p className="text-xs text-secondary-app">{phase1.leanCanvas.channels}</p>
                    </div>
                  </div>
                  {/* Customer Segments */}
                  <div className="p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Customer Segments</h4>
                    <p className="text-xs text-secondary-app leading-relaxed">{phase1.leanCanvas.customerSegments}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-app border-t border-app">
                  <div className="p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Cost Structure</h4>
                    <p className="text-xs text-secondary-app">{phase1.leanCanvas.costStructure}</p>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent-app mb-1">Revenue Streams</h4>
                    <p className="text-xs text-secondary-app">{phase1.leanCanvas.revenueStreams}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Phase 2: Users */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 2: Users & Journey</h2>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary-app">
              <HelperTooltip text="A semi-fictional representation of your ideal customer based on market research and real data.">
                User Personas & JTBD
              </HelperTooltip>
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {phase2.personas?.map((p: any) => (
                <div key={p.id} className="card-app p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-accent-app">{p.name}, {p.age}</h4>
                    <p className="text-sm text-muted-app">{p.occupation}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium text-primary-app">Goal:</span> <span className="text-secondary-app">{p.goals}</span></p>
                    <p className="text-sm"><span className="font-medium text-primary-app">Frustrations:</span> <span className="text-secondary-app">{p.frustrations}</span></p>
                  </div>
                  <div className="pt-4 border-t border-app space-y-2">
                    <p className="text-xs text-muted-app font-semibold uppercase tracking-wider">
                      <HelperTooltip text="Jobs to be Done: A framework focusing on the specific 'job' a user hires a product to do for them.">
                        Jobs to be Done (JTBD)
                      </HelperTooltip>
                    </p>
                    <p className="text-sm"><span className="font-medium text-primary-app">Functional:</span> <span className="text-secondary-app">{p.functionalJTBD}</span></p>
                    <p className="text-sm"><span className="font-medium text-primary-app">Emotional:</span> <span className="text-secondary-app">{p.emotionalJTBD}</span></p>
                    <p className="text-sm"><span className="font-medium text-primary-app">Social:</span> <span className="text-secondary-app">{p.socialJTBD}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary-app">
              <HelperTooltip text="Visualizes the process a user goes through to achieve a goal with your product, from awareness to loyalty.">
                User Journey Map
              </HelperTooltip>
            </h3>
            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {phase2.journeyStages?.map((stage: any, idx: number) => (
                <div key={stage.stage} className="card-app p-5 min-w-[250px] flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-accent-subtle-app text-accent-app flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                    <h4 className="font-semibold text-primary-app">{stage.stage}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-muted-app block">Action:</span> <span className="text-secondary-app">{stage.actions}</span></p>
                    <p><span className="font-medium text-muted-app block">Pain Point:</span> <span className="text-red-400/80">{stage.painPoints}</span></p>
                    <p><span className="font-medium text-muted-app block">Opportunity:</span> <span className="text-green-500/80">{stage.opportunities}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phase 3: Vision & Metrics */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 3: Strategy & Metrics</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-app p-6">
              <h3 className="font-semibold text-primary-app mb-2">
                <HelperTooltip text="The single metric that best captures the core value your product delivers to its customers.">
                  North Star Metric
                </HelperTooltip>
              </h3>
              <div className="text-2xl font-bold gradient-accent-text">{phase3.northStarCustom || phase3.northStarMetric}</div>
            </div>

            <div className="card-app p-6">
              <h3 className="font-semibold text-primary-app mb-4">
                <HelperTooltip text="A strategic planning tool that provides a framework to help executives, senior managers, and marketers devise strategies for future growth.">
                  Ansoff Matrix
                </HelperTooltip>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-accent-app mb-1">Market Penetration</p>
                  <p className="text-xs text-secondary-app">{phase3.ansoffMatrix?.marketPenetration}</p>
                </div>
                <div>
                  <p className="font-medium text-accent-app mb-1">Product Development</p>
                  <p className="text-xs text-secondary-app">{phase3.ansoffMatrix?.productDevelopment}</p>
                </div>
                <div>
                  <p className="font-medium text-accent-app mb-1">Market Development</p>
                  <p className="text-xs text-secondary-app">{phase3.ansoffMatrix?.marketDevelopment}</p>
                </div>
                <div>
                  <p className="font-medium text-accent-app mb-1">Diversification</p>
                  <p className="text-xs text-secondary-app">{phase3.ansoffMatrix?.diversification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exhaustive Metrics Dashboard */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-primary-app">Comprehensive Product Metrics</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Acquisition */}
              <div className="card-app p-5">
                <h4 className="font-medium text-primary-app mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Acquisition & Activation
                </h4>
                <div className="space-y-3">
                  {phase3.acquisitionMetrics?.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-secondary-app">
                        <HelperTooltip text={
                          m.name.includes("CAC") ? "Total cost required to acquire a new paying customer." :
                          m.name.includes("Activation") ? "Percentage of new users who complete an aha moment." :
                          m.name.includes("TTV") ? "Time it takes a new user to realize core value." :
                          m.name.includes("CTR") ? "Percentage of people who click a link after viewing." :
                          "Cost of acquiring conversions from a campaign."
                        }>
                          {m.name}
                        </HelperTooltip>
                      </span>
                      <span className="text-sm font-semibold text-primary-app text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement */}
              <div className="card-app p-5">
                <h4 className="font-medium text-primary-app mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  Engagement & Retention
                </h4>
                <div className="space-y-3">
                  {phase3.engagementMetrics?.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-secondary-app">
                        <HelperTooltip text={
                          m.name.includes("DAU") ? "Daily/Monthly Active Users. Measures core product usage." :
                          m.name.includes("Retention") ? "Percentage of users who return to the product over time." :
                          m.name.includes("Churn") ? "Percentage of users who stop using the product." :
                          m.name.includes("Adoption") ? "Rate at which users interact with specific features." :
                          "Time spent in a single session."
                        }>
                          {m.name}
                        </HelperTooltip>
                      </span>
                      <span className="text-sm font-semibold text-primary-app text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monetization */}
              <div className="card-app p-5">
                <h4 className="font-medium text-primary-app mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  Monetization
                </h4>
                <div className="space-y-3">
                  {phase3.monetizationMetrics?.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-secondary-app">
                        <HelperTooltip text={
                          m.name.includes("MRR") ? "Predictable, recurring revenue generated each month." :
                          m.name.includes("LTV") ? "Total projected revenue a single customer will generate." :
                          m.name.includes("ARPU") ? "Average revenue generated per active user." :
                          "Number of times a customer purchases within a timeframe."
                        }>
                          {m.name}
                        </HelperTooltip>
                      </span>
                      <span className="text-sm font-semibold text-primary-app text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Satisfaction */}
              <div className="card-app p-5">
                <h4 className="font-medium text-primary-app mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-yellow-500" />
                  User Satisfaction
                </h4>
                <div className="space-y-3">
                  {phase3.satisfactionMetrics?.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-secondary-app">
                        <HelperTooltip text={
                          m.name.includes("NPS") ? "Measures customer loyalty and likelihood to recommend." :
                          "Measures how satisfied users are with a specific interaction."
                        }>
                          {m.name}
                        </HelperTooltip>
                      </span>
                      <span className="text-sm font-semibold text-primary-app text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experimentation */}
              <div className="card-app p-5">
                <h4 className="font-medium text-primary-app mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-500" />
                  Experimentation
                </h4>
                <div className="space-y-3">
                  {phase3.experimentationMetrics?.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-secondary-app">
                        <HelperTooltip text={
                          m.name.includes("Lift") ? "Percentage increase in conversion rate for a variation vs control." :
                          "Confidence level that results are not due to random chance."
                        }>
                          {m.name}
                        </HelperTooltip>
                      </span>
                      <span className="text-sm font-semibold text-primary-app text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Phase 4: Ideation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 4: Ideation</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {phase4.ideas?.slice(0, 4).map((i: any) => (
              <div key={i.id} className="card-app p-5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Lightbulb className="w-12 h-12" />
                </div>
                <h3 className="font-semibold text-primary-app mb-2">{i.name}</h3>
                <p className="text-sm text-secondary-app line-clamp-3 mb-3">{i.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 5: Prioritization */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <ListChecks className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 5: Prioritization</h2>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* RICE */}
            <div className="lg:col-span-2 card-app overflow-hidden">
              <div className="p-4 border-b border-app bg-app-secondary/50">
                <h3 className="font-semibold text-primary-app">
                  <HelperTooltip text="RICE scoring model: Reach x Impact x Confidence / Effort">
                    RICE Framework
                  </HelperTooltip>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-app-secondary text-muted-app">
                    <tr>
                      <th className="px-4 py-3 font-medium">Feature</th>
                      <th className="px-4 py-3 font-medium text-right">Reach</th>
                      <th className="px-4 py-3 font-medium text-right">Impact</th>
                      <th className="px-4 py-3 font-medium text-right">Conf.</th>
                      <th className="px-4 py-3 font-medium text-right">Effort</th>
                      <th className="px-4 py-3 font-medium text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app">
                    {phase5.riceItems?.slice(0, 5).map((r: any) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3 text-primary-app font-medium">{r.name}</td>
                        <td className="px-4 py-3 text-secondary-app text-right">{r.reach}</td>
                        <td className="px-4 py-3 text-secondary-app text-right">{r.impact}</td>
                        <td className="px-4 py-3 text-secondary-app text-right">{r.confidence}%</td>
                        <td className="px-4 py-3 text-secondary-app text-right">{r.effort}</td>
                        <td className="px-4 py-3 font-bold text-accent-app text-right">{r.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MoSCoW */}
            <div className="card-app p-5">
              <h3 className="font-semibold text-primary-app mb-4">
                <HelperTooltip text="MoSCoW method: Prioritization technique separating requirements into Must have, Should have, Could have, and Won't have.">
                  MoSCoW Framework
                </HelperTooltip>
              </h3>
              <div className="space-y-4">
                {['must', 'should', 'could', 'wont'].map((category) => {
                  const items = phase5.moscowItems?.filter((m: any) => m.category === category) || [];
                  if (items.length === 0) return null;
                  
                  let badgeColor = "bg-app-secondary text-muted-app";
                  if (category === 'must') badgeColor = "bg-red-500/10 text-red-500";
                  if (category === 'should') badgeColor = "bg-orange-500/10 text-orange-500";
                  if (category === 'could') badgeColor = "bg-blue-500/10 text-blue-500";

                  return (
                    <div key={category}>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${badgeColor}`}>
                        {category} Have
                      </span>
                      <ul className="space-y-1">
                        {items.slice(0, 3).map((item: any) => (
                          <li key={item.id} className="text-sm text-secondary-app flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 opacity-50 shrink-0" />
                            <span className="leading-tight">{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Phase 6: Go-to-Market */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Route className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 6: Go-to-Market</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-app p-6 space-y-4">
              <h3 className="font-semibold text-primary-app">
                <HelperTooltip text="The step-by-step plan for releasing the product to different cohorts to manage risk.">
                  Rollout Strategy
                </HelperTooltip>
              </h3>
              {phase6.rolloutStrategy?.slice(0, 3).map((r: any) => (
                <div key={r.stage} className="border-l-2 border-accent-app/30 pl-4 py-1">
                  <h4 className="font-semibold text-primary-app text-sm capitalize">{r.stage.replace('_', ' ')}</h4>
                  <p className="text-xs text-secondary-app mt-1">{r.description}</p>
                </div>
              ))}
            </div>

            <div className="card-app p-6">
              <h3 className="font-semibold text-primary-app mb-4">
                <HelperTooltip text="The strategic marketing plan covering multiple channels to acquire and activate users.">
                  Marketing Plan
                </HelperTooltip>
              </h3>
              <div className="space-y-3">
                {Object.entries(phase6.marketingPlan || {}).slice(0, 4).map(([channel, plan]: [string, any]) => (
                  <div key={channel}>
                    <h4 className="text-xs font-bold text-accent-app uppercase tracking-wider">{channel}</h4>
                    <p className="text-sm text-secondary-app leading-relaxed line-clamp-2">{plan}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Phase 7: Risks & Roadmap */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-primary-app">Phase 7: Risks & Roadmap</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-app p-6 md:col-span-1 space-y-4">
              <h3 className="font-semibold text-primary-app">
                <HelperTooltip text="Strengths, Weaknesses, Opportunities, and Threats analysis for strategic planning.">
                  SWOT Analysis
                </HelperTooltip>
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-green-500 uppercase">Strengths</h4>
                  <ul className="list-disc pl-4 text-xs text-secondary-app mt-1">
                    {phase7.swot?.strengths?.slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase">Threats</h4>
                  <ul className="list-disc pl-4 text-xs text-secondary-app mt-1">
                    {phase7.swot?.threats?.slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-app p-6 md:col-span-2">
              <h3 className="font-semibold text-primary-app mb-4">
                <HelperTooltip text="Strategic timeline of planned deliverables and features grouped by timeframe.">
                  90-Day Roadmap
                </HelperTooltip>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['now', 'next', 'later'].map((timeframe) => {
                  const items = phase7.roadmapItems?.filter((r: any) => r.timeframe === timeframe) || [];
                  if (items.length === 0) return null;
                  return (
                    <div key={timeframe} className="space-y-2">
                      <h4 className="text-xs font-bold text-muted-app uppercase tracking-widest border-b border-app pb-1">
                        {timeframe}
                      </h4>
                      <ul className="space-y-2 pt-1">
                        {items.slice(0, 2).map((item: any) => (
                          <li key={item.id} className="text-sm">
                            <span className="font-medium text-primary-app block">{item.title}</span>
                            <span className="text-xs text-secondary-app block truncate">{item.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="py-12 mt-12 text-center border-t border-app">
          <h2 className="text-3xl font-bold text-primary-app mb-4">Ready to build your own?</h2>
          <p className="text-secondary-app mb-8">Join thousands of PMs building structured, professional case studies.</p>
          <Link href="/register" className="btn-primary py-3 px-8 text-lg">
            Create Your Account
          </Link>
        </div>

      </main>
    </div>
  );
}
