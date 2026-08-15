import { DeckTheme, PitchDeck } from "@/types/pitch";

export const DECK_THEMES: Record<string, DeckTheme> = {
  midnight: {
    id: "midnight",
    name: "Midnight Founder",
    bgColor: "#090d16",
    cardBg: "rgba(255, 255, 255, 0.04)",
    textColor: "#f8fafc",
    subtextColor: "#94a3b8",
    accentColor: "#38bdf8",
    secondaryAccent: "#818cf8",
    badgeBg: "rgba(56, 189, 248, 0.12)",
    badgeText: "#38bdf8",
    border: "rgba(255, 255, 255, 0.08)",
    isDark: true,
    fontHeading: "var(--font-space-grotesk)",
    fontBody: "var(--font-inter)",
  },
  "silicon-slate": {
    id: "silicon-slate",
    name: "Silicon Slate",
    bgColor: "#0f172a",
    cardBg: "rgba(30, 41, 59, 0.6)",
    textColor: "#f1f5f9",
    subtextColor: "#94a3b8",
    accentColor: "#6366f1",
    secondaryAccent: "#a855f7",
    badgeBg: "rgba(99, 102, 241, 0.15)",
    badgeText: "#818cf8",
    border: "rgba(148, 163, 184, 0.12)",
    isDark: true,
    fontHeading: "var(--font-space-grotesk)",
    fontBody: "var(--font-inter)",
  },
  "emerald-venture": {
    id: "emerald-venture",
    name: "Emerald Venture",
    bgColor: "#061a14",
    cardBg: "rgba(16, 185, 129, 0.05)",
    textColor: "#f0fdf4",
    subtextColor: "#86efac",
    accentColor: "#10b981",
    secondaryAccent: "#34d399",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#34d399",
    border: "rgba(16, 185, 129, 0.18)",
    isDark: true,
    fontHeading: "var(--font-space-grotesk)",
    fontBody: "var(--font-inter)",
  },
  "crimson-bold": {
    id: "crimson-bold",
    name: "Crimson Bold",
    bgColor: "#14080e",
    cardBg: "rgba(244, 63, 94, 0.05)",
    textColor: "#fff1f2",
    subtextColor: "#fda4af",
    accentColor: "#f43f5e",
    secondaryAccent: "#fb7185",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeText: "#fb7185",
    border: "rgba(244, 63, 94, 0.15)",
    isDark: true,
    fontHeading: "var(--font-space-grotesk)",
    fontBody: "var(--font-inter)",
  },
  "minimal-light": {
    id: "minimal-light",
    name: "Minimalist Paper",
    bgColor: "#ffffff",
    cardBg: "#f8fafc",
    textColor: "#0f172a",
    subtextColor: "#64748b",
    accentColor: "#0284c7",
    secondaryAccent: "#0f172a",
    badgeBg: "#e0f2fe",
    badgeText: "#0369a1",
    border: "#e2e8f0",
    isDark: false,
    fontHeading: "var(--font-space-grotesk)",
    fontBody: "var(--font-inter)",
  },
  "cyber-gradient": {
    id: "cyber-gradient",
    name: "Cyber Velocity",
    bgColor: "#070b14",
    cardBg: "rgba(14, 165, 233, 0.06)",
    textColor: "#f8fafc",
    subtextColor: "#94a3b8",
    accentColor: "#06b6d4",
    secondaryAccent: "#3b82f6",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeText: "#22d3ee",
    border: "rgba(6, 182, 212, 0.2)",
    isDark: true,
    fontHeading: "var(--font-space-grotesk)",
    fontBody: "var(--font-inter)",
  }
};

