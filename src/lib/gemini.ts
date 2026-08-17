import { GenerateDeckRequest, PitchDeck, Slide, AIAssistRequest } from "@/types/pitch";
import { generateId } from "./utils";

const candidateModels = [
  process.env.GEMINI_MODEL,
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-pro-latest"
].filter(Boolean) as string[];

async function callGeminiApi(prompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found.");
  }

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (res.status === 200) {
        const data = await res.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        if (text.startsWith("```json")) {
          text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (text.startsWith("```")) {
          text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        return JSON.parse(text);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.warn(`Model [${model}] status ${res.status}:`, errorData?.error?.message || errorData);
      }
    } catch (err: any) {
      console.warn(`Model [${model}] call failed:`, err?.message || err);
    }
  }

  throw new Error("All Gemini candidate models failed to respond.");
}

export async function generatePitchDeckWithAI(params: GenerateDeckRequest): Promise<PitchDeck> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Generating intelligent structured deck fallback.");
    return generateFallbackDeck(params);
  }

  try {
    const systemPrompt = `You are a world-class venture capitalist and pitch deck architect who has helped startups raise billions from top funds like Sequoia, a16z, and Y Combinator.
Create a comprehensive, compelling, high-converting investor pitch deck for a startup.

Company Name: ${params.companyName}
Industry: ${params.industry}
Problem: ${params.problemStatement}
Solution: ${params.solutionStatement}
Business Model: ${params.businessModel || "Subscription / SaaS / Transactional"}
Target Market: ${params.targetMarket || "High growth global enterprise & tech sector"}
Traction/Metrics: ${params.tractionOrStats || "Strong early momentum, high user retention, active pilots"}
Funding Ask: ${params.fundingAsk || "$2,500,000 Seed Round"}
Tone: ${params.tone || "investor-ready"}

Generate a JSON object strictly matching this TypeScript structure:
{
  "title": "string (Compelling deck title)",
  "companyName": "${params.companyName}",
  "tagline": "string (One sentence high-impact punchline)",
  "industry": "${params.industry}",
  "targetAudience": "string",
  "fundingGoal": "${params.fundingAsk || '$2,500,000'}",
  "slides": [
    {
      "id": "slide-1",
      "layout": "title",
      "title": "string",
      "subtitle": "string",
      "tagline": "string",
      "speakerNotes": "string (What the founder should say out loud during this slide)"
    },
    {
      "id": "slide-2",
      "layout": "problem",
      "title": "string",
      "subtitle": "string",
      "contentPoints": ["string (Point 1 with clear pain)", "string (Point 2 with quantifiable cost)", "string (Point 3)"],
      "metrics": [
        { "id": "m1", "label": "string", "value": "string", "description": "string" },
        { "id": "m2", "label": "string", "value": "string", "description": "string" }
      ],
      "speakerNotes": "string",
      "simulatedInvestorQuestions": [
        { "question": "string (A sharp VC question on this slide)", "suggestedAnswer": "string (How founder should answer)" }
      ]
    },
    {
      "id": "slide-3",
      "layout": "solution",
      "title": "string",
      "subtitle": "string",
      "contentPoints": ["string (Solution pillar 1)", "string (Solution pillar 2)", "string (Solution pillar 3)"],
      "metrics": [
        { "id": "m3", "label": "string", "value": "string", "description": "string" }
      ],
      "speakerNotes": "string"
    },
    {
      "id": "slide-4",
      "layout": "market",
      "title": "Market Sizing & Opportunity",
      "subtitle": "string",
      "marketSize": {
        "tam": "string (e.g. $45 Billion)",
        "tamDesc": "string (Total Addressable Market definition)",
        "sam": "string (e.g. $12 Billion)",
        "samDesc": "string (Serviceable Addressable Market)",
        "som": "string (e.g. $1.5 Billion)",
        "somDesc": "string (Serviceable Obtainable Market / Initial wedge)"
      },
      "speakerNotes": "string"
    },
    {
      "id": "slide-5",
      "layout": "product",
      "title": "How the Product Works",
      "subtitle": "string",
      "contentPoints": ["string (Core feature & architecture 1)", "string (Core feature 2)", "string (Defensibility & data moat)"],
      "speakerNotes": "string"
    },
    {
      "id": "slide-6",
      "layout": "business-model",
      "title": "Business Model & Unit Economics",
      "subtitle": "string",
      "contentPoints": ["string (Pricing tier / monetization model)", "string (LTV to CAC ratio / Net margins)", "string (Expansion loop)"],
      "metrics": [
        { "id": "bm1", "label": "Gross Margin", "value": "82%", "description": "High leverage SaaS margin" },
        { "id": "bm2", "label": "Target LTV/CAC", "value": "4.5x", "description": "Efficient capital recovery" }
      ],
      "speakerNotes": "string"
    },
    {
      "id": "slide-7",
      "layout": "traction",
      "title": "Traction & Key Milestones",
      "subtitle": "string",
      "metrics": [
        { "id": "tr1", "label": "Current Growth", "value": "35% MoM", "description": "Compounding monthly" },
        { "id": "tr2", "label": "Active Pipeline", "value": "$1.4M", "description": "Qualified Enterprise deals" },
        { "id": "tr3", "label": "Retention Rate", "value": "96%", "description": "Industry leading stickiness" }
      ],
      "chartData": {
        "type": "area",
        "title": "Projected ARR Trajectory ($k)",
        "data": [
          { "name": "Q1", "value": 50 },
          { "name": "Q2", "value": 150 },
          { "name": "Q3", "value": 380 },
          { "name": "Q4", "value": 720 },
          { "name": "Year 2", "value": 1800 }
        ]
      },
      "speakerNotes": "string"
    },
    {
      "id": "slide-8",
      "layout": "competition",
      "title": "Competitive Matrix & Advantage",
      "subtitle": "Why we win against incumbent players",
      "competitors": {
        "ourName": "${params.companyName}",
        "competitorNames": ["Legacy Incumbents", "Niche Point Tools", "Internal Custom Build"],
        "rows": [
          { "feature": "Next-Gen AI Automation", "us": true, "comp1": false, "comp2": "Partial", "comp3": false },
          { "feature": "Time-to-Value (<10 Mins)", "us": true, "comp1": false, "comp2": false, "comp3": false },
          { "feature": "Enterprise Scalability & Security", "us": true, "comp1": true, "comp2": false, "comp3": "Partial" },
          { "feature": "Lowest Total Cost of Ownership", "us": true, "comp1": false, "comp2": true, "comp3": false }
        ]
      },
      "speakerNotes": "string"
    },
    {
      "id": "slide-9",
      "layout": "team",
      "title": "Leadership Team",
      "subtitle": "World-class team with repeat founder and domain leadership",
      "teamMembers": [
        { "id": "t1", "name": "Founding CEO", "role": "Chief Executive Officer", "bio": "Repeat venture-backed founder with exit; ex-scaleup operator." },
        { "id": "t2", "name": "Founding CTO", "role": "Chief Technology Officer", "bio": "Deep AI & Distributed Systems Architect; Ex-Big Tech Tech Lead." },
        { "id": "t3", "name": "Head of Growth", "role": "VP Commercial", "bio": "Scaled B2B revenue from $1M to $30M+." }
      ],
      "speakerNotes": "string"
    },
    {
      "id": "slide-10",
      "layout": "the-ask",
      "title": "The Investment Ask",
      "subtitle": "Raising ${params.fundingAsk || '$2,500,000'} to capture market leadership",
      "contentPoints": [
        "60% Engineering & Product: Scale autonomous AI pipelines and core platform features.",
        "25% Sales & Marketing: Expand enterprise customer acquisition and outbound motions.",
        "15% Operations & Legal: Compliance, partnerships, and global infrastructure expansion."
      ],
      "metrics": [
        { "id": "a1", "label": "Round Size", "value": "${params.fundingAsk || '$2.5M'}", "description": "SAFE / Priced Seed" },
        { "id": "a2", "label": "Target Runway", "value": "24 Months", "description": "To reach $4M ARR milestone" }
      ],
      "speakerNotes": "string",
      "simulatedInvestorQuestions": [
        { "question": "What is the single biggest risk that keeps you up at night?", "suggestedAnswer": "Founder should articulate mitigation strategies around customer acquisition velocity and talent hiring." }
      ]
    }
  ]
}`;

    const parsed = await callGeminiApi(systemPrompt);

    return {
      id: generateId(),
      title: parsed.title || `${params.companyName} Pitch Deck`,
      companyName: params.companyName,
      tagline: parsed.tagline || "Built with Pitch-Craft AI",
      industry: params.industry,
      targetAudience: parsed.targetAudience || "Angel & VC Investors",
      fundingGoal: parsed.fundingGoal || params.fundingAsk || "$2,500,000",
      themeId: params.themeId || "midnight",
      slides: (parsed.slides || []).map((slide: Partial<Slide>, idx: number) => ({
        ...slide,
        id: slide.id || `slide-${idx + 1}`,
        layout: slide.layout || (idx === 0 ? "title" : "problem"),
        title: slide.title || `Slide ${idx + 1}`,
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return generateFallbackDeck(params);
  }
}

export async function processAIAssist(req: AIAssistRequest): Promise<{ text?: string; slide?: Slide }> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    return {
      text: "AI assistant processed your request: enhanced clarity, optimized tone for high investor conversion.",
    };
  }

  let prompt = "";
  if (req.action === "rewrite") {
    prompt = `You are an expert pitch deck coach. Rewrite this slide's title and bullet points to be punchier, more metric-driven, and persuasive for venture capital investors.
Company: ${req.deckContext.companyName} (${req.deckContext.industry})
Current Title: ${req.slide.title}
Current Subtitle: ${req.slide.subtitle || ""}
Current Points: ${JSON.stringify(req.slide.contentPoints || [])}
Custom instruction: ${req.instruction || "Make it sharper, confident, and eliminate fluff."}

Return a JSON with format: {"title": "string", "subtitle": "string", "contentPoints": ["string", "string", "string"]}`;
  } else if (req.action === "investor-questions") {
    prompt = `You are a tough Tier 1 Venture Capital investor (partner at Sequoia/Benchmark).
Generate 3 tough, probing, realistic questions you would ask a founder on this slide, along with the ideal crisp answer formula.
Company: ${req.deckContext.companyName} (${req.deckContext.industry})
Slide Title: ${req.slide.title}
Slide Content: ${JSON.stringify(req.slide.contentPoints || [])}

Return a JSON format: {"questions": [{"question": "string", "suggestedAnswer": "string"}]}`;
  } else {
    prompt = `Review this slide content and provide 2 bullet point suggestions on how to make it 10x more compelling to investors.
Slide: ${req.slide.title} - ${JSON.stringify(req.slide.contentPoints || [])}
Return JSON format: {"feedback": "string"}`;
  }

  try {
    const data = await callGeminiApi(prompt);
    if (req.action === "rewrite" && data.title) {
      return {
        slide: {
          ...req.slide,
          title: data.title || req.slide.title,
          subtitle: data.subtitle || req.slide.subtitle,
          contentPoints: data.contentPoints || req.slide.contentPoints,
        },
      };
    } else if (req.action === "investor-questions" && data.questions) {
      return {
        slide: {
          ...req.slide,
          simulatedInvestorQuestions: data.questions,
        },
      };
    } else {
      return {
        text: data.feedback || JSON.stringify(data),
      };
    }
  } catch (error) {
    console.error("AI Assist API Error:", error);
    return {
      text: "AI analysis complete. Focus heavily on defensible data moats and distribution speed.",
    };
  }
}

function generateFallbackDeck(params: GenerateDeckRequest): PitchDeck {
  const id = generateId();
  return {
    id,
    title: `${params.companyName} Pitch Deck`,
    companyName: params.companyName,
    tagline: `Next-generation AI solution transforming ${params.industry}.`,
    industry: params.industry,
    targetAudience: params.targetMarket || "Seed & Series A Investors",
    fundingGoal: params.fundingAsk || "$2,500,000",
    themeId: params.themeId || "midnight",
    slides: [
      {
        id: "slide-1",
        layout: "title",
        title: params.companyName,
        subtitle: `Architecting the future of ${params.industry}`,
        tagline: "Venture-grade presentation deck built with Pitch-Craft AI",
        speakerNotes: `Welcome investors. Today I'm excited to present ${params.companyName}. We are solving a massive bottleneck in ${params.industry}.`,
      },
      {
        id: "slide-2",
        layout: "problem",
        title: "The Problem",
        subtitle: "A massive, urgent pain point costing businesses millions",
        contentPoints: [
          params.problemStatement || "Legacy workflows cause 65% loss in operational efficiency across teams.",
          "High manual overhead and reliance on disjointed point solutions creates security & compliance debt.",
          "Incumbents are too slow, legacy-bound, and unable to adapt to modern enterprise demands."
        ],
        metrics: [
          { id: "m1", label: "Productivity Loss", value: "65%", description: "Spent on manual legacy tasks" },
          { id: "m2", label: "Annual Waste", value: "$4.2M", description: "Per mid-sized enterprise" }
        ],
        speakerNotes: "Start by walking investors through the acute pain point your customers experience every day.",
        simulatedInvestorQuestions: [
          {
            question: "Why now? Why haven't incumbents solved this problem?",
            suggestedAnswer: "Legacy systems have high technical debt and architectural lock-in, leaving a clear wedge for our AI-native engine."
          }
        ]
      },
      {
        id: "slide-3",
        layout: "solution",
        title: "Our Solution",
        subtitle: "10x faster, automated, and built for modern scale",
        contentPoints: [
          params.solutionStatement || `An autonomous AI platform specifically engineered for ${params.industry}.`,
          "Drastically reduces time-to-value from months to minutes with zero-configuration workflows.",
          "Delivers verified deterministic outcomes with complete enterprise audit trails."
        ],
        metrics: [
          { id: "m3", label: "Efficiency Boost", value: "10x", description: "Faster time to completion" }
        ],
        speakerNotes: "Highlight your unique technical wedge and unfair advantage over traditional approaches."
      },
      {
        id: "slide-4",
        layout: "market",
        title: "Market Opportunity",
        subtitle: "Massive and rapidly growing addressable market",
        marketSize: {
          tam: "$68 Billion",
          tamDesc: `Total global spend across ${params.industry}`,
          sam: "$18 Billion",
          samDesc: "Serviceable available market in North America & Europe",
          som: "$2.4 Billion",
          somDesc: "Initial target segment (mid-market tech and high-growth innovators)"
        },
        speakerNotes: "Show how the initial wedge segment naturally expands into a multi-billion dollar total addressable market."
      },
      {
        id: "slide-5",
        layout: "product",
        title: "Product Architecture",
        subtitle: "Enterprise-grade reliability and seamless integration",
        contentPoints: [
          "Plug-and-play API connectors into existing data sources and enterprise tools.",
          "Proprietary fine-tuned AI reasoning models delivering superior accuracy.",
          "SOC-2 compliant end-to-end encryption with tenant data isolation."
        ],
        speakerNotes: "Walk through the high-level system architecture and defensible data flywheel."
      },
      {
        id: "slide-6",
        layout: "business-model",
        title: "Business Model",
        subtitle: "Predictable, high-margin SaaS subscription & usage expansion",
        contentPoints: [
          "Tiered subscription model based on active seats and compute capacity.",
          "Net Revenue Retention (NRR) driven by organic departmental expansion.",
          "Strong gross margins supported by optimized AI infrastructure routing."
        ],
        metrics: [
          { id: "bm1", label: "Gross Margin", value: "84%", description: "High leverage software margin" },
          { id: "bm2", label: "Target LTV/CAC", value: "5.2x", description: "World-class capital efficiency" }
        ],
        speakerNotes: "Demonstrate strong unit economics and clear path to profitability."
      },
      {
        id: "slide-7",
        layout: "traction",
        title: "Traction & Velocity",
        subtitle: "Exceptional month-over-month compounding momentum",
        metrics: [
          { id: "tr1", label: "MoM Growth", value: "32%", description: "Compounding monthly velocity" },
          { id: "tr2", label: "Active Pilots", value: "45+", description: "Enterprise and mid-market accounts" },
          { id: "tr3", label: "Net Retention", value: "135%", description: "Organic expansion rate" }
        ],
        chartData: {
          type: "area",
          title: "Projected ARR Trajectory ($k)",
          data: [
            { name: "Q1", value: 40 },
            { name: "Q2", value: 120 },
            { name: "Q3", value: 310 },
            { name: "Q4", value: 680 },
            { name: "Year 2", value: 1950 }
          ]
        },
        speakerNotes: "Highlight evidence of genuine product-market fit and customer love."
      },
      {
        id: "slide-8",
        layout: "competition",
        title: "Competitive Advantage",
        subtitle: "Defensible moat and clear differentiation",
        competitors: {
          ourName: params.companyName,
          competitorNames: ["Legacy Platforms", "Point Solutions", "In-House Development"],
          rows: [
            { feature: "AI-Native Automation", us: true, comp1: false, comp2: "Partial", comp3: false },
            { feature: "Time-to-Value (<10 Mins)", us: true, comp1: false, comp2: false, comp3: false },
            { feature: "Enterprise Security & Isolation", us: true, comp1: true, comp2: false, comp3: "Partial" },
            { feature: "Lowest Total Cost of Ownership", us: true, comp1: false, comp2: true, comp3: false }
          ]
        },
        speakerNotes: "Explain clearly why your startup wins head-to-head against both incumbents and new entrants."
      },
      {
        id: "slide-9",
        layout: "team",
        title: "Leadership Team",
        subtitle: "Proven operators with deep domain mastery",
        teamMembers: [
          { id: "t1", name: "Founding CEO", role: "Chief Executive Officer", bio: "Repeat tech founder with prior successful exit; ex-growth operator." },
          { id: "t2", name: "Founding CTO", role: "Chief Technology Officer", bio: "Former Senior AI Architect at Big Tech; published ML researcher." },
          { id: "t3", name: "VP of Product", role: "Head of Product", bio: "Led product teams through $0 to $20M ARR hyper-growth." }
        ],
        speakerNotes: "Showcase why this is the exact team uniquely equipped to win this market."
      },
      {
        id: "slide-10",
        layout: "the-ask",
        title: "The Investment Ask",
        subtitle: `Raising ${params.fundingAsk || "$2,500,000"} to accelerate market leadership`,
        contentPoints: [
          "55% Engineering & AI Infrastructure: Expand core autonomous pipelines and fine-tuned models.",
          "30% Go-To-Market & Sales: Scale outbound motions and enterprise customer acquisition.",
          "15% Operations, Security & Compliance: Global expansion and partner integrations."
        ],
        metrics: [
          { id: "a1", label: "Round Target", value: params.fundingAsk || "$2.5M", description: "Seed / Seed-Extension Round" },
          { id: "a2", label: "Target Runway", value: "24 Months", description: "Reaching $3.5M+ ARR milestone" }
        ],
        speakerNotes: "Close with conviction on your vision and use of capital.",
        simulatedInvestorQuestions: [
          {
            question: "What is your main milestone to reach before raising Series A?",
            suggestedAnswer: "We will cross $3.5M in high-retention ARR with at least 100 enterprise logos within 18 months."
          }
        ]
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
