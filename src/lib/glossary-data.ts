export type GlossaryCategory = 'Product Management' | 'Marketing' | 'Sales' | 'Finance';

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: GlossaryCategory;
  definition: string;
  formula?: string;
  example: string;
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  // ================= PRODUCT MANAGEMENT =================
  {
    id: "dau-mau",
    term: "Daily / Monthly Active Users",
    acronym: "DAU / MAU",
    category: "Product Management",
    definition: "The number of unique users who engage with your product on a daily or monthly basis. This is a primary indicator of core product usage and health.",
    formula: "Unique Active Users in 24 hours / Unique Active Users in 30 days",
    example: "A DAU/MAU ratio of 20% means users open the app about 6 days a month on average."
  },
  {
    id: "nps",
    term: "Net Promoter Score",
    acronym: "NPS",
    category: "Product Management",
    definition: "Measures overall customer loyalty and the likelihood of users recommending your product to others on a scale of -100 to 100.",
    formula: "% Promoters (Score 9-10) - % Detractors (Score 0-6)",
    example: "If 50% rate 9-10, 30% rate 7-8, and 20% rate 0-6, your NPS is 30."
  },
  {
    id: "ttv",
    term: "Time to Value",
    acronym: "TTV",
    category: "Product Management",
    definition: "The amount of time it takes for a new user to realize the core value ('aha moment') of your product after signing up.",
    example: "For Zoom, TTV is under 2 minutes (sign up and instantly join a meeting). For enterprise ERPs, TTV might be 3 months."
  },
  {
    id: "retention",
    term: "Retention Rate",
    category: "Product Management",
    definition: "The percentage of users who return to your product over a specific period (e.g., Day 7 or Day 30 retention). High retention indicates product-market fit.",
    formula: "(Users at end of period - New users added) / Users at start of period × 100",
    example: "If 100 people install an app on Jan 1, and 20 open it on Jan 30, the Day 30 retention is 20%."
  },
  {
    id: "jtbd",
    term: "Jobs to be Done",
    acronym: "JTBD",
    category: "Product Management",
    definition: "A framework focusing on the specific 'job' a user hires a product to do for them. It breaks down into Functional, Emotional, and Social jobs.",
    example: "People don't buy a 1/4-inch drill bit; they 'hire' it for the job of making a 1/4-inch hole."
  },
  {
    id: "moscow",
    term: "MoSCoW Framework",
    category: "Product Management",
    definition: "A prioritization technique used to reach a common understanding with stakeholders on the importance they place on the delivery of each requirement.",
    formula: "Must have, Should have, Could have, Won't have",
    example: "A login screen is a 'Must Have'. Social media login is a 'Could Have'."
  },
  {
    id: "rice",
    term: "RICE Scoring Model",
    acronym: "RICE",
    category: "Product Management",
    definition: "A prioritization framework designed to help product managers evaluate features based on four factors.",
    formula: "(Reach × Impact × Confidence) / Effort",
    example: "A feature reaching 1000 users with impact 3, confidence 80%, and effort 2 weeks = Score of 120,000."
  },
  {
    id: "ansoff",
    term: "Ansoff Matrix",
    category: "Product Management",
    definition: "A strategic planning tool that provides a framework to help executives, senior managers, and marketers devise strategies for future growth.",
    formula: "Market Penetration | Market Development | Product Development | Diversification",
    example: "Uber expanding to food delivery (UberEats) is Diversification (New Product, New Market)."
  },

  // ================= MARKETING =================
  {
    id: "cac",
    term: "Customer Acquisition Cost",
    acronym: "CAC",
    category: "Marketing",
    definition: "The total cost required to acquire a new paying customer, including all marketing and sales spend.",
    formula: "Total Sales & Marketing Spend / Number of New Customers Acquired",
    example: "Spending $10,000 on ads to acquire 100 customers means your CAC is $100."
  },
  {
    id: "cpa",
    term: "Cost Per Acquisition",
    acronym: "CPA",
    category: "Marketing",
    definition: "Measures the cost of acquiring a specific conversion (like a signup, download, or lead) from a campaign.",
    formula: "Campaign Cost / Number of Conversions",
    example: "Spending $500 on an ad that yields 50 email signups means a CPA of $10."
  },
  {
    id: "ctr",
    term: "Click-Through Rate",
    acronym: "CTR",
    category: "Marketing",
    definition: "The percentage of people who click on a link, ad, or email after viewing it.",
    formula: "(Total Clicks / Total Impressions) × 100",
    example: "An ad seen by 10,000 people that gets 200 clicks has a 2% CTR."
  },
  {
    id: "lift",
    term: "Conversion Lift",
    category: "Marketing",
    definition: "The percentage increase in conversion rate for a variation compared to the control group in an A/B test.",
    formula: "((Variation Conversion Rate - Control Conversion Rate) / Control Conversion Rate) × 100",
    example: "Control converts at 5%. Variation converts at 6%. The absolute lift is 1%, but the relative Conversion Lift is 20%."
  },

  // ================= SALES =================
  {
    id: "churn",
    term: "Churn Rate",
    category: "Sales",
    definition: "The percentage of users or subscribers who stop using your product or cancel their accounts within a given timeframe.",
    formula: "(Customers lost during period / Total customers at start of period) × 100",
    example: "Starting the month with 100 subscribers and losing 5 means a 5% monthly churn rate."
  },
  {
    id: "arpu",
    term: "Average Revenue Per User",
    acronym: "ARPU",
    category: "Sales",
    definition: "The average amount of revenue generated per active user or subscriber over a set period, used to gauge pricing and monetization strategies.",
    formula: "Total Revenue / Average Active Users",
    example: "$10,000 MRR from 500 users means your ARPU is $20."
  },
  {
    id: "magic-number",
    term: "SaaS Magic Number",
    category: "Sales",
    definition: "A metric used to measure sales and marketing efficiency. It answers: 'For every dollar spent on S&M, how much ARR is generated?'",
    formula: "(Current Qtr Revenue - Prev Qtr Revenue) × 4 / Prev Qtr Sales & Marketing Spend",
    example: "A Magic Number > 0.75 indicates efficient S&M spend, signaling the company should invest more in growth."
  },

  // ================= FINANCE =================
  {
    id: "mrr",
    term: "Monthly Recurring Revenue",
    acronym: "MRR",
    category: "Finance",
    definition: "The predictable, recurring revenue generated by your users each month, typically used for SaaS and subscription models.",
    formula: "Total paying customers × Average Revenue Per User (ARPU)",
    example: "1,000 customers paying $50/month generates $50,000 MRR."
  },
  {
    id: "ltv",
    term: "Customer Lifetime Value",
    acronym: "LTV / CLV",
    category: "Finance",
    definition: "The total projected revenue a single customer will generate throughout their entire relationship with your business.",
    formula: "ARPU / User Churn Rate",
    example: "If a customer pays $100/month and churns at 5% monthly, their LTV is $2,000."
  },
  {
    id: "ltv-cac",
    term: "LTV to CAC Ratio",
    acronym: "LTV:CAC",
    category: "Finance",
    definition: "A comparison of the value a customer brings over their lifetime against the cost to acquire them. A measure of unit economic sustainability.",
    formula: "Lifetime Value (LTV) / Customer Acquisition Cost (CAC)",
    example: "An LTV of $3,000 and CAC of $1,000 yields a 3:1 ratio (considered the SaaS industry benchmark)."
  },
  {
    id: "rule-40",
    term: "Rule of 40",
    category: "Finance",
    definition: "A principle that a SaaS company's growth rate plus its profit margin should equal or exceed 40%.",
    formula: "Revenue Growth Rate (%) + EBITDA Margin (%) >= 40%",
    example: "A company growing at 30% with a 15% profit margin meets the Rule of 40 (45%)."
  },
  {
    id: "nrr",
    term: "Net Revenue Retention",
    acronym: "NRR",
    category: "Finance",
    definition: "Measures the percentage of recurring revenue retained from existing customers over a given period, including expansions, downgrades, and churn.",
    formula: "(Starting MRR + Expansion MRR - Downgrade MRR - Churn MRR) / Starting MRR",
    example: "An NRR of 120% means that even if no new customers were acquired, revenue would still grow by 20% due to upsells."
  }
];
