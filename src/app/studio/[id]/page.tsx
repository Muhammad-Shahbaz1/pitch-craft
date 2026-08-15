"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PitchDeck, Slide, SlideLayout } from "@/types/pitch";
import { getDeckById, saveDeck } from "@/lib/storage";
import { DECK_THEMES, STARTER_TEMPLATES } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { StudioToolbar } from "@/components/studio/StudioToolbar";
import { SlideSidebar } from "@/components/studio/SlideSidebar";
import { SlideCanvas } from "@/components/studio/SlideCanvas";
import { AICopilotDrawer } from "@/components/studio/AICopilotDrawer";
import { Loader2 } from "lucide-react";

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<PitchDeck | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!deckId) return;
    const found = getDeckById(deckId);
    if (found) {
      setDeck(found);
    } else {
      // Fallback to starter template
      const fallback = STARTER_TEMPLATES[0];
      setDeck(fallback);
    }
    setLoading(false);
  }, [deckId]);

  if (loading || !deck) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#070b14] text-slate-300">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          <span className="font-semibold text-sm">Loading Pitch Studio...</span>
        </div>
      </div>
    );
  }

  const activeSlide = deck.slides[activeSlideIndex] || deck.slides[0];
  const theme = DECK_THEMES[deck.themeId] || DECK_THEMES.midnight;

  // Deck Update Handler
  const handleUpdateDeck = (updated: Partial<PitchDeck>) => {
    const newDeck = { ...deck, ...updated, updatedAt: Date.now() };
    setDeck(newDeck);
    saveDeck(newDeck);
  };

  // Slide Update Handler
  const handleUpdateActiveSlide = (updated: Partial<Slide>) => {
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = {
      ...updatedSlides[activeSlideIndex],
      ...updated,
    };
    handleUpdateDeck({ slides: updatedSlides });
  };

  // Add Slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      layout: "two-column",
      title: "New Key Section",
      subtitle: "Add description or core takeaway",
      contentPoints: ["Key takeaway point 1", "Key takeaway point 2"],
    };
    const newSlides = [...deck.slides, newSlide];
    handleUpdateDeck({ slides: newSlides });
    setActiveSlideIndex(newSlides.length - 1);
  };

  // Duplicate Slide
  const handleDuplicateSlide = (index: number) => {
    const target = deck.slides[index];
    const cloned: Slide = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`,
    };
    const newSlides = [...deck.slides];
    newSlides.splice(index + 1, 0, cloned);
    handleUpdateDeck({ slides: newSlides });
    setActiveSlideIndex(index + 1);
  };

  // Delete Slide
  const handleDeleteSlide = (index: number) => {
    if (deck.slides.length <= 1) {
      alert("A pitch deck must have at least one slide.");
      return;
    }
    const newSlides = deck.slides.filter((_, i) => i !== index);
    handleUpdateDeck({ slides: newSlides });
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  // Move Slide
  const handleMoveSlide = (from: number, to: number) => {
    const newSlides = [...deck.slides];
    const [moved] = newSlides.splice(from, 1);
    newSlides.splice(to, 0, moved);
    handleUpdateDeck({ slides: newSlides });
    setActiveSlideIndex(to);
  };

  // Change Slide Layout
  const handleChangeLayout = (layout: SlideLayout) => {
    handleUpdateActiveSlide({ layout });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#070b14] text-slate-100">
      {/* Top Studio Toolbar */}
      <StudioToolbar
        deck={deck}
        onUpdateDeck={handleUpdateDeck}
        activeSlideLayout={activeSlide.layout}
        onChangeLayout={handleChangeLayout}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
      />

      {/* Main Studio Body: Sidebar + Canvas + Copilot */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Slide Sidebar */}
        <SlideSidebar
          slides={deck.slides}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={(idx) => setActiveSlideIndex(idx)}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlide={handleMoveSlide}
          theme={theme}
        />

        {/* Center Main Slide Canvas */}
        <SlideCanvas
          slide={activeSlide}
          theme={theme}
          companyName={deck.companyName}
          onUpdateSlide={handleUpdateActiveSlide}
          slideNumber={activeSlideIndex + 1}
          totalSlides={deck.slides.length}
        />

        {/* Right AI Copilot Drawer */}
        <AICopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          slide={activeSlide}
          deck={deck}
          onUpdateSlide={handleUpdateActiveSlide}
        />
      </div>
    </div>
  );
}
