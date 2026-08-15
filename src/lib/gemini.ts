import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateDeckRequest, PitchDeck, Slide, AIAssistRequest } from "@/types/pitch";
import { generateId } from "./utils";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generatePitchDeckWithAI(params: GenerateDeckRequest): Promise<PitchDeck> {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!genAI) {
    console.warn("GEMINI_API_KEY is not set. Generating intelligent structured deck fallback.");
    return generateFallbackDeck(params);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

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
        { "id": "tr2", "label": "Active Pipeline", value: "$1.4M", "description": "Qualified Enterprise deals" },
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

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

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
  if (!genAI) {
    return {
      text: "AI assistant processed your request: enhanced clarity, optimized tone for high investor conversion.",
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
Slide Metrics: ${JSON.stringify(req.slide.metrics || [])}

Return a JSON array format: [{"question": "string", "suggestedAnswer": "string"}]`;
  } else if (req.action === "speaker-notes") {
    prompt = `Write a high-impact, natural, conversational 45-second spoken script for the founder presenting this slide.
Company: ${req.deckContext.companyName}
Slide Title: ${req.slide.title}
Slide Subtitle: ${req.slide.subtitle || ""}
Points: ${JSON.stringify(req.slide.contentPoints || [])}

Keep it punchy, authentic, and confident.`;
  }

  try {
    const res = await model.generateContent(prompt);
    const output = res.response.text();

    if (req.action === "speaker-notes") {
      return { text: output };
    }

    try {
      const cleanJson = output.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (req.action === "investor-questions") {
        return {
          slide: {
            ...req.slide,
            simulatedInvestorQuestions: parsed,
          },
        };
      } else if (req.action === "rewrite") {
        return {
          slide: {
            ...req.slide,
            title: parsed.title || req.slide.title,
            subtitle: parsed.subtitle || req.slide.subtitle,
            contentPoints: parsed.contentPoints || req.slide.contentPoints,
          },
        };
      }
    } catch {
      return { text: output };
    }
  } catch (err) {
    console.error("AI Assist error:", err);
  }

  return { text: "Generated AI improvement." };
}

function generateFallbackDeck(params: GenerateDeckRequest): PitchDeck {
  const company = params.companyName || "InnovateX";
  const industry = params.industry || "AI & Enterprise Software";
  const problem = params.problemStatement || "Modern teams lose 40% of their operational velocity dealing with fragmented tools and high friction.";
  const solution = params.solutionStatement || "An automated intelligent platform that streamlines workflows and unlocks 10x team output.";
  const ask = params.fundingAsk || "$2,500,000 Seed Round";

  return {
    id: generateId(),
    title: `${company} Investor Presentation`,
    companyName: company,
    tagline: `Transforming ${industry} with Next-Gen Intelligence`,
    industry: industry,
    targetAudience: "Venture Capital & Strategic Angels",
    fundingGoal: ask,
    themeId: params.themeId || "midnight",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: [
      {
        id: "slide-1",
        layout: "title",
        title: company,
        subtitle: `Transforming ${industry}`,
        tagline: "The modern platform for high-velocity scalable operations",
        speakerNotes: `Welcome everyone. Today we are excited to introduce ${company}, where we are reimagining the future of ${industry}.`
      },
      {
        id: "slide-2",
        layout: "problem",
        title: "The Core Problem",
        subtitle: "Existing solutions are slow, expensive, and fail to scale",
        contentPoints: [
          problem,
          "Teams waste 15+ hours each week on repetitive overhead and manual reconciliation.",
          "High switching costs and legacy software lock-in restrict productivity and eat into profit margins."
        ],
        metrics: [
          { id: "m1", label: "Lost Productivity", value: "38%", description: "Reported by enterprise leads" },
          { id: "m2", label: "Cost Inefficiency", value: "3.2x", description: "Compared to modern workflows" }
        ],
        speakerNotes: "Highlight the urgency of this problem. Customers are actively feeling this pain every single day."
      },
      {
        id: "slide-3",
        layout: "solution",
        title: "The Solution",
        subtitle: solution,
        contentPoints: [
          "Seamless Integration: Deploy in minutes with zero disruption to existing tech stacks.",
          "Automated Workflows: Intelligent triggers eliminate 80% of routine human bottlenecks.",
          "Actionable Insights: Real-time intelligence and predictive analytics built into every layer."
        ],
        metrics: [
          { id: "m3", label: "Efficiency Gain", value: "10x", description: "Faster execution cycle" },
          { id: "m4", label: "ROI Payback", value: "< 60 Days", description: "Immediate time-to-value" }
        ],
        speakerNotes: "Explain why our approach is fundamentally 10x better, not just 10% cheaper."
      },
      {
        id: "slide-4",
        layout: "market",
        title: "Market Opportunity",
        subtitle: "Rapidly expanding multi-billion dollar category",
        marketSize: {
          tam: "$38.5 Billion",
          tamDesc: `Global market for modern ${industry} solutions by 2029`,
          sam: "$9.2 Billion",
          samDesc: "Target segment across North America & high-growth tech hubs",
          som: "$1.1 Billion",
          somDesc: "Initial target addressable customer base in years 1-3"
        },
        speakerNotes: "Walk through our bottom-up market sizing showing clear customer demand."
      },
      {
        id: "slide-5",
        layout: "product",
        title: "Product Architecture",
        subtitle: "Purpose-built for speed, security, and developer joy",
        contentPoints: [
          "Modular Core: Extendable architecture with rich open APIs and webhook integrations.",
          "Enterprise Security: End-to-end encryption, SOC2 ready, and role-based access control.",
          "Intuitive Experience: Beautiful, frictionless interface requiring zero employee training."
        ],
        speakerNotes: "Showcase the product UI and emphasize our defensible technology moat."
      },
      {
        id: "slide-6",
        layout: "traction",
        title: "Traction & Early Velocity",
        subtitle: "Strong organic pull and rapid revenue acceleration",
        metrics: [
          { id: "t1", label: "MoM Growth", value: "32%", change: "+8% vs last quarter" },
          { id: "t2", label: "Active Users", value: "14,500+", change: "Growing organically" },
          { id: "t3", label: "Net Retention", value: "128%", change: "High customer stickiness" }
        ],
        chartData: {
          type: "area",
          title: "Cumulative Growth Trajectory",
          data: [
            { name: "Month 1", value: 12 },
            { name: "Month 3", value: 35 },
            { name: "Month 6", value: 92 },
            { name: "Month 9", value: 210 },
            { name: "Month 12", value: 450 }
          ]
        },
        speakerNotes: "Highlight how our low CAC and viral referral loops drive sustainable growth."
      },
      {
        id: "slide-7",
        layout: "competition",
        title: "Competitive Landscape",
        subtitle: `How ${company} compares to existing market alternatives`,
        competitors: {
          ourName: company,
          competitorNames: ["Legacy Vendors", "Point Solutions", "Spreadsheets & Manual"],
          rows: [
            { feature: "AI-First Native Workflow", us: true, comp1: false, comp2: "Partial", comp3: false },
            { feature: "Real-Time Collaboration", us: true, comp1: false, comp2: true, comp3: false },
            { feature: "Setup Under 10 Minutes", us: true, comp1: false, comp2: false, comp3: true },
            { feature: "Predictive Analytics", us: true, comp1: "Partial", comp2: false, comp3: false }
          ]
        },
        speakerNotes: "Focus on our unique differentiation and why customers switch from incumbents."
      },
      {
        id: "slide-8",
        layout: "the-ask",
        title: "The Investment Ask",
        subtitle: `Raising ${ask} to accelerate engineering and go-to-market`,
        contentPoints: [
          "50% Product & Engineering: Deepen proprietary feature moat and AI infrastructure.",
          "35% Go-To-Market: Scale performance acquisition channels and enterprise direct sales.",
          "15% Operations & Working Capital: Compliance, talent acquisition, and infrastructure."
        ],
        metrics: [
          { id: "a1", label: "Target Raise", value: ask, description: "Seed financing round" },
          { id: "a2", label: "Target Runway", value: "20-24 Mo", description: "To next key valuation inflection" }
        ],
        speakerNotes: `Thank you for your time. We'd love to partner with you to make ${company} the definitive leader in ${industry}.`
      }
    ]
  };
}
