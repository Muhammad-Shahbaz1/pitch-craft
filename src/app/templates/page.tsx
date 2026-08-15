"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIModalGenerator } from "@/components/generator/AIModalGenerator";
import { STARTER_TEMPLATES, DECK_THEMES } from "@/lib/constants";
import { saveDeck } from "@/lib/storage";
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Copy, 
  Wand2, 
  Presentation,
  CheckCircle2
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const handleUseTemplate = (template: typeof STARTER_TEMPLATES[0]) => {
    const newDeck = {
      ...template,
      id: `deck-${Date.now().toString(36)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveDeck(newDeck);
    router.push(`/studio/${newDeck.id}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#070b14] text-slate-100 selection:bg-sky-500 selection:text-white">
      <Navbar onOpenGenerator={() => setIsGeneratorOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Venture-Backed Pitch Templates</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            Proven Pitch Deck Frameworks
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            Battle-tested by founders who raised millions from top venture capital firms. Clone any template with 1-click and customize with Gemini AI.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STARTER_TEMPLATES.map((tmpl) => {
            const theme = DECK_THEMES[tmpl.themeId] || DECK_THEMES.midnight;
            return (
              <div
                key={tmpl.id}
                className="rounded-3xl border border-slate-800 bg-[#0d1322] hover:border-slate-700 transition-all p-6 sm:p-8 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {tmpl.industry}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {tmpl.slides.length} Slide Deck
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-sky-300 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {tmpl.tagline}
                  </p>

                  {/* Slide Preview Grid Miniatures */}
                  <div className="mt-6 grid grid-cols-3 gap-2.5">
                    {tmpl.slides.slice(0, 3).map((slide, i) => (
                      <div
                        key={i}
                        className="aspect-[16/9] rounded-xl p-2.5 border text-left flex flex-col justify-between overflow-hidden text-[9px]"
                        style={{
                          backgroundColor: theme.bgColor,
                          color: theme.textColor,
                          borderColor: theme.border,
                        }}
                      >
                        <span className="font-bold uppercase tracking-wider text-sky-400">
                          {slide.layout}
                        </span>
                        <span className="truncate font-semibold opacity-90">
                          {slide.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="mt-6 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Target Funding: <strong className="text-white">{tmpl.fundingGoal}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pre-built Speaker Script & VC Tough Q&A included</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Theme: <strong className="text-slate-200">{theme.name}</strong>
                  </span>

                  <button
                    onClick={() => handleUseTemplate(tmpl)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />

      <AIModalGenerator
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />
    </div>
  );
}
