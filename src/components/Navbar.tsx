"use client";

import Link from "next/link";
import { Sparkles, Presentation, LayoutGrid, Plus, Wand2 } from "lucide-react";

interface NavbarProps {
  onOpenGenerator?: () => void;
}

export function Navbar({ onOpenGenerator }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Presentation className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Pitch<span className="text-sky-400">Craft</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/templates" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            Templates
          </Link>
          <Link href="/studio/template-ai-saas" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Live Studio
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            id="nav-create-deck-btn"
            onClick={onOpenGenerator}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4 animate-pulse" />
            <span>Generate with AI</span>
          </button>
        </div>
      </div>
    </header>
  );
}
