import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DISTRICT_TEMPLATE_DATA = {
  phases: [
    {
      phase: 1,
      data: {
        problemStatement:
          "District by Zomato has low top-of-mind awareness as the go-to app for entertainment, events, and dining-out coordination, resulting in weak habit formation and low repeat transactions.",
        businessGoal: "retention",
        constraints: [
          { id: "c1", type: "Engineering Capacity", description: "Shared infra with Zomato core team; limited dedicated resources" },
          { id: "c2", type: "Timeline", description: "6-month window before competitor BookMyShow launches bundling features" },
          { id: "c3", type: "Budget", description: "Marketing budget capped at ₹50Cr for next 2 quarters" },
        ],
        assumptions:
          "1. Zomato's existing user base (8M+ MAU) is addressable for District cross-sell\n2. Users who have tried both food and events on Zomato are 3x more likely to use District\n3. Social coordination is the #1 unmet need in the going-out category\n4. Bundled experiences (dinner + movie) will have 40%+ higher conversion than single-category bookings",
        dependencies:
          "- Zomato loyalty program (Zomato Gold/Pro) integration\n- Payment team for split-bill feature\n- Data team for behavioral recommendation engine\n- City operations team for merchant partnerships",
        leanCanvas: {
          problem: "Planning group outings requires juggling multiple apps (WhatsApp for coordination, Zomato for food, BMS for movies, UPI for splitting bills).",
          solution: "A single 'going-out' platform that unifies event discovery, dining reservations, group coordination, and bill splitting.",
          keyMetrics: "GOTPAU (Going-Out Transactions Per Active User), Customer Acquisition Cost, Cross-Category Usage.",
          uniqueValueProposition: "The only app that lets you plan, book, and split the cost of a complete evening out without leaving the ecosystem.",
          unfairAdvantage: "Zomato's existing 8M+ active dining users, massive merchant network, and deeply integrated payment/UPI infrastructure.",
          channels: "Zomato app cross-sell banners, Instagram ads targeting high-intent 'weekend plans', Referral program (group invites).",
          customerSegments: "Urban Weekend Planners (25-32), Young Social Coordinators (20-26), Couples seeking curated Date Nights.",
          costStructure: "In-house recommendation engine R&D, Marketing & CAC, Merchant partnership subsidies for bundles.",
          revenueStreams: "Commission on event tickets (8-15%), Dining reservation fees, Premium bundle margins."
        }
      },
    },
    {
      phase: 2,
      data: {
        userSegments: [
          { id: "s1", name: "Urban Weekend Planners (25-32)", demographics: "Metro cities, salaried professionals, ₹8-20L annual income", psychographics: "Experience-seekers, FOMO-driven, value convenience over price", behaviors: "Plans outings 2-3 days in advance, heavy Instagram user, books 1-2 events/month" },
          { id: "s2", name: "Young Social Coordinators (20-26)", demographics: "Tier-1 & 2 cities, students + early-career, ₹3-8L annual income", psychographics: "Group-first, budget-conscious but occasion-driven, concert/sports enthusiasts", behaviors: "Coordinates for 4+ people, uses WhatsApp groups for planning, price-sensitive" },
          { id: "s3", name: "Couples & Date Night Seekers (27-35)", demographics: "Married/partnered, dual income, ₹15L+ annual income", psychographics: "Quality over quantity, values curated experiences, time-poor", behaviors: "Books 2-3 times/month, willing to pay premium, reads reviews carefully" },
        ],
        personas: [
          { id: "p1", name: "Aditi", age: "27", occupation: "Marketing Manager", goals: "Plan memorable date nights and weekend experiences without spending hours researching", motivations: "Quality time with partner, trying new restaurants, social validation", frustrations: "Too many apps for different things, hard to coordinate schedules, last-minute availability issues", functionalJTBD: "Find and book a complete evening experience (dinner + activity) in under 10 minutes", emotionalJTBD: "Feel like a thoughtful planner who creates memorable moments", socialJTBD: "Share experiences on Instagram and be seen as someone with a great social life" },
          { id: "p2", name: "Rohit", age: "24", occupation: "Software Engineer", goals: "Coordinate group outings for concerts, IPL matches, and sports events with friends", motivations: "Being the 'group organizer', catching live sports, discovering new experiences", frustrations: "Splitting payments is a nightmare, hard to find group availability, tickets sell out fast", functionalJTBD: "Book group tickets and coordinate payment splitting in one place", emotionalJTBD: "Feel like the fun friend who makes plans happen", socialJTBD: "Strengthen friendships through shared experiences" },
        ],
        competitors: [
          { id: "comp1", product: "BookMyShow", strengths: "Strong brand for events, large inventory, loyalty program", weaknesses: "No dining integration, poor social features, generic UX", marketPosition: "Leader in events/movies ticketing" },
          { id: "comp2", product: "Swiggy Instamart/Dining", strengths: "Strong delivery brand, loyalty network, payment UX", weaknesses: "No events, limited dining-out discovery", marketPosition: "Delivery-first, expanding to dining" },
          { id: "comp3", product: "Google Maps/MagicPin", strengths: "Discovery intent, review ecosystem", weaknesses: "No booking, no social features, no bundling", marketPosition: "Discovery layer, not transactional" },
        ],
        journeyStages: [
          { stage: "Awareness", actions: "Sees District ad on Instagram, gets notification from Zomato app", emotions: "Curious but skeptical — 'another app?'", painPoints: "Mental model stuck on Zomato = food", opportunities: "Leverage Zomato brand equity; position as the 'planning' layer" },
          { stage: "Consideration", actions: "Opens District, browses events and restaurants", emotions: "Overwhelmed by choices, unsure what's curated for them", painPoints: "No personalization on first open, generic listing", opportunities: "Occasion-based homepage (Date Night, Weekend Plans, Nearby Tonight)" },
          { stage: "Activation", actions: "Books first experience (movie ticket or restaurant)", emotions: "Mild excitement, hoping it works well", painPoints: "Payment friction, seat selection UX, split bill not available", opportunities: "Streamlined checkout, instant confirmation, share-to-WhatsApp" },
          { stage: "Usage", actions: "Returns for a second booking; considers bundled experience", emotions: "Satisfied if first experience was smooth", painPoints: "No memory of past preferences, can't easily re-book favorites", opportunities: "Smart re-engagement, 'Book Again' flow, personalized picks" },
          { stage: "Retention", actions: "Uses District as default for all going-out plans", emotions: "Loyal if the product reduces planning friction consistently", painPoints: "Competitor offers better deals or more inventory", opportunities: "District Rewards, exclusive experiences, early access for power users" },
        ],
      },
    },
    {
      phase: 3,
      data: {
        visionAlignment:
          "District aligns with Zomato's vision of 'feeding India' beyond food — becoming the default platform for all consumption outside the home. While Zomato owns the stomach, District owns the calendar. This expansion protects Zomato's super-app positioning against vertical competitors and creates a loyalty flywheel across dining, entertainment, and social experiences.",
        northStarMetric: "Custom",
        northStarCustom: "Monthly Going-Out Transactions Per Active User (GOTPAU)",
        ansoffMatrix: {
          marketPenetration: "Deepen engagement with existing Zomato dining users by cross-selling movie and event tickets within the core app.",
          marketDevelopment: "Target new demographic segments (e.g., college students) for budget-friendly group outings and concerts.",
          productDevelopment: "Build bundled experiences (dinner + movie) and social coordination tools (split bills, group invites).",
          diversification: "Launch B2B corporate offsite and team-building packages (new product, new market)."
        },
        acquisitionMetrics: [
          { id: "acq1", name: "Customer Acquisition Cost (CAC)", value: "₹120 blended CAC" },
          { id: "acq2", name: "Activation Rate", value: "35% (book within 15m)" },
          { id: "acq3", name: "Time to Value (TTV)", value: "< 24 hours" },
          { id: "acq4", name: "Click-through Rate (CTR)", value: "4.5% on Zomato banners" },
          { id: "acq5", name: "Cost Per Acquisition (CPA)", value: "₹80 on Instagram ads" }
        ],
        engagementMetrics: [
          { id: "eng1", name: "DAU / MAU", value: "Target: 25% stickiness" },
          { id: "eng2", name: "Retention Rate", value: "Day 30: 35%" },
          { id: "eng3", name: "Churn Rate", value: "< 10% monthly" },
          { id: "eng4", name: "Feature Adoption Rate", value: "20% using 'Split Bill'" },
          { id: "eng5", name: "Session Duration", value: "4m 30s avg" }
        ],
        monetizationMetrics: [
          { id: "mon1", name: "MRR / ARR", value: "₹50M MRR target" },
          { id: "mon2", name: "Customer Lifetime Value (LTV)", value: "₹2,500 over 12 months" },
          { id: "mon3", name: "Average Revenue Per User (ARPU)", value: "₹45/month" },
          { id: "mon4", name: "Purchase Frequency", value: "1.8 times/month" }
        ],
        satisfactionMetrics: [
          { id: "sat1", name: "Net Promoter Score (NPS)", value: "> 45" },
          { id: "sat2", name: "Customer Satisfaction Score (CSAT)", value: "4.2/5 post-booking" }
        ],
        experimentationMetrics: [
          { id: "exp1", name: "Conversion Lift", value: "+12% vs control" },
          { id: "exp2", name: "Statistical Significance", value: "95% confidence" }
        ],
        activeFramework: "aarrr",
        aarrr: {
          acquisition: "Zomato app cross-sell banner (zero CAC), Instagram performance campaigns targeting going-out intent, referral bonus for first group booking",
          activation: "Occasion-based onboarding (What are you planning?), first booking within 15 min of signup, instant WhatsApp share of booking confirmation",
          retention: "Weekly 'What's your plan this weekend?' push notification, District Rewards program, personalized curated picks based on booking history",
          revenue: "Commission on tickets (8-15%), restaurant booking fees (₹50-200/booking), premium bundle margins, advertising revenue from merchants",
          referral: "Group invite flow: book for 4+ friends, one person pays, others join → new user acquisition with social proof",
        },
      },
    },
    {
      phase: 4,
      data: {
        ideas: [
          { id: "i1", name: "Occasion-Based Homepage", description: "Replace generic listing with intent-led navigation: Date Night, Weekend Plans, Family Time, Nearby Tonight", customerValue: "Reduces decision fatigue, feels curated for their moment", businessValue: "Increases conversion by 25%+, reduces bounce rate", risks: "Content curation overhead, requires personalization engine", category: "customer", tags: ["homepage", "personalization", "P1"], votes: 12 },
          { id: "i2", name: "Bundled Experiences", description: "Package dinner + movie, concert + restaurant, sports + food as single bookable bundles", customerValue: "Eliminates planning friction for complete evening experience", businessValue: "Higher AOV, merchant partnerships, differentiation from BookMyShow", risks: "Complex inventory management, merchant coordination", category: "business", tags: ["bundles", "AOV", "P1"], votes: 10 },
          { id: "i3", name: "Social Group Features", description: "Invite friends, vote on options, split bills, shared itinerary — all in-app", customerValue: "Eliminates WhatsApp coordination chaos for group plans", businessValue: "Viral growth loop, each group booking acquires new users", risks: "Complex UX, payment splitting regulatory considerations", category: "growth", tags: ["social", "viral", "P2"], votes: 9 },
          { id: "i4", name: "District Rewards Program", description: "Points for every booking, redeemable for discounts, exclusive access, and Zomato Gold benefits", customerValue: "Incentivizes repeat usage, feels rewarded for loyalty", businessValue: "Drives retention, cross-category stickiness", risks: "Program economics, potential margin dilution", category: "customer", tags: ["loyalty", "retention", "P2"], votes: 7 },
          { id: "i5", name: "AI Going-Out Planner", description: "Chat-based planner: 'Plan a birthday for 8 people, budget ₹5000/head, Saturday evening'", customerValue: "Zero effort planning, feels magical and personalized", businessValue: "Strong differentiation, PR/viral potential, increases basket size", risks: "AI cost, quality of recommendations, latency", category: "growth", tags: ["AI", "differentiation", "P3"], votes: 6 },
          { id: "i6", name: "Early Access & Exclusive Inventory", description: "District users get 24-hour early access to hot tickets (concerts, sporting events)", customerValue: "FOMO relief, feeling of insider access", businessValue: "Drives DAU spikes before big events, retention for power users", risks: "Merchant negotiation, inventory allocation", category: "business", tags: ["exclusivity", "retention", "P2"], votes: 5 },
        ],
      },
    },
    {
      phase: 5,
      data: {
        riceItems: [
          { id: "r1", name: "Occasion-Based Homepage", reach: 1000000, impact: 3, confidence: 90, effort: 3, score: 900000 },
          { id: "r2", name: "Bundled Experiences", reach: 500000, impact: 3, confidence: 75, effort: 5, score: 225000 },
          { id: "r3", name: "Social Group Features", reach: 800000, impact: 2, confidence: 65, effort: 8, score: 130000 },
          { id: "r4", name: "District Rewards Program", reach: 600000, impact: 2, confidence: 80, effort: 6, score: 160000 },
          { id: "r5", name: "AI Going-Out Planner", reach: 300000, impact: 3, confidence: 50, effort: 10, score: 45000 },
          { id: "r6", name: "Early Access & Exclusive Inventory", reach: 200000, impact: 2, confidence: 70, effort: 4, score: 70000 },
        ],
        moscowItems: [
          { id: "m1", name: "Occasion-Based Homepage", category: "must" },
          { id: "m2", name: "Bundled Experiences (Dinner + Movie)", category: "must" },
          { id: "m3", name: "Improved Recommendations Engine", category: "must" },
          { id: "m4", name: "Social Group Invite", category: "should" },
          { id: "m5", name: "District Rewards Program", category: "should" },
          { id: "m6", name: "Split Bill Feature", category: "should" },
          { id: "m7", name: "Early Access Tickets", category: "could" },
          { id: "m8", name: "AI Going-Out Planner", category: "wont" },
          { id: "m9", name: "AR Venue Preview", category: "wont" },
        ],
        resourcePlanning: {
          engineering: "2 senior FE engineers, 3 BE engineers, 1 data engineer for recommendation service, 1 payments engineer for split bill",
          design: "1 senior product designer (full-time), 1 UX researcher for user testing, design systems support from Zomato core team",
          marketing: "1 growth PM, digital marketing budget ₹10Cr Q1, influencer partnerships for occasion-based campaigns",
          operations: "City ops team for merchant bundle partnerships, 1 operations manager for bundle logistics",
        },
        timeline: "Month 1-2: Occasion homepage + recommendation improvements\nMonth 3-4: Bundled experiences beta (5 cities)\nMonth 5-6: Social features + rewards program launch",
        dependencies: "Zomato payments infrastructure for split bill, Data Platform team for recommendation engine, Legal review for group payment flows, Merchant success team for bundle partnerships",
      },
    },
    {
      phase: 6,
      data: {
        userStories: [
          { id: "us1", asA: "going-out planner", iWant: "see a homepage organized by occasion (Date Night, Weekend Plans, Sports)", soThat: "I can find relevant experiences without browsing generic listings", acceptanceCriteria: ["Homepage shows at least 5 occasion cards", "Each occasion deep-links to pre-filtered results", "Occasion cards are personalized based on past behavior after 2+ bookings", "Load time < 2 seconds on 4G"], edgeCases: "First-time user sees popular occasions; no personalization until sufficient data", dependencies: "Recommendation service API, A/B testing framework" },
          { id: "us2", asA: "couple planning a date night", iWant: "book a dinner + movie bundle in a single checkout", soThat: "I don't have to coordinate between two separate apps and bookings", acceptanceCriteria: ["Bundle shows combined price and savings vs booking separately", "Single checkout flow with one payment", "Confirmation shows both bookings with timing guidance", "Can modify/cancel each component independently"], edgeCases: "Movie cancelled after dinner booked — automatic notification and refund flow", dependencies: "Merchant API contracts, combined booking inventory system" },
          { id: "us3", asA: "group organizer", iWant: "invite friends to vote on event options and split the payment", soThat: "I don't have to collect money separately via UPI or Paytm", acceptanceCriteria: ["Group invite link works via WhatsApp/SMS without app install (webview)", "Voting closes 24h before event with automatic best-option selection", "Payment split calculates per-person amount automatically", "Non-District users can pay via UPI without creating an account"], edgeCases: "Group member declines after payment collected — automated partial refund", dependencies: "UPI payment aggregator, WhatsApp Business API" },
        ],
        rolloutStrategy: [
          { stage: "alpha", description: "Internal Zomato employees test all 3 features in Bangalore", criteria: "< 5 critical bugs, booking completion rate > 70%, NPS > 30 from internal testers", timeline: "Week 1-2 of Month 1" },
          { stage: "closed_beta", description: "500 selected power users in Mumbai, Delhi, Bangalore via invite-only waitlist", criteria: "Booking completion > 75%, repeat rate > 30%, 0 payment failures > 24h", timeline: "Week 3-4 of Month 1 through Month 2" },
          { stage: "open_beta", description: "Top 10 metro cities, accessible from Zomato app cross-sell banner", criteria: "Crash rate < 0.1%, p95 latency < 3s, user satisfaction > 4.0/5", timeline: "Month 3-4" },
          { stage: "launch", description: "Full national rollout with marketing campaign: 'Every Plan, One App'", criteria: "MAU target 1M, D30 retention > 25%, GOTPAU > 1.5", timeline: "Month 5-6" },
        ],
        marketingPlan: {
          email: "Weekly 'What's happening this weekend' digest to Zomato user base with personalized event picks; triggered emails 3 days before booked events with add-ons suggestions",
          seo: "Capture high-intent queries: 'things to do in [city] this weekend', 'best date night restaurants [city]', 'book concert tickets [city]' — target top 3 ranking within 4 months",
          paid: "Instagram + YouTube campaigns targeting 'going-out intent' audiences; retarget Zomato users who clicked dining-out but didn't book; CPA target ₹80 for first booking",
          social: "Creator partnerships with city-specific lifestyle influencers; UGC campaign #MyDistrictMoment; social proof via booking confirmation share cards",
          partnerships: "Corporate partnerships for team outing bookings (B2B2C); hotel concierge partnerships for tourist going-out planning; co-branding with PVR/INOX and live event promoters",
          inApp: "Zomato app cross-sell banner after food order delivery ('Planning your evening? District has you covered'); push notifications at 5PM Friday for weekend plans; post-dining 'enjoyed the meal? How about catching a show?'",
        },
      },
    },
    {
      phase: 7,
      data: {
        risks: [
          { id: "risk1", category: "product", description: "Occasion-based personalization requires behavioral data — new users see generic experience for first 2-3 sessions", likelihood: "high", impact: "medium", mitigation: "Use location + time-of-day signals for cold start; onboarding 'What are you planning?' wizard to capture intent" },
          { id: "risk2", category: "engineering", description: "Bundle inventory sync between dining reservations and event ticketing systems could fail during high-demand periods", likelihood: "medium", impact: "high", mitigation: "Implement eventual consistency with optimistic UI; 15-min reservation hold on bundle initiation; fallback to individual booking flow" },
          { id: "risk3", category: "legal", description: "Group payment splitting may require specific RBI compliance for payment aggregation", likelihood: "low", impact: "high", mitigation: "Consult with legal team before feature launch; structure as 'bill splitting' not 'collection' to avoid NBFC classification" },
          { id: "risk4", category: "adoption", description: "Low merchant participation in bundle program — dining partners may resist event-linked inventory commitments", likelihood: "medium", impact: "medium", mitigation: "Guarantee merchant minimum occupancy for bundle slots; offer commission reduction for first 3 months; co-marketing support" },
          { id: "risk5", category: "product", description: "Users may download District for one event but not establish habit — one-time usage spike without retention", likelihood: "high", impact: "high", mitigation: "Post-booking engagement: 'How was your experience?', personalized follow-up with similar experiences, District Rewards onboarding immediately after first booking" },
        ],
        tradeOffs: [
          { id: "to1", title: "Build Recommendations In-House vs Use Third-Party Engine", pros: "Full control over data, lower long-term cost, competitive advantage", cons: "6-month development timeline, requires data engineering team allocation", rationale: "Decision: Build in-house. District's core differentiation is personalization quality. Third-party engines create data dependency and limit the going-out context modeling we need." },
          { id: "to2", title: "Launch in 5 Cities vs 20 Cities", pros: "Deeper quality in top markets, manageable ops burden, cleaner learnings", cons: "Slower MAU growth, BookMyShow may capture other markets", rationale: "Decision: Launch in top 8 cities (Bangalore, Mumbai, Delhi, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad). Depth of experience quality matters more than breadth for habit formation." },
          { id: "to3", title: "Free Bundles vs Commission-Based Bundles", pros: "Free bundles drive faster adoption, lower merchant resistance", cons: "Margin dilution, harder to monetize at scale, sets wrong price anchors", rationale: "Decision: Commission-based from Day 1 (8% on events, ₹75 on dining bookings). Sustainability matters; we can offer introductory discounts without free pricing." },
        ],
        roadmapItems: [
          { id: "rm1", title: "Occasion-Based Homepage v1", description: "Intent-led navigation: Date Night, Weekend Plans, Nearby Tonight, Family Time", timeframe: "now", priority: "p1", status: "planned" },
          { id: "rm2", title: "Recommendation Engine Improvements", description: "Location + time + behavioral signals for cold & warm users", timeframe: "now", priority: "p1", status: "planned" },
          { id: "rm3", title: "User Research & Funnel Analysis", description: "Benchmark current conversion, identify top drop-off points", timeframe: "now", priority: "p1", status: "planned" },
          { id: "rm4", title: "Bundled Experiences Beta", description: "Dinner + Movie, Concert + Restaurant packages in 5 cities", timeframe: "next", priority: "p1", status: "planned" },
          { id: "rm5", title: "Social Group Invite", description: "WhatsApp-native group invite, vote, and split bill flow", timeframe: "next", priority: "p2", status: "planned" },
          { id: "rm6", title: "District Rewards Program", description: "Points-based loyalty with Zomato Gold integration", timeframe: "next", priority: "p2", status: "planned" },
          { id: "rm7", title: "AI Going-Out Planner", description: "Natural language planning: 'Plan my Saturday for 6 people, ₹3000/head'", timeframe: "later", priority: "p3", status: "planned" },
          { id: "rm8", title: "B2B Corporate Outing Vertical", description: "Team events, offsite planning for companies", timeframe: "later", priority: "p3", status: "planned" },
        ],
        swot: {
          strengths: [
            "Zomato brand trust and existing 8M+ MAU user base for cross-sell",
            "Payment infrastructure and UPI integration already in place",
            "Merchant network across 500+ cities for dining partnerships",
            "Gold/Pro loyalty members as high-intent early adopters",
            "Data advantage: Zomato knows dining preferences and behavioral patterns",
          ],
          weaknesses: [
            "Low top-of-mind awareness: users associate Zomato/District only with food",
            "New category positioning requires significant behavior change",
            "Engineering bandwidth shared with Zomato core roadmap",
            "Limited events inventory compared to BookMyShow's established network",
            "No social graph yet — social features require network effect to be valuable",
          ],
          opportunities: [
            "₹1.5T+ offline entertainment market largely untapped by digital players",
            "Post-COVID going-out sentiment at all-time high in Tier-1 cities",
            "IPL, Bollywood, and concert market growing 40% YoY",
            "Corporate outing market underserved by existing platforms",
            "WhatsApp-native group coordination is a key unmet need",
          ],
          threats: [
            "BookMyShow adding dining + bundling features (confirmed in their roadmap)",
            "Swiggy expanding Dineout into events and experiences",
            "MagicPin with hyperlocal going-out discovery and cashbacks",
            "Google Maps adding event booking through partnerships",
            "Netflix/OTT reducing going-out frequency among target users",
          ],
        },
      },
    },
  ],
};

