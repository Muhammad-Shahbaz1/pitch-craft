"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Wand2, 
  Presentation, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Copy,
  Plus,
  Layers,
  Zap,
  Target
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIModalGenerator } from "@/components/generator/AIModalGenerator";
import { PitchDeck } from "@/types/pitch";
import { getSavedDecks, duplicateDeck } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [userDecks, setUserDecks] = useState<PitchDeck[]>([]);

  useEffect(() => {
    setUserDecks(getSavedDecks());
  }, []);

  const handleDuplicate = (id: string) => {
    const cloned = duplicateDeck(id);
    if (cloned) {
      setUserDecks(getSavedDecks());
      router.push(`/studio/${cloned.id}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white transition-colors duration-200">
      <Navbar onOpenGenerator={() => setIsGeneratorOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 sm:w-[680px] h-72 bg-gradient-to-tr from-sky-500/20 via-blue-600/15 to-indigo-500/20 blur-[110px] pointer-events-none rounded-full" />

        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-sky-50 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-8 shadow-sm backdrop-blur-md hover:scale-105 transition-transform cursor-default">
          <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
          <span>Next-Generation AI Pitch Deck Engine</span>
        </div>

        {/* Professional Sans-Serif Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-display tracking-[-0.035em] text-slate-900 dark:text-white max-w-5xl leading-[1.08]">
          Craft Venture-Backed Pitch Decks in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300">
            Minutes, Not Weeks.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-7 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
          From company concept to structured 10-slide investor decks, speaker notes, and tough VC Q&A prep. Export instantly to PowerPoint (.pptx) & PDF.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            id="hero-generate-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base"
          >
            <Wand2 className="w-5 h-5" />
            <span>Generate Pitch Deck with AI</span>
          </button>

          <Link
            href="/studio/template-ai-saas"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-2 text-base shadow-sm"
          >
            <Presentation className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            <span>Open Sample Deck Studio</span>
          </Link>
        </div>

        {/* Value Prop Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Gemini AI Reasoning</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant .PPTX & .PDF Export</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Live Presenter Mode & Timer</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>VC Q&A Simulator</span>
          </div>
        </div>
      </section>

      {/* Your Decks & Templates Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Your Pitch Decks</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage, edit, duplicate, and export your pitch presentations.
            </p>
          </div>
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Deck</span>
          </button>
        </div>

        {/* Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDecks.map((deck) => (
            <div
              key={deck.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1322] hover:border-sky-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-5 group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    {deck.industry}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {deck.slides?.length || 0} Slides
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                  {deck.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {deck.tagline || `${deck.companyName} Investor Deck`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {deck.fundingGoal || "$2.5M Seed"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicate(deck.id)}
                    title="Duplicate Deck"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/studio/${deck.id}`}
                    className="flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white shadow-sm transition-all"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            Everything You Need to Win Over Investors
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Engineered with the proven frameworks of top accelerators like Y Combinator and Techstars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              Gemini AI Structured Deck Generation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Synthesizes TAM/SAM/SOM market sizes, problem-solution statements, and business models into clean structured slide payloads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              Interactive Financials & Charts
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Visualize ARR growth, retention, and competitive matrices with dynamic charts that look polished on every screen.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Presentation className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white mb-2">
              Presenter Mode with VC Q&A
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deliver smooth pitches with fullscreen dual-screen speaker notes, live timers, laser pointers, and simulated hard investor questions.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* AI Generator Modal */}
      <AIModalGenerator
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />
    </div>
  );
}
