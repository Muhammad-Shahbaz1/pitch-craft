import { PitchDeck } from "@/types/pitch";
import { STARTER_TEMPLATES } from "./constants";

const STORAGE_KEY = "pitchcraft_decks_v1";

export function getSavedDecks(): PitchDeck[] {
  if (typeof window === "undefined") return STARTER_TEMPLATES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_TEMPLATES));
      return STARTER_TEMPLATES;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_TEMPLATES));
      return STARTER_TEMPLATES;
    }
    return parsed;
  } catch (e) {
    console.error("Error reading saved decks", e);
    return STARTER_TEMPLATES;
  }
}

export function getDeckById(id: string): PitchDeck | null {
  const decks = getSavedDecks();
  return decks.find((d) => d.id === id) || null;
}

export function saveDeck(deck: PitchDeck): void {
  if (typeof window === "undefined") return;
  try {
    const decks = getSavedDecks();
    const index = decks.findIndex((d) => d.id === deck.id);
    const updatedDeck = { ...deck, updatedAt: Date.now() };

    let newDecks: PitchDeck[];
    if (index >= 0) {
      newDecks = [...decks];
      newDecks[index] = updatedDeck;
    } else {
      newDecks = [updatedDeck, ...decks];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDecks));
  } catch (e) {
    console.error("Error saving deck", e);
  }
}

export function deleteDeck(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const decks = getSavedDecks();
    const filtered = decks.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Error deleting deck", e);
  }
}

export function duplicateDeck(id: string): PitchDeck | null {
  const original = getDeckById(id);
  if (!original) return null;
  const copy: PitchDeck = {
    ...original,
    id: `deck-${Date.now().toString(36)}`,
    title: `${original.title} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: original.slides.map((s, idx) => ({
      ...s,
      id: `slide-copy-${idx}-${Date.now().toString(36)}`,
    })),
  };
  saveDeck(copy);
  return copy;
}
