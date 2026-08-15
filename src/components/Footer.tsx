import Link from "next/link";
import { Presentation, Heart, Github, Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060911] text-slate-500 dark:text-slate-400 text-sm py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Info */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Presentation className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white">
              Pitch<span className="text-sky-500 dark:text-sky-400">Craft</span> AI
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5 animate-pulse" /> by{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">Muhammad Shahbaz</span>
          </span>
        </div>

        {/* Social Links & Quick Nav */}
        <div className="flex items-center gap-6">
          {/* Social Profiles */}
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/Muhammad-Shahbaz1"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub - Muhammad Shahbaz"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center group"
            >
              <Github className="w-4 h-4 group-hover:text-sky-500 transition-colors" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/muhammad-shahbaz-a74ba5249"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn - Muhammad Shahbaz"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center group"
            >
              <Linkedin className="w-4 h-4 group-hover:text-[#0a66c2] transition-colors" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923417570902"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp - Muhammad Shahbaz"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-[#25D366] dark:hover:text-[#25D366] hover:border-[#25D366]/40 hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center group"
            >
              <MessageCircle className="w-4 h-4 group-hover:text-[#25D366] transition-colors" />
            </a>
          </div>

          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/templates" className="hover:text-sky-600 dark:hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/studio/template-ai-saas" className="hover:text-sky-600 dark:hover:text-white transition-colors">
              Live Studio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
