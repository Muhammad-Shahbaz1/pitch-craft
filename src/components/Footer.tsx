import Link from "next/link";
import { Presentation, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060911] text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Presentation className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-slate-200">
            Pitch<span className="text-sky-400">Craft</span>
          </span>
          <span className="text-xs text-slate-500 pl-2 border-l border-slate-800">
            AI Pitch Deck & Presentation Platform
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link href="/templates" className="hover:text-slate-200 transition-colors">
            Templates
          </Link>
          <Link href="/studio/template-ai-saas" className="hover:text-slate-200 transition-colors">
            Editor Studio
          </Link>
          <span>Powered by Gemini 1.5 & Cloudinary</span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for founders worldwide
        </p>
      </div>
    </footer>
  );
}
