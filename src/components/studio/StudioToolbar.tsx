"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Presentation, 
  Download, 
  Sparkles, 
  Palette, 
  Layout, 
  Share2, 
  FileText, 
  Check, 
  ChevronDown, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { PitchDeck, SlideLayout, DeckThemeId } from "@/types/pitch";
import { DECK_THEMES } from "@/lib/constants";
import { exportDeckToPPTX } from "@/lib/export-pptx";
import { exportSlideElementToPDF } from "@/lib/export-pdf";

interface StudioToolbarProps {
  deck: PitchDeck;
  onUpdateDeck: (updated: Partial<PitchDeck>) => void;
  activeSlideLayout: SlideLayout;
  onChangeLayout: (layout: SlideLayout) => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

const LAYOUT_OPTIONS: { id: SlideLayout; label: string }[] = [
  { id: "title", label: "Title / Intro" },
  { id: "problem", label: "Problem / Pain" },
  { id: "solution", label: "Solution / Value" },
  { id: "market", label: "Market Sizing (TAM/SAM/SOM)" },
  { id: "product", label: "Product Architecture" },
  { id: "business-model", label: "Business Model" },
  { id: "traction", label: "Traction & Charts" },
  { id: "competition", label: "Competition Matrix" },
  { id: "team", label: "Leadership Team" },
  { id: "the-ask", label: "The Investment Ask" },
  { id: "two-column", label: "Two Column Layout" },
];

export function StudioToolbar({
  deck,
  onUpdateDeck,
  activeSlideLayout,
  onChangeLayout,
  onToggleCopilot,
  isCopilotOpen,
}: StudioToolbarProps) {
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportPPTX = async () => {
    setIsExportingPPTX(true);
    try {
      await exportDeckToPPTX(deck);
    } catch (e) {
      console.error("PPTX export failed", e);
      alert("Failed to export PPTX. Check console for details.");
    } finally {
      setIsExportingPPTX(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const slideIds = deck.slides.map((s) => `slide-canvas-${s.id}`);
      await exportSlideElementToPDF(slideIds, deck.title);
    } catch (e) {
      console.error("PDF export failed", e);
      // Fallback: trigger browser print
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#070b14] px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
      {/* Left: Back & Deck Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex flex-col">
          <input
            type="text"
            value={deck.title}
            onChange={(e) => onUpdateDeck({ title: e.target.value })}
            className="text-sm sm:text-base font-bold font-display bg-transparent text-white focus:outline-none hover:border-b border-slate-700 w-48 sm:w-80 truncate"
          />
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Auto-saved locally
          </span>
        </div>
      </div>

      {/* Middle: Theme & Layout Pickers */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Layout Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLayoutMenu(!showLayoutMenu);
              setShowThemeMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700"
          >
            <Layout className="w-3.5 h-3.5 text-sky-400" />
            <span className="capitalize">{activeSlideLayout}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
          </button>

          {showLayoutMenu && (
            <div className="absolute top-full mt-1.5 left-0 w-56 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl p-1.5 z-50">
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
                Change Slide Layout
              </div>
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChangeLayout(opt.id);
                    setShowLayoutMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    activeSlideLayout === opt.id
                      ? "bg-sky-500/20 text-sky-300"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span>{opt.label}</span>
                  {activeSlideLayout === opt.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowLayoutMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Theme: {DECK_THEMES[deck.themeId]?.name || "Midnight"}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
          </button>

          {showThemeMenu && (
            <div className="absolute top-full mt-1.5 left-0 w-48 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl p-1.5 z-50">
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
                Choose Color Theme
              </div>
              {Object.values(DECK_THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    onUpdateDeck({ themeId: th.id });
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    deck.themeId === th.id
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: th.accentColor }}
                  />
                  <span>{th.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions (Copilot, Present, Exports) */}
      <div className="flex items-center gap-2">
        {/* AI Copilot Drawer Trigger */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isCopilotOpen
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
              : "bg-slate-900 border border-slate-800 text-sky-400 hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleCopyShare}
          title="Copy Link to Share"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        {/* PPTX Export Button */}
        <button
          onClick={handleExportPPTX}
          disabled={isExportingPPTX}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-200"
        >
          {isExportingPPTX ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
          ) : (
            <Download className="w-3.5 h-3.5 text-sky-400" />
          )}
          <span className="hidden md:inline">PPTX</span>
        </button>

        {/* Present Mode Button */}
        <Link
          href={`/present/${deck.id}`}
          target="_blank"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Present</span>
        </Link>
      </div>
    </header>
  );
}
