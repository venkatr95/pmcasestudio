import { BookOpen, Target, Users, Search, Lightbulb, ListChecks, Route, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'PM Guide | PM Case Studio',
  description: 'A complete playbook for building zero-to-one products.',
};

export default function GuidePage() {
  const phases = [
    {
      num: 1,
      title: "Context & Goals",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Start by defining the exact problem you're solving and why it matters to the business.",
      frameworks: ["Problem Statement Formulation", "Lean Model Canvas", "5 Whys Analysis"],
      details: "Never jump to solutions. A great PM spends 80% of their time falling in love with the problem. You must understand the business constraints (budget, timeline) and state clear assumptions before writing a single line of code."
    },
    {
      num: 2,
      title: "Users & Journey",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Identify exactly who you are building for and understand their pain points.",
      frameworks: ["User Personas", "Jobs to be Done (JTBD)", "User Journey Mapping"],
      details: "Create distinct user segments. Use the JTBD framework to understand the functional, emotional, and social reasons a user 'hires' your product. Map their journey from initial awareness through to long-term retention."
    },
    {
      num: 3,
      title: "Vision & Strategy",
      icon: Search,
      color: "text-green-500",
      bg: "bg-green-500/10",
      description: "Define how you will measure success and how this product fits into the broader market.",
      frameworks: ["North Star Metric", "AARRR / HEART", "Ansoff Matrix"],
      details: "Establish a single North Star metric that aligns with customer value. Break down your funnel using AARRR (Acquisition, Activation, Retention, Referral, Revenue). Ensure you have guardrail metrics to prevent cannibalization."
    },
    {
      num: 4,
      title: "Ideation",
      icon: Lightbulb,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      description: "Generate potential solutions that address the core user problems.",
      frameworks: ["Crazy 8s", "How Might We (HMW)", "Opportunity Solution Tree"],
      details: "Brainstorming should be divergent. Come up with wild ideas first, then narrow them down based on technical feasibility and business viability. Always tie every feature idea back to a specific user pain point."
    },
    {
      num: 5,
      title: "Prioritization",
      icon: ListChecks,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "Decide what to build first based on ROI, impact, and effort.",
      frameworks: ["RICE Scoring", "MoSCoW Method", "Kano Model"],
      details: "You cannot build everything. Use RICE (Reach x Impact x Confidence / Effort) to quantitatively score features. Use MoSCoW to draw hard lines in the sand for your MVP scope (Must haves vs. Won't haves)."
    },
    {
      num: 6,
      title: "Go-to-Market (GTM)",
      icon: Route,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      description: "Plan how you will launch the product and acquire your first users.",
      frameworks: ["Beta Rollout Strategy", "Marketing Mix", "Pricing Strategy"],
      details: "A great product with a terrible launch will fail. Define your beta stages (Alpha, Closed Beta, GA). Work with Product Marketing to define the channels, messaging, and positioning."
    },
    {
      num: 7,
      title: "Risks & Roadmap",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-500/10",
      description: "Anticipate what could go wrong and plan the next 90 days of execution.",
      frameworks: ["SWOT Analysis", "Risk Mitigation Matrix", "Now-Next-Later Roadmap"],
      details: "Identify product, engineering, and legal risks. Build a Now-Next-Later roadmap instead of a rigid timeline to allow for agility as you learn from the market."
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-12 animate-in-fade pb-24">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-accent flex items-center justify-center text-white glow-accent mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-primary-app tracking-tight">The Product Management Playbook</h1>
        <p className="text-lg text-secondary-app max-w-2xl mx-auto">
          A comprehensive guide to taking a product from zero to one. Master the 7 phases of product development to build things people actually want.
        </p>
      </div>

      {/* Intro */}
      <div className="card-app p-6 bg-accent-subtle-app border-accent-app/20">
        <h2 className="text-xl font-bold text-accent-app mb-2">How to use this guide</h2>
        <p className="text-primary-app leading-relaxed text-sm">
          This playbook mirrors the exact structure used in the PM Case Studio templates. Whether you are prepping for a FAANG interview or launching a real startup, following these 7 sequential phases ensures you never build a solution without first validating the problem. 
          <br /><br />
          If you don't recognize a term (like <span className="font-mono text-accent-app bg-app px-1 py-0.5 rounded text-xs">RICE</span> or <span className="font-mono text-accent-app bg-app px-1 py-0.5 rounded text-xs">CAC</span>), remember you can hold <kbd className="bg-app border border-app rounded px-1 text-xs">Ctrl</kbd> and click any metric in the app to open the <Link href="/glossary" className="underline hover:text-accent-app">Glossary</Link>.
        </p>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[28px] md:before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-app before:via-app before:to-transparent">
        {phases.map((phase, idx) => (
          <div key={phase.num} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* Timeline Node */}
            <div className={`flex items-center justify-center w-14 h-14 rounded-full border-4 border-app-secondary ${phase.bg} ${phase.color} shadow-lg absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 z-10 transition-transform group-hover:scale-110`}>
              <phase.icon className="w-6 h-6" />
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 card-app p-6 hover:border-accent-app/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${phase.bg} ${phase.color}`}>
                  Phase {phase.num}
                </span>
                <h3 className="text-xl font-bold text-primary-app">{phase.title}</h3>
              </div>
              
              <p className="text-sm font-medium text-primary-app mb-4">{phase.description}</p>
              <p className="text-sm text-secondary-app leading-relaxed mb-5">{phase.details}</p>

              <div className="space-y-2 pt-4 border-t border-app">
                <span className="text-xs font-bold text-muted-app uppercase tracking-wider block mb-2">Key Frameworks</span>
                <ul className="grid gap-2">
                  {phase.frameworks.map((framework, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-app">
                      <CheckCircle2 className="w-4 h-4 text-accent-app shrink-0 mt-0.5" />
                      {framework}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}
