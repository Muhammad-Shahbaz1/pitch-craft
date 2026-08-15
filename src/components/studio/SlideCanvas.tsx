"use client";

import { useState } from "react";
import { Slide, DeckTheme, MetricItem, TeamMember, CompetitorComparison } from "@/types/pitch";
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  Check, 
  X, 
  DollarSign, 
  Users, 
  BarChart3, 
  Target, 
  Award,
  Sparkles,
  Quote
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface SlideCanvasProps {
  slide: Slide;
  theme: DeckTheme;
  companyName: string;
  onUpdateSlide: (updated: Partial<Slide>) => void;
  slideNumber: number;
  totalSlides: number;
}

export function SlideCanvas({
  slide,
  theme,
  companyName,
  onUpdateSlide,
  slideNumber,
  totalSlides,
}: SlideCanvasProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "notes" | "vc-qa">("visual");

  const handlePointChange = (index: number, val: string) => {
    const updated = [...(slide.contentPoints || [])];
    updated[index] = val;
    onUpdateSlide({ contentPoints: updated });
  };

  const handleAddPoint = () => {
    const updated = [...(slide.contentPoints || []), "New key point for this slide"];
    onUpdateSlide({ contentPoints: updated });
  };

  const handleDeletePoint = (index: number) => {
    const updated = (slide.contentPoints || []).filter((_, i) => i !== index);
    onUpdateSlide({ contentPoints: updated });
  };

  const handleMetricChange = (index: number, field: keyof MetricItem, val: string) => {
    const metrics = [...(slide.metrics || [])];
    if (metrics[index]) {
      metrics[index] = { ...metrics[index], [field]: val };
      onUpdateSlide({ metrics });
    }
  };

  const handleAddMetric = () => {
    const newMetric: MetricItem = {
      id: `m-${Date.now()}`,
      label: "Metric Label",
      value: "99%",
      description: "Description of the metric",
    };
    onUpdateSlide({ metrics: [...(slide.metrics || []), newMetric] });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0a0f1d] p-4 sm:p-8 items-center justify-start">
      {/* Top Tabs */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "visual"
                ? "bg-sky-500 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Slide Canvas
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "notes"
                ? "bg-sky-500 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Speaker Script & Notes
          </button>
          <button
            onClick={() => setActiveTab("vc-qa")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "vc-qa"
                ? "bg-sky-500 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            VC Tough Q&A Simulator
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Slide {slideNumber} of {totalSlides} • Layout: <span className="text-sky-400 font-semibold uppercase">{slide.layout}</span>
        </div>
      </div>

      {/* Main 16:9 Presentation Canvas */}
      {activeTab === "visual" && (
        <div
          id={`slide-canvas-${slide.id}`}
          className="w-full max-w-5xl aspect-[16/9] rounded-2xl p-8 sm:p-12 shadow-2xl relative flex flex-col justify-between overflow-hidden border transition-all"
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
            borderColor: theme.border,
            fontFamily: theme.fontBody,
          }}
        >
          {/* Header Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: theme.badgeBg,
                  color: theme.badgeText,
                  fontFamily: theme.fontHeading,
                }}
              >
                {companyName || "Pitch-Craft"}
              </span>
              <span className="text-xs opacity-40 font-mono">/</span>
              <span className="text-xs font-semibold opacity-60 tracking-wider uppercase">
                {slide.layout}
              </span>
            </div>
            <div className="text-xs font-mono opacity-50">
              {slideNumber < 10 ? `0${slideNumber}` : slideNumber}
            </div>
          </div>

          {/* Slide Body Content */}
          <div className="flex-1 my-6 flex flex-col justify-center">
            {/* Title / Subtitle Headers */}
            {slide.layout !== "title" && (
              <div className="mb-6">
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => onUpdateSlide({ title: e.target.value })}
                  placeholder="Enter slide title..."
                  className="w-full text-2xl sm:text-4xl font-bold font-display bg-transparent border-b border-transparent hover:border-slate-600/40 focus:border-sky-500 focus:outline-none transition-colors"
                  style={{ color: theme.textColor, fontFamily: theme.fontHeading }}
                />
                <input
                  type="text"
                  value={slide.subtitle || ""}
                  onChange={(e) => onUpdateSlide({ subtitle: e.target.value })}
                  placeholder="Add a punchy subtitle or metric takeaway..."
                  className="w-full text-sm sm:text-base mt-1.5 bg-transparent border-b border-transparent hover:border-slate-600/40 focus:border-sky-500 focus:outline-none transition-colors"
                  style={{ color: theme.subtextColor }}
                />
              </div>
            )}

            {/* Layout Specific Renderers */}
            {/* 1. TITLE LAYOUT */}
            {slide.layout === "title" && (
              <div className="text-center my-auto flex flex-col items-center justify-center space-y-4">
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => onUpdateSlide({ title: e.target.value })}
                  placeholder="Company Name"
                  className="text-4xl sm:text-6xl font-black font-display text-center bg-transparent border-b border-transparent hover:border-slate-600/40 focus:border-sky-500 focus:outline-none w-full"
                  style={{ color: theme.textColor, fontFamily: theme.fontHeading }}
                />
                <input
                  type="text"
                  value={slide.subtitle || ""}
                  onChange={(e) => onUpdateSlide({ subtitle: e.target.value })}
                  placeholder="Subtitle or Mission statement"
                  className="text-lg sm:text-2xl text-center bg-transparent border-b border-transparent hover:border-slate-600/40 focus:border-sky-500 focus:outline-none w-full max-w-2xl font-medium"
                  style={{ color: theme.accentColor }}
                />
                <input
                  type="text"
                  value={slide.tagline || ""}
                  onChange={(e) => onUpdateSlide({ tagline: e.target.value })}
                  placeholder="Catchy high-converting tagline..."
                  className="text-sm sm:text-base text-center bg-transparent border-b border-transparent hover:border-slate-600/40 focus:border-sky-500 focus:outline-none w-full max-w-xl opacity-80"
                  style={{ color: theme.subtextColor }}
                />
              </div>
            )}

            {/* 2. MARKET SIZING (TAM / SAM / SOM) */}
            {slide.layout === "market" && slide.marketSize && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
                <div
                  className="p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    TAM (Total Addressable)
                  </div>
                  <input
                    type="text"
                    value={slide.marketSize.tam}
                    onChange={(e) =>
                      onUpdateSlide({
                        marketSize: { ...slide.marketSize!, tam: e.target.value },
                      })
                    }
                    className="text-2xl sm:text-3xl font-black font-display bg-transparent focus:outline-none my-2"
                    style={{ color: theme.textColor }}
                  />
                  <textarea
                    rows={2}
                    value={slide.marketSize.tamDesc}
                    onChange={(e) =>
                      onUpdateSlide({
                        marketSize: { ...slide.marketSize!, tamDesc: e.target.value },
                      })
                    }
                    className="text-xs bg-transparent focus:outline-none resize-none"
                    style={{ color: theme.subtextColor }}
                  />
                </div>

                <div
                  className="p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    SAM (Serviceable)
                  </div>
                  <input
                    type="text"
                    value={slide.marketSize.sam}
                    onChange={(e) =>
                      onUpdateSlide({
                        marketSize: { ...slide.marketSize!, sam: e.target.value },
                      })
                    }
                    className="text-2xl sm:text-3xl font-black font-display bg-transparent focus:outline-none my-2"
                    style={{ color: theme.textColor }}
                  />
                  <textarea
                    rows={2}
                    value={slide.marketSize.samDesc}
                    onChange={(e) =>
                      onUpdateSlide({
                        marketSize: { ...slide.marketSize!, samDesc: e.target.value },
                      })
                    }
                    className="text-xs bg-transparent focus:outline-none resize-none"
                    style={{ color: theme.subtextColor }}
                  />
                </div>

                <div
                  className="p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    SOM (Obtainable Wedge)
                  </div>
                  <input
                    type="text"
                    value={slide.marketSize.som}
                    onChange={(e) =>
                      onUpdateSlide({
                        marketSize: { ...slide.marketSize!, som: e.target.value },
                      })
                    }
                    className="text-2xl sm:text-3xl font-black font-display bg-transparent focus:outline-none my-2"
                    style={{ color: theme.textColor }}
                  />
                  <textarea
                    rows={2}
                    value={slide.marketSize.somDesc}
                    onChange={(e) =>
                      onUpdateSlide({
                        marketSize: { ...slide.marketSize!, somDesc: e.target.value },
                      })
                    }
                    className="text-xs bg-transparent focus:outline-none resize-none"
                    style={{ color: theme.subtextColor }}
                  />
                </div>
              </div>
            )}

            {/* 3. TRACTION & CHART LAYOUT */}
            {slide.layout === "traction" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Metric Badges */}
                <div className="md:col-span-5 space-y-3">
                  {(slide.metrics || []).map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className="p-3.5 rounded-xl border flex items-center justify-between"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                    >
                      <div>
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                          className="text-xs font-medium bg-transparent focus:outline-none block"
                          style={{ color: theme.subtextColor }}
                        />
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                          className="text-xl font-bold font-display bg-transparent focus:outline-none mt-0.5"
                          style={{ color: theme.accentColor }}
                        />
                      </div>
                      {m.change && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {m.change}
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddMetric}
                    className="text-xs flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Metric Card
                  </button>
                </div>

                {/* Growth Chart */}
                <div
                  className="md:col-span-7 p-4 rounded-xl border h-52 flex flex-col justify-between"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                >
                  <div className="text-xs font-bold text-slate-400">
                    {slide.chartData?.title || "Revenue / Traction Trajectory"}
                  </div>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          slide.chartData?.data || [
                            { name: "Q1", value: 30 },
                            { name: "Q2", value: 90 },
                            { name: "Q3", value: 240 },
                            { name: "Q4", value: 550 },
                            { name: "Now", value: 850 },
                          ]
                        }
                      >
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.accentColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={theme.accentColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke={theme.subtextColor} fontSize={11} />
                        <YAxis stroke={theme.subtextColor} fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={theme.accentColor}
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorVal)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 4. COMPETITION MATRIX */}
            {slide.layout === "competition" && slide.competitors && (
              <div
                className="overflow-x-auto rounded-xl border"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: theme.border }}>
                      <th className="p-3 font-semibold text-slate-400">Core Capability</th>
                      <th
                        className="p-3 font-bold"
                        style={{ color: theme.accentColor, backgroundColor: theme.badgeBg }}
                      >
                        {slide.competitors.ourName} (Us)
                      </th>
                      {slide.competitors.competitorNames.map((c, i) => (
                        <th key={i} className="p-3 font-medium text-slate-400">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slide.competitors.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b last:border-0"
                        style={{ borderColor: theme.border }}
                      >
                        <td className="p-3 font-medium" style={{ color: theme.textColor }}>
                          {row.feature}
                        </td>
                        <td
                          className="p-3 font-bold"
                          style={{ backgroundColor: theme.badgeBg }}
                        >
                          {row.us === true ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <span className="text-emerald-400">{String(row.us)}</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400">
                          {row.comp1 === true ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : row.comp1 === false ? (
                            <X className="w-4 h-4 text-rose-400 opacity-60" />
                          ) : (
                            row.comp1
                          )}
                        </td>
                        <td className="p-3 text-slate-400">
                          {row.comp2 === true ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : row.comp2 === false ? (
                            <X className="w-4 h-4 text-rose-400 opacity-60" />
                          ) : (
                            row.comp2
                          )}
                        </td>
                        <td className="p-3 text-slate-400">
                          {row.comp3 === true ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : row.comp3 === false ? (
                            <X className="w-4 h-4 text-rose-400 opacity-60" />
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

            {/* 5. TEAM MEMBERS */}
            {slide.layout === "team" && slide.teamMembers && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
                {slide.teamMembers.map((member, mIdx) => (
                  <div
                    key={member.id || mIdx}
                    className="p-5 rounded-2xl border flex flex-col justify-between"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white mb-3 shadow-md">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...slide.teamMembers!];
                          updated[mIdx] = { ...updated[mIdx], name: e.target.value };
                          onUpdateSlide({ teamMembers: updated });
                        }}
                        className="text-base font-bold font-display bg-transparent focus:outline-none block w-full"
                        style={{ color: theme.textColor }}
                      />
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...slide.teamMembers!];
                          updated[mIdx] = { ...updated[mIdx], role: e.target.value };
                          onUpdateSlide({ teamMembers: updated });
                        }}
                        className="text-xs font-semibold bg-transparent focus:outline-none block w-full mt-0.5"
                        style={{ color: theme.accentColor }}
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={member.bio || ""}
                      onChange={(e) => {
                        const updated = [...slide.teamMembers!];
                        updated[mIdx] = { ...updated[mIdx], bio: e.target.value };
                        onUpdateSlide({ teamMembers: updated });
                      }}
                      className="text-xs bg-transparent focus:outline-none resize-none mt-3 opacity-80"
                      style={{ color: theme.subtextColor }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 6. STANDARD BULLET / METRIC CONTENT (Problem, Solution, Product, Business Model, The Ask) */}
            {["problem", "solution", "product", "business-model", "the-ask", "two-column"].includes(
              slide.layout
            ) && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start my-auto">
                {/* Left Points */}
                <div
                  className={`${
                    slide.metrics && slide.metrics.length > 0
                      ? "md:col-span-8"
                      : "md:col-span-12"
                  } space-y-3`}
                >
                  {(slide.contentPoints || []).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(idx, e.target.value)}
                        className="flex-1 text-sm sm:text-base bg-transparent border-b border-transparent group-hover:border-slate-700 focus:border-sky-500 focus:outline-none transition-colors py-0.5"
                        style={{ color: theme.textColor }}
                      />
                      <button
                        onClick={() => handleDeletePoint(idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddPoint}
                    className="text-xs flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold pt-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Point
                  </button>
                </div>

                {/* Right Metrics Cards */}
                {slide.metrics && slide.metrics.length > 0 && (
                  <div className="md:col-span-4 space-y-3">
                    {slide.metrics.map((metric, mIdx) => (
                      <div
                        key={metric.id || mIdx}
                        className="p-4 rounded-xl border flex flex-col justify-between"
                        style={{
                          backgroundColor: theme.cardBg,
                          borderColor: theme.border,
                        }}
                      >
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => handleMetricChange(mIdx, "value", e.target.value)}
                          className="text-2xl font-bold font-display bg-transparent focus:outline-none"
                          style={{ color: theme.accentColor }}
                        />
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => handleMetricChange(mIdx, "label", e.target.value)}
                          className="text-xs font-semibold uppercase tracking-wider bg-transparent focus:outline-none mt-1"
                          style={{ color: theme.textColor }}
                        />
                        {metric.description && (
                          <input
                            type="text"
                            value={metric.description}
                            onChange={(e) =>
                              handleMetricChange(mIdx, "description", e.target.value)
                            }
                            className="text-[11px] bg-transparent focus:outline-none mt-1 opacity-70"
                            style={{ color: theme.subtextColor }}
                          />
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
            className="pt-4 border-t flex items-center justify-between text-[11px]"
            style={{ borderColor: theme.border, color: theme.subtextColor }}
          >
            <span>{companyName} • Confidential Investor Presentation</span>
            <span>
              {slideNumber} / {totalSlides}
            </span>
          </div>
        </div>
      )}

      {/* Speaker Notes Tab */}
      {activeTab === "notes" && (
        <div className="w-full max-w-5xl rounded-2xl bg-[#0d1322] border border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Quote className="w-5 h-5 text-sky-400" />
              Presenter Spoken Script & Notes
            </h3>
            <span className="text-xs text-slate-400">
              Spoken words for a 45-60 second pitch on this slide
            </span>
          </div>
          <textarea
            rows={8}
            value={slide.speakerNotes || ""}
            onChange={(e) => onUpdateSlide({ speakerNotes: e.target.value })}
            placeholder="Write or generate what you will speak out loud when presenting this slide..."
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-sky-500 font-mono resize-y"
          />
        </div>
      )}

      {/* VC Q&A Simulation Tab */}
      {activeTab === "vc-qa" && (
        <div className="w-full max-w-5xl rounded-2xl bg-[#0d1322] border border-slate-800 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Simulated VC Tough Questions & Answer Formula
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tough partner-level questions an investor will ask on this exact slide
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(slide.simulatedInvestorQuestions || [
              {
                question: "What is your primary moat against big tech / incumbents replicating this?",
                suggestedAnswer:
                  "Focus on proprietary workflow data, customer switching cost, and domain-specific integrations rather than generic LLM prompts.",
              },
            ]).map((qa, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
              >
                <div className="text-sm font-semibold text-rose-400 flex items-start gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 font-bold">
                    Q
                  </span>
                  <span>{qa.question}</span>
                </div>
                <div className="text-xs text-slate-300 pl-7 leading-relaxed flex items-start gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    A
                  </span>
                  <span>{qa.suggestedAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
