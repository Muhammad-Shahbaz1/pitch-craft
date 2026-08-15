import Link from "next/link";
import { Presentation, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060911] text-slate-500 dark:text-slate-400 text-sm py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center">
            <Presentation className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-white">
            Pitch<span className="text-sky-500 dark:text-sky-400">Craft</span> AI
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Link href="/templates" className="hover:text-sky-600 dark:hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="/studio/template-ai-saas" className="hover:text-sky-600 dark:hover:text-white transition-colors">
            Live Studio
          </Link>
          <span className="flex items-center gap-1 text-slate-400">
            Engineered for Founders <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          </span>
        </div>
      </div>
    </footer>
  );
}