export const STARTER_TEMPLATES: PitchDeck[] = [
  {
    id: "template-ai-saas",
    title: "Synthetix AI: Autonomous Revenue Infrastructure",
    companyName: "Synthetix AI",
    tagline: "The First Agentic Revenue Engine for Enterprise B2B SaaS",
    industry: "Enterprise AI & SaaS",
    targetAudience: "Seed & Series A Venture Funds",
    fundingGoal: "$3,000,000 Seed Round",
    themeId: "midnight",
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000 * 4,
    slides: [
      {
        id: "slide-1",
        layout: "title",
        title: "Synthetix AI",
        subtitle: "Autonomous Revenue Infrastructure for Enterprise B2B",
        tagline: "Closing complex enterprise deals 10x faster with multi-agent orchestration",
        speakerNotes: "Start with high energy. Introduce Synthetix as the next evolution in B2B sales automation.",
      },
      {
        id: "slide-2",
        layout: "problem",
        title: "Enterprise Sales is Broken & Manual",
        subtitle: "B2B sales teams spend 68% of their time on non-revenue generation activities",
        contentPoints: [
          "SDRs spend 4+ hours daily doing manual account research and boilerplate outreach with <1.5% conversion.",
          "High deal slippage: 42% of enterprise pipeline stalls due to delayed responses and fragmented RFP handling.",
          "Skyrocketing CAC: Customer Acquisition Cost has doubled over the past 3 years across SaaS companies."
        ],
        metrics: [
          { id: "m1", label: "Wasted Time", value: "68%", description: "Spent on CRM data entry & research" },
          { id: "m2", label: "CAC Increase", value: "+114%", description: "Industry average over last 36 mo" }
        ],
        speakerNotes: "Highlight the urgency. Every CRO we speak to is desperate to cut CAC while growing pipeline.",
        simulatedInvestorQuestions: [
          {
            question: "Why can't existing CRMs like Salesforce or HubSpot solve this natively?",
            suggestedAnswer: "Legacy CRMs are systems of record, not systems of action. Their architectures are relational databases with retrofitted LLM wrappers, whereas Synthetix is built from the ground up as an agentic execution workflow engine."
          }
        ]
      },
      {
        id: "slide-3",
        layout: "solution",
        title: "The Agentic Autonomous Revenue Team",
        subtitle: "AI Agents that research, qualify, negotiate, and prep RFP packages 24/7",
        contentPoints: [
          "Deep Context Research: Multi-agent crawlers synthesize 10-K filings, hiring signals, and tech stacks.",
          "Hyper-Personalized Deal Execution: Automated custom interactive demos and tailored security packets.",
          "Real-time CRM Sync: Zero data entry for human sales directors."
        ],
        metrics: [
          { id: "m3", label: "Pipeline Velocity", value: "4.2x", description: "Increase in closed-won cycle" },
          { id: "m4", label: "Conversion Rate", value: "18.4%", description: "Compared to 2.1% baseline" }
        ],
        speakerNotes: "Show how Synthetix acts as a workforce multiplier rather than just another chatbot tool."
      },
      {
        id: "slide-4",
        layout: "market",
        title: "Massive Global Market Opportunity",
        subtitle: "Enterprise Sales Automation is at an inflection point",
        marketSize: {
          tam: "$64.8 Billion",
          tamDesc: "Global Enterprise CRM & Revenue Intelligence Market by 2028",
          sam: "$14.2 Billion",
          samDesc: "B2B SaaS companies with ARR > $5M in North America & Europe",
          som: "$1.8 Billion",
          somDesc: "Mid-Market to Enterprise Tech & Cloud companies actively adopting AI agents"
        },
        speakerNotes: "Address the market sizing methodology clearly. TAM is growing at 24% CAGR."
      },
      {
        id: "slide-5",
        layout: "product",
        title: "Proprietary Agent Architecture",
        subtitle: "Built on fine-tuned domain models with deterministic guardrails",
        contentPoints: [
          "Signal Intelligence Engine: Listens to buying intent across 40+ enterprise data pipes.",
          "Autonomous Deal Room: Generates custom ROI calculators and live interactive sandboxes per prospect.",
          "Enterprise SOC2 & HIPAA Compliant with on-prem deployment options."
        ],
        speakerNotes: "Highlight our defensive moat: proprietary graph memory of enterprise sales patterns."
      },
      {
        id: "slide-6",
        layout: "traction",
        title: "Rapid Early Adoption & Explosive Growth",
        subtitle: "14 Enterprise Pilots converted into ARR in just 6 months",
        metrics: [
          { id: "t1", label: "Current ARR", value: "$840K", change: "+38% MoM" },
          { id: "t2", label: "Net Retention", value: "142%", change: "Industry top quartile" },
          { id: "t3", label: "Pilots Live", value: "32", change: "Fortune 500 companies" },
          { id: "t4", label: "Payback Period", value: "2.4 Mo", change: "High capital efficiency" }
        ],
        chartData: {
          type: "area",
          title: "ARR Growth Trajectory ($ in Thousands)",
          data: [
            { name: "Q1", value: 45 },
            { name: "Q2", value: 120 },
            { name: "Q3", value: 310 },
            { name: "Q4", value: 580 },
            { name: "Now", value: 840 }
          ]
        },
        speakerNotes: "Traction proves product-market fit. Customers are expanding seat licenses within 60 days."
      },
      {
        id: "slide-7",
        layout: "competition",
        title: "Competitive Landscape & Defensibility",
        subtitle: "Why Synthetix leads against legacy tools and shallow AI wrappers",
        competitors: {
          ourName: "Synthetix AI",
          competitorNames: ["Legacy CRMs", "Point AI Tools", "Outreach Engines"],
          rows: [
            { feature: "Multi-Agent Autonomy", us: true, comp1: false, comp2: "Partial", comp3: false },
            { feature: "Deep Enterprise Graph Memory", us: true, comp1: false, comp2: false, comp3: false },
            { feature: "Automated Deal Room Generation", us: true, comp1: false, comp2: false, comp3: false },
            { feature: "SOC2 Type II & On-Prem Deployment", us: true, comp1: true, comp2: false, comp3: "Partial" },
            { feature: "Deterministic Revenue Guardrails", us: true, comp1: false, comp2: false, comp3: false }
          ]
        },
        speakerNotes: "We don't compete on generic prompts; our moat is deep execution workflows and CRM graph integration."
      },
      {
        id: "slide-8",
        layout: "team",
        title: "World-Class Founding Team",
        subtitle: "Deep expertise in Enterprise Sales Engineering & Large Language Models",
        teamMembers: [
          { id: "tm1", name: "Alex Rivera", role: "CEO & Co-Founder", bio: "Ex-VP Sales at Snowflake. Scaled enterprise team from $10M to $150M ARR." },
          { id: "tm2", name: "Dr. Sarah Chen", role: "CTO & Co-Founder", bio: "PhD AI/NLP Stanford. Former Principal AI Researcher at Google Brain." },
          { id: "tm3", name: "Marcus Vance", role: "Head of Product", bio: "Ex-Staff Product Lead at Datadog & Segment. 12+ yrs in B2B data tooling." }
        ],
        speakerNotes: "We have the perfect blend of domain enterprise sales leadership and cutting-edge AI research."
      },
      {
        id: "slide-9",
        layout: "the-ask",
        title: "The Investment Opportunity",
        subtitle: "Raising $3,000,000 Seed Round to accelerate enterprise scale",
        contentPoints: [
          "55% R&D: Scale agent engineering team and multimodal reasoning infrastructure.",
          "30% GTM: Expand enterprise field sales team across US East & West Coast.",
          "15% Ops & Compliance: SOC2 Type II, ISO27001, and regional data residency servers."
        ],
        metrics: [
          { id: "ask1", label: "Target Raise", value: "$3.0M", description: "Preferred Equity / SAFE" },
          { id: "ask2", label: "Runway Target", value: "24 Months", description: "Path to $5M ARR Series A" },
          { id: "ask3", label: "Committed", value: "$1.2M", description: "From lead angel syndicates" }
        ],
        speakerNotes: "Reiterate milestone targets: Reaching $5M ARR within 18 months before launching Series A."
      }
    ]
  },
  {
    id: "template-fintech",
    title: "NovaPay: Instant Cross-Border Settlement",
    companyName: "NovaPay",
    tagline: "Sub-second global treasury & B2B cross-border payouts",
    industry: "Fintech & Global Payments",
    targetAudience: "Pre-Seed & Seed Investors",
    fundingGoal: "$2,000,000 Pre-Seed",
    themeId: "emerald-venture",
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 3600000 * 12,
    slides: [
      {
        id: "s-fin1",
        layout: "title",
        title: "NovaPay",
        subtitle: "Instant Global Treasury & Cross-Border B2B Settlement",
        tagline: "Moving global capital at the speed of the internet with 80% lower fees",
      },
      {
        id: "s-fin2",
        layout: "problem",
        title: "Global B2B Payments are Slow and Overpriced",
        subtitle: "Cross-border wires take 3-5 days and incur 3-6% in hidden FX spreads",
        contentPoints: [
          "Correspondent banking networks trap over $4 Trillion in idle liquidity.",
          "Mid-market exporters lose 4.8% of profit margins strictly on FX conversion fees.",
          "Manual compliance checks cause 14% of international transactions to be flagged or delayed."
        ],
        metrics: [
          { id: "fm1", label: "Average Settlement", value: "3.5 Days", description: "SWIFT correspondent route" },
          { id: "fm2", label: "Hidden FX Fees", value: "3.8%", description: "Eats SMB margins" }
        ]
      },
      {
        id: "s-fin3",
        layout: "solution",
        title: "Real-Time Liquidity Routing",
        subtitle: "Sub-second settlement with programmatic FX hedging and automated KYC",
        contentPoints: [
          "Smart Liquidity Engine: Routes payouts via local instant rail networks (FedNow, SEPA Instant, Pix).",
          "Automated AML & Risk Shield: Real-time transaction monitoring in <100 milliseconds.",
          "Unified Developer API: 1 SDK to unlock multi-currency accounts in 120+ countries."
        ],
        metrics: [
          { id: "fm3", label: "Settlement Speed", value: "< 4 Sec", description: "Instant local disbursement" },
          { id: "fm4", label: "Cost Reduction", value: "82%", description: "Versus legacy wire networks" }
        ]
      },
      {
        id: "s-fin4",
        layout: "the-ask",
        title: "Raising $2,000,000 Pre-Seed",
        subtitle: "Building the next-generation global B2B settlement backbone",
        contentPoints: [
          "Securing banking licenses and regional regulatory approvals.",
          "Expanding liquidity provider integrations across LATAM and APAC.",
          "Scaling engineering and security teams."
        ],
        metrics: [
          { id: "fa1", label: "Target Round", value: "$2.0M", description: "SAFE at $12M Cap" },
          { id: "fa2", label: "Target Metric", value: "$50M TPV", description: "Annualized within 12 months" }
        ]
      }
    ]
  }
];