const TEMPLATES = [
  {
    name: "District by Zomato — Growth Strategy",
    slug: "district-zomato-growth",
    description: "Building India's default platform for going out. A complete product strategy case study covering growth pillars, user personas, RICE prioritization, and 90-day roadmap.",
    category: "Growth Strategy",
    featured: true,
    builtIn: true,
    tags: JSON.stringify(["Marketplace", "Consumer Internet", "Growth", "Zomato", "India", "Entertainment"]),
    usageCount: 247,
    data: JSON.stringify(DISTRICT_TEMPLATE_DATA),
  },
  { name: "Generic Product Case Study", slug: "generic-product", description: "A comprehensive blank framework for any product type. Covers all 7 phases with guiding questions.", category: "Product Strategy", featured: false, builtIn: true, tags: JSON.stringify(["Blank", "Framework", "All Types"]), usageCount: 189, data: JSON.stringify({ phases: [] }) },
  { name: "Product Sense Interview", slug: "product-sense-interview", description: "Structured PM interview format. How to improve a product, identify metrics, and prioritize features under time pressure.", category: "PM Interview", featured: false, builtIn: true, tags: JSON.stringify(["Interview", "Product Sense", "Meta", "Google"]), usageCount: 312, data: JSON.stringify({ phases: [] }) },
  { name: "SaaS B2B Product Strategy", slug: "saas-b2b-strategy", description: "Enterprise SaaS product strategy template with ICP definition, PLG vs SLG analysis, and expansion revenue framework.", category: "SaaS Product", featured: false, builtIn: true, tags: JSON.stringify(["SaaS", "B2B", "Enterprise", "PLG"]), usageCount: 156, data: JSON.stringify({ phases: [] }) },
  { name: "Consumer Mobile App Launch", slug: "consumer-app-launch", description: "Mobile app product launch template with user onboarding funnel, virality mechanics, and App Store optimization.", category: "Consumer App", featured: false, builtIn: true, tags: JSON.stringify(["Mobile", "Consumer", "App Launch", "iOS", "Android"]), usageCount: 203, data: JSON.stringify({ phases: [] }) },
  { name: "Marketplace Product Strategy", slug: "marketplace-product", description: "Two-sided marketplace template covering supply/demand balance, liquidity metrics, and take-rate optimization.", category: "Marketplace", featured: false, builtIn: true, tags: JSON.stringify(["Marketplace", "Two-Sided", "Network Effects"]), usageCount: 134, data: JSON.stringify({ phases: [] }) },
  { name: "Product Redesign Case Study", slug: "product-redesign", description: "UX-led product redesign framework with problem discovery, design principles, and success metrics.", category: "Product Redesign", featured: false, builtIn: true, tags: JSON.stringify(["Redesign", "UX", "Design Thinking"]), usageCount: 97, data: JSON.stringify({ phases: [] }) },
  { name: "AI Product Strategy", slug: "ai-product-strategy", description: "AI-first product strategy template covering model selection, data flywheel, trust & safety, and AI-specific metrics.", category: "AI Product", featured: false, builtIn: true, tags: JSON.stringify(["AI", "ML", "LLM", "Generative AI"]), usageCount: 89, data: JSON.stringify({ phases: [] }) },
  { name: "Product Growth Strategy", slug: "growth-strategy-generic", description: "AARRR-focused growth strategy template with acquisition channels, activation experiments, and retention playbooks.", category: "Growth Strategy", featured: false, builtIn: true, tags: JSON.stringify(["Growth", "AARRR", "Retention", "Activation"]), usageCount: 178, data: JSON.stringify({ phases: [] }) },
  { name: "Platform Product Strategy", slug: "platform-product", description: "Platform ecosystem strategy covering developer APIs, partner programs, and platform economics.", category: "Platform Product", featured: false, builtIn: true, tags: JSON.stringify(["Platform", "Ecosystem", "APIs", "Developer"]), usageCount: 67, data: JSON.stringify({ phases: [] }) },
  { name: "E-commerce Product Strategy", slug: "ecommerce-product", description: "E-commerce product strategy with conversion optimization, catalog strategy, and checkout experience.", category: "E-commerce", featured: false, builtIn: true, tags: JSON.stringify(["E-commerce", "Retail", "Conversion", "D2C"]), usageCount: 112, data: JSON.stringify({ phases: [] }) },
  { name: "Product Launch Plan", slug: "product-launch-plan", description: "Full product launch playbook covering GTM strategy, launch checklist, success metrics, and post-launch learnings.", category: "Product Launch", featured: false, builtIn: true, tags: JSON.stringify(["Launch", "GTM", "Marketing", "Playbook"]), usageCount: 145, data: JSON.stringify({ phases: [] }) },
  { name: "Physical Product Strategy", slug: "physical-product", description: "Hardware and physical product strategy with BOM analysis, supply chain considerations, and retail distribution.", category: "Product Strategy", featured: false, builtIn: true, tags: JSON.stringify(["Hardware", "Physical", "IoT", "Supply Chain"]), usageCount: 43, data: JSON.stringify({ phases: [] }) },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing templates
  await prisma.template.deleteMany({});
  console.log('✓ Cleared existing templates');

  // Seed templates
  for (const template of TEMPLATES) {
    await prisma.template.create({ data: template });
    console.log(`✓ Created template: ${template.name}`);
  }

  console.log(`\n✅ Seeded ${TEMPLATES.length} templates`);
  console.log('🚀 Database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
