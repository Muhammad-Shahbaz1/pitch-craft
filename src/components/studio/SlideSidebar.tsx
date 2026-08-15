"use client";

import { Slide, DeckTheme } from "@/types/pitch";
import { 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Layout,
  Layers
} from "lucide-react";

interface SlideSidebarProps {
  slides: Slide[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (from: number, to: number) => void;
  theme: DeckTheme;
}

export function SlideSidebar({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  theme,
}: SlideSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-[#070b14] flex flex-col h-full overflow-hidden">
      {/* Header & Add Slide Button */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Slides ({slides.length})
          </span>
        </div>
        <button
          onClick={onAddSlide}
          title="Add New Slide"
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Slide Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <div
              key={slide.id || index}
              className={`group relative rounded-xl transition-all ${
                isActive
                  ? "ring-2 ring-sky-400 shadow-lg shadow-sky-500/10"
                  : "hover:ring-1 hover:ring-slate-700 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Slide Number Badge */}
              <div className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-slate-300 backdrop-blur-sm">
                {index + 1}
              </div>

              {/* Hover Actions Menu */}
              <div className="absolute top-2 right-2 z-10 hidden group-hover:flex items-center gap-1 bg-slate-900/90 rounded-md p-1 border border-slate-700/80 backdrop-blur-sm">
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(index, index - 1);
                    }}
                    title="Move Up"
                    className="p-1 hover:text-sky-400 text-slate-400"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                )}
                {index < slides.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(index, index + 1);
                    }}
                    title="Move Down"
                    className="p-1 hover:text-sky-400 text-slate-400"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateSlide(index);
                  }}
                  title="Duplicate Slide"
                  className="p-1 hover:text-sky-400 text-slate-400"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(index);
                    }}
                    title="Delete Slide"
                    className="p-1 hover:text-rose-400 text-slate-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Thumbnail Container */}
              <button
                type="button"
                onClick={() => onSelectSlide(index)}
                className="w-full text-left aspect-[16/9] rounded-xl p-3 flex flex-col justify-between overflow-hidden border border-slate-800"
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.textColor,
                }}
              >
                <div>
                  <span
                    className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                    }}
                  >
                    {slide.layout}
                  </span>
                  <p className="text-xs font-bold font-display truncate mt-1.5" style={{ color: theme.textColor }}>
                    {slide.title || "Untitled Slide"}
                  </p>
                </div>

                <p className="text-[10px] truncate opacity-70" style={{ color: theme.subtextColor }}>
                  {slide.subtitle || slide.tagline || (slide.contentPoints && slide.contentPoints[0]) || "Click to edit"}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
