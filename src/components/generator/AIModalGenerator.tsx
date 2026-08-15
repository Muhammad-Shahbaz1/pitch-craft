"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Sparkles, 
  Wand2, 
  Building, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Palette, 
  Loader2,
  Lightbulb
} from "lucide-react";
import { GenerateDeckRequest, DeckThemeId } from "@/types/pitch";
import { DECK_THEMES } from "@/lib/constants";
import { saveDeck } from "@/lib/storage";

interface AIModalGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IDEAS = [
  {
    name: "Enterprise AI Agent",
    companyName: "Cognita AI",
    industry: "Enterprise SaaS & AI",
    problem: "Knowledge workers waste 12 hours/week manually routing tickets and synthesizing unstructured customer requests across 20+ silos.",
    solution: "Autonomous multi-agent orchestration platform that resolves 75% of Tier-2 enterprise support and compliance tasks with verified deterministic audits.",
    model: "Enterprise Seat SaaS ($120/seat/mo) + Usage Compute",
    target: "Fortune 2000 Financial, Tech, and Healthcare enterprises",
    traction: "$720K ARR, 28 enterprise pilots, 138% net revenue retention",
    ask: "$3,000,000 Seed Round",
    theme: "midnight" as DeckThemeId
  },
  {
    name: "Fintech Cross-Border",
    companyName: "AetherPay",
    industry: "Fintech & Global Treasury",
    problem: "Global B2B payments suffer 4-day settlement lags and 3.5% hidden FX fees, locking up $3T in idle liquidity.",
    solution: "Instant real-time treasury engine routing liquidity over local instant payment networks with programmatic hedging.",
    model: "0.25% take-rate per cross-border volume + FX spread",
    target: "Mid-market exporters, marketplaces, and remote global employers",
    traction: "$18M annualized transaction volume, 340+ active business accounts",
    ask: "$2,000,000 Pre-Seed",
    theme: "emerald-venture" as DeckThemeId
  },
  {
    name: "HealthTech Diagnostics",
    companyName: "OncoVision AI",
    industry: "Digital Health & BioTech",
    problem: "Radiologists are overwhelmed with 300+ scans/day, leading to diagnostic burnout and late detection of early-stage lesions.",
    solution: "FDA-cleared computer vision companion detecting micro-nodules with 99.2% accuracy in <3 seconds.",
    model: "Per-scan SaaS reimbursement model ($45/scan) + hospital site license",
    target: "Top Tier hospital networks and private imaging clinics",
    traction: "12 hospital network IRB trials, 85,000 annotated benchmark scans",
    ask: "$4,000,000 Seed Round",
    theme: "silicon-slate" as DeckThemeId
  }
];

export function AIModalGenerator({ isOpen, onClose }: AIModalGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");

  const [formData, setFormData] = useState<GenerateDeckRequest>({
    companyName: "",
    industry: "Artificial Intelligence / SaaS",
    problemStatement: "",
    solutionStatement: "",
    businessModel: "B2B SaaS / Enterprise Subscription",
    targetMarket: "Global Enterprise & Mid-Market",
    tractionOrStats: "",
    fundingAsk: "$2,500,000 Seed",
    tone: "investor-ready",
    themeId: "midnight",
  });

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setFormData({
      companyName: preset.companyName,
      industry: preset.industry,
      problemStatement: preset.problem,
      solutionStatement: preset.solution,
      businessModel: preset.model,
      targetMarket: preset.target,
      tractionOrStats: preset.traction,
      fundingAsk: preset.ask,
      tone: "investor-ready",
      themeId: preset.theme,
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.problemStatement) {
      alert("Please enter at least your company name and problem statement.");
      return;
    }

    setLoading(true);
    setGenerationStep("Analyzing startup thesis & business model...");

    try {
      setTimeout(() => setGenerationStep("Calculating TAM / SAM / SOM market projections..."), 1200);
      setTimeout(() => setGenerationStep("Architecting 10 high-impact slide layouts..."), 2600);
      setTimeout(() => setGenerationStep("Synthesizing speaker notes & simulated VC Q&A..."), 4000);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.deck) {
        // Save into local storage
        saveDeck(data.deck);
        onClose();
        router.push(`/studio/${data.deck.id}`);
      } else {
        throw new Error(data.error || "Failed to generate deck.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "An error occurred during deck generation. Falling back to structured studio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-white">
              AI Pitch Deck Architect
            </h2>
            <p className="text-sm text-slate-400">
              Powered by Google Gemini 1.5. Generates a comprehensive, 10-slide investor-ready presentation.
            </p>
          </div>
        </div>

        {/* 1-Click Example Presets */}
        <div className="my-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets:
          </span>
          {PRESET_IDEAS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 border border-slate-700/60 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Main Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-400" /> Company / Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Synthetix AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" /> Industry & Domain *
              </label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Enterprise AI, Fintech, HealthTech"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
              />
            </div>
          </div>

          {/* Problem */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-rose-400" /> The Problem / Pain Point *
            </label>
            <textarea
              required
              rows={2}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="What urgent, expensive problem does your customer face? (e.g. Sales reps waste 68% of their time on manual CRM data entry...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm resize-none"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Your Solution & Value Prop *
            </label>
            <textarea
              required
              rows={2}
              value={formData.solutionStatement}
              onChange={(e) => setFormData({ ...formData, solutionStatement: e.target.value })}
              placeholder="How do you solve this 10x better? (e.g. An autonomous multi-agent pipeline that handles outbound qualification and proposal generation 24/7...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Traction or Key Metrics
              </label>
              <input
                type="text"
                value={formData.tractionOrStats}
                onChange={(e) => setFormData({ ...formData, tractionOrStats: e.target.value })}
                placeholder="e.g. $80K MRR, 30% MoM growth, 40 enterprise pilots"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Funding Ask / Target
              </label>
              <input
                type="text"
                value={formData.fundingAsk}
                onChange={(e) => setFormData({ ...formData, fundingAsk: e.target.value })}
                placeholder="e.g. $2,500,000 Seed"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-400" /> Visual Deck Style & Palette
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.values(DECK_THEMES).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, themeId: th.id })}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    formData.themeId === th.id
                      ? "border-sky-400 bg-sky-500/15 ring-2 ring-sky-500/30"
                      : "border-slate-800 bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div
                    className="w-full h-5 rounded-md mb-1.5 border border-white/10"
                    style={{ backgroundColor: th.bgColor }}
                  />
                  <span className="text-[11px] font-medium text-slate-300 truncate">
                    {th.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button & Loader */}
          <div className="pt-3">
            {loading ? (
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center gap-3 text-sky-300 text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-sky-400 flex-shrink-0" />
                <span className="font-medium animate-pulse">{generationStep}</span>
              </div>
            ) : (
              <button
                type="submit"
                id="generate-deck-submit-btn"
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Wand2 className="w-5 h-5" />
                <span>Architect 10-Slide Deck with Gemini AI</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
