"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PitchDeck, Slide } from "@/types/pitch";
import { getDeckById } from "@/lib/storage";
import { DECK_THEMES, STARTER_TEMPLATES } from "@/lib/constants";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Clock, 
  FileText, 
  Sparkles, 
  Check, 
  X, 
  XSquare,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import confetti from "canvas-confetti";

export default function PresentPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<PitchDeck | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isBlackout, setIsBlackout] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!deckId) return;
    const found = getDeckById(deckId);
    if (found) {
      setDeck(found);
    } else {
      setDeck(STARTER_TEMPLATES[0]);
    }
  }, [deckId]);

  // Stopwatch Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNext = useCallback(() => {
    if (!deck) return;
    if (currentSlideIndex < deck.slides.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      if (nextIdx === deck.slides.length - 1) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  }, [deck, currentSlideIndex]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space" || e.key === "PageDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "n" || e.key === "N") {
        setShowNotes((prev) => !prev);
      } else if (e.key === "l" || e.key === "L") {
        setIsLaserActive((prev) => !prev);
      } else if (e.key === "b" || e.key === "B") {
        setIsBlackout((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          setIsFullscreen(true);
        } else {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        }
      } else if (e.key === "Escape") {
        setIsBlackout(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Laser mouse tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLaserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  if (!deck) return null;

  const activeSlide = deck.slides[currentSlideIndex] || deck.slides[0];
  const theme = DECK_THEMES[deck.themeId] || DECK_THEMES.midnight;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 bg-black flex flex-col justify-between select-none ${
        isLaserActive ? "laser-cursor" : ""
      }`}
    >
      {/* Laser Pointer Dot */}
      {isLaserActive && (
        <div
          className="laser-dot"
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
        />
      )}

      {/* Blackout overlay */}
      {isBlackout && (
        <div
          onClick={() => setIsBlackout(false)}
          className="absolute inset-0 bg-black z-50 flex items-center justify-center cursor-pointer"
        >
          <span className="text-xs text-slate-700">Screen paused. Press 'B' or click to resume.</span>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <span className="font-bold text-white">{deck.companyName}</span>
          <span>•</span>
          <span>
            Slide {currentSlideIndex + 1} / {deck.slides.length}
          </span>
        </div>

        {/* Stopwatch Timer */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono font-bold text-white">{formatTimer(timerSeconds)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 hover:text-white text-slate-400"
          >
            {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setTimerSeconds(0)}
            className="p-1 hover:text-white text-slate-400"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Slide Rendering Area (16:9 Aspect Ratio) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        <div
          className="w-full max-w-7xl aspect-[16/9] rounded-2xl p-8 sm:p-14 shadow-2xl relative flex flex-col justify-between overflow-hidden border transition-all"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
            borderColor: theme.border,
            fontFamily: theme.fontBody,
          }}
        >
          {/* Header Branding */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md"
              style={{
                backgroundColor: theme.badgeBg,
                color: theme.badgeText,
                fontFamily: theme.fontHeading,
              }}
            >
              {deck.companyName}
            </span>
            <div className="text-xs font-mono opacity-50">
              {currentSlideIndex + 1 < 10 ? `0${currentSlideIndex + 1}` : currentSlideIndex + 1}
            </div>
          </div>

          {/* Slide Body */}
          <div className="flex-1 my-6 flex flex-col justify-center">
            {/* Title / Subtitle Headers */}
            {activeSlide.layout !== "title" && (
              <div className="mb-6">
                <h1
                  className="text-3xl sm:text-5xl font-bold font-display"
                  style={{ color: theme.textColor, fontFamily: theme.fontHeading }}
                >
                  {activeSlide.title}
                </h1>
                {activeSlide.subtitle && (
                  <p
                    className="text-base sm:text-xl mt-2 font-medium"
                    style={{ color: theme.subtextColor }}
                  >
                    {activeSlide.subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Layout Specific Renderers */}
            {/* 1. TITLE */}
            {activeSlide.layout === "title" && (
              <div className="text-center my-auto flex flex-col items-center justify-center space-y-4">
                <h1
                  className="text-5xl sm:text-7xl font-black font-display tracking-tight"
                  style={{ color: theme.textColor, fontFamily: theme.fontHeading }}
                >
                  {activeSlide.title}
                </h1>
                <p
                  className="text-xl sm:text-3xl font-semibold max-w-3xl"
                  style={{ color: theme.accentColor }}
                >
                  {activeSlide.subtitle}
                </p>
                {activeSlide.tagline && (
                  <p
                    className="text-base sm:text-xl max-w-2xl opacity-80"
                    style={{ color: theme.subtextColor }}
                  >
                    {activeSlide.tagline}
                  </p>
                )}
              </div>
            )}

            {/* 2. MARKET SIZING */}
            {activeSlide.layout === "market" && activeSlide.marketSize && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-auto">
                <div
                  className="p-6 rounded-2xl border flex flex-col justify-between"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    TAM (Total Addressable)
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-black font-display my-3"
                    style={{ color: theme.textColor }}
                  >
                    {activeSlide.marketSize.tam}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: theme.subtextColor }}>
                    {activeSlide.marketSize.tamDesc}
                  </p>
                </div>

                <div
                  className="p-6 rounded-2xl border flex flex-col justify-between"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    SAM (Serviceable)
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-black font-display my-3"
                    style={{ color: theme.textColor }}
                  >
                    {activeSlide.marketSize.sam}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: theme.subtextColor }}>
                    {activeSlide.marketSize.samDesc}
                  </p>
                </div>

                <div
                  className="p-6 rounded-2xl border flex flex-col justify-between"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    SOM (Obtainable Wedge)
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-black font-display my-3"
                    style={{ color: theme.textColor }}
                  >
                    {activeSlide.marketSize.som}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: theme.subtextColor }}>
                    {activeSlide.marketSize.somDesc}
                  </p>
                </div>
              </div>
            )}

            {/* 3. TRACTION */}
            {activeSlide.layout === "traction" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  {(activeSlide.metrics || []).map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border flex items-center justify-between"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                    >
                      <div>
                        <div className="text-xs font-semibold" style={{ color: theme.subtextColor }}>
                          {m.label}
                        </div>
                        <div
                          className="text-2xl font-bold font-display mt-0.5"
                          style={{ color: theme.accentColor }}
                        >
                          {m.value}
                        </div>
                      </div>
                      {m.change && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {m.change}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  className="md:col-span-7 p-6 rounded-xl border h-64 flex flex-col justify-between"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold text-slate-400">
                    {activeSlide.chartData?.title || "Revenue Growth Trajectory"}
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          activeSlide.chartData?.data || [
                            { name: "Q1", value: 30 },
                            { name: "Q2", value: 90 },
                            { name: "Q3", value: 240 },
                            { name: "Q4", value: 550 },
                            { name: "Now", value: 850 },
                          ]
                        }
                      >
                        <defs>
                          <linearGradient id="colorValPresent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.accentColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={theme.accentColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke={theme.subtextColor} fontSize={12} />
                        <YAxis stroke={theme.subtextColor} fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={theme.accentColor}
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorValPresent)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 4. COMPETITION */}
            {activeSlide.layout === "competition" && activeSlide.competitors && (
              <div
                className="overflow-x-auto rounded-xl border"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: theme.border }}>
                      <th className="p-4 font-semibold text-slate-400">Key Dimension</th>
                      <th
                        className="p-4 font-bold"
                        style={{ color: theme.accentColor, backgroundColor: theme.badgeBg }}
                      >
                        {activeSlide.competitors.ourName} (Us)
                      </th>
                      {activeSlide.competitors.competitorNames.map((c, i) => (
                        <th key={i} className="p-4 font-medium text-slate-400">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeSlide.competitors.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b last:border-0"
                        style={{ borderColor: theme.border }}
                      >
                        <td className="p-4 font-medium" style={{ color: theme.textColor }}>
                          {row.feature}
                        </td>
                        <td className="p-4 font-bold" style={{ backgroundColor: theme.badgeBg }}>
                          {row.us === true ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <span className="text-emerald-400">{String(row.us)}</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-400">
                          {row.comp1 === true ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : row.comp1 === false ? (
                            <X className="w-5 h-5 text-rose-400 opacity-60" />
                          ) : (
                            row.comp1
                          )}
                        </td>
                        <td className="p-4 text-slate-400">
                          {row.comp2 === true ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : row.comp2 === false ? (
                            <X className="w-5 h-5 text-rose-400 opacity-60" />
                          ) : (
                            row.comp2
                          )}
                        </td>
                        <td className="p-4 text-slate-400">
                          {row.comp3 === true ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : row.comp3 === false ? (
                            <X className="w-5 h-5 text-rose-400 opacity-60" />
                          ) : (
                            row.comp3
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. TEAM */}
            {activeSlide.layout === "team" && activeSlide.teamMembers && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-auto">
                {activeSlide.teamMembers.map((member, mIdx) => (
                  <div
                    key={member.id || mIdx}
                    className="p-6 rounded-2xl border flex flex-col justify-between"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white mb-4 shadow-lg">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div
                        className="text-lg font-bold font-display"
                        style={{ color: theme.textColor }}
                      >
                        {member.name}
                      </div>
                      <div
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: theme.accentColor }}
                      >
                        {member.role}
                      </div>
                    </div>
                    {member.bio && (
                      <p
                        className="text-xs mt-4 leading-relaxed opacity-80"
                        style={{ color: theme.subtextColor }}
                      >
                        {member.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 6. STANDARD BULLET CONTENT */}
            {["problem", "solution", "product", "business-model", "the-ask", "two-column"].includes(
              activeSlide.layout
            ) && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start my-auto">
                <div
                  className={`${
                    activeSlide.metrics && activeSlide.metrics.length > 0
                      ? "md:col-span-8"
                      : "md:col-span-12"
                  } space-y-4`}
                >
                  {(activeSlide.contentPoints || []).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-2.5 flex-shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <p
                        className="text-base sm:text-xl font-medium leading-relaxed"
                        style={{ color: theme.textColor }}
                      >
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                {activeSlide.metrics && activeSlide.metrics.length > 0 && (
                  <div className="md:col-span-4 space-y-4">
                    {activeSlide.metrics.map((metric, mIdx) => (
                      <div
                        key={metric.id || mIdx}
                        className="p-5 rounded-xl border flex flex-col justify-between"
                        style={{
                          backgroundColor: theme.cardBg,
                          borderColor: theme.border,
                        }}
                      >
                        <div
                          className="text-3xl font-bold font-display"
                          style={{ color: theme.accentColor }}
                        >
                          {metric.value}
                        </div>
                        <div
                          className="text-xs font-semibold uppercase tracking-wider mt-1"
                          style={{ color: theme.textColor }}
                        >
                          {metric.label}
                        </div>
                        {metric.description && (
                          <div
                            className="text-xs mt-1 opacity-75"
                            style={{ color: theme.subtextColor }}
                          >
                            {metric.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div
            className="pt-4 border-t flex items-center justify-between text-xs"
            style={{ borderColor: theme.border, color: theme.subtextColor }}
          >
            <span>{deck.companyName} • Confidential Investor Presentation</span>
            <span>
              {currentSlideIndex + 1} / {deck.slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Speaker Notes Overlay Drawer (Triggered with 'N') */}
      {showNotes && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-3xl p-5 rounded-2xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md z-40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Presenter Spoken Script
            </span>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
            {activeSlide.speakerNotes || "No speaker notes recorded for this slide. Use AI Copilot to generate a 45-second spoken script."}
          </p>
        </div>
      )}

      {/* Bottom Floating Presenter Bar */}
      <div className="h-16 bg-slate-950/90 border-t border-slate-800/80 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/studio/${deck.id}`)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Exit Studio
          </button>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Arrows</kbd> to advance
          </span>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLaserActive(!isLaserActive)}
            title="Toggle Laser Pointer (Key: L)"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLaserActive
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            🔴 Laser (L)
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            title="Toggle Speaker Notes (Key: N)"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showNotes
                ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            📝 Notes (N)
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-2">
              {currentSlideIndex + 1} / {deck.slides.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === deck.slides.length - 1}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
