"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Wand2, 
  X, 
  Check, 
  MessageSquare, 
  Volume2, 
  Minimize2, 
  Loader2, 
  Bot,
  Lightbulb
} from "lucide-react";
import { Slide, PitchDeck } from "@/types/pitch";

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slide: Slide;
  deck: PitchDeck;
  onUpdateSlide: (updated: Partial<Slide>) => void;
}

export function AICopilotDrawer({
  isOpen,
  onClose,
  slide,
  deck,
  onUpdateSlide,
}: AICopilotDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [lastAction, setLastAction] = useState<string>("");

  if (!isOpen) return null;

  const handleAction = async (
    action: "rewrite" | "shorten" | "investor-questions" | "speaker-notes",
    customInstruction?: string
  ) => {
    setLoading(true);
    setLastAction(action);

    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          slide,
          deckContext: {
            companyName: deck.companyName,
            industry: deck.industry,
            tagline: deck.tagline,
          },
          instruction: customInstruction || customPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        if (data.result.slide) {
          onUpdateSlide(data.result.slide);
        } else if (action === "speaker-notes" && data.result.text) {
          onUpdateSlide({ speakerNotes: data.result.text });
        }
      }
    } catch (e) {
      console.error("AI Assist error", e);
      alert("Failed to process AI assist. Please try again.");
    } finally {
      setLoading(false);
      setCustomPrompt("");
    }
  };

  return (
    <aside className="w-80 sm:w-96 flex-shrink-0 border-l border-slate-800 bg-[#070b14] flex flex-col h-full z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-200">
              AI Pitch Copilot
            </h3>
            <p className="text-[10px] text-slate-400">Slide Level Gemini Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick 1-Click AI Actions */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-sky-400" />
            Quick AI Enhancements
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleAction("rewrite", "Make bullet points punchier, bold, and metric-driven")}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-850 transition-all flex items-start gap-2.5 group"
            >
              <Sparkles className="w-4 h-4 text-sky-400 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Make Punchier & Metric-Driven</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Rewrites bullet points with strong venture-backed vocabulary.
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAction("speaker-notes")}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-850 transition-all flex items-start gap-2.5 group"
            >
              <Volume2 className="w-4 h-4 text-indigo-400 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Draft 45s Spoken Pitch Script</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Generates natural, spoken founder talking points.
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAction("investor-questions")}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-850 transition-all flex items-start gap-2.5 group"
            >
              <MessageSquare className="w-4 h-4 text-amber-400 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Simulate Tough VC Questions</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Prepares you for hard partner objections with answers.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom AI Prompt Input */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            Custom Instruction to Gemini
          </div>
          <textarea
            rows={3}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Turn point 2 into a cost-saving statistic, make the tone more conversational..."
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
          />
          <button
            onClick={() => handleAction("rewrite", customPrompt)}
            disabled={loading || !customPrompt.trim()}
            className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Apply AI Refinement</span>
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center gap-2.5 text-xs text-sky-300">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span className="font-medium animate-pulse">Gemini AI is crafting slide enhancements...</span>
          </div>
        )}
      </div>
    </aside>
  );
}
