import { createClient } from "@supabase/supabase-js";
import { PitchDeck } from "@/types/pitch";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveDeckToSupabase(deck: PitchDeck, userId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")) {
      // Supabase credentials not set yet; local storage will be used
      return { success: true };
    }

    const { error } = await supabase
      .from("pitch_decks")
      .upsert({
        id: deck.id,
        title: deck.title,
        company_name: deck.companyName,
        tagline: deck.tagline,
        industry: deck.industry,
        target_audience: deck.targetAudience,
        funding_goal: deck.fundingGoal,
        theme_id: deck.themeId,
        slides: deck.slides,
        created_at: new Date(deck.createdAt).toISOString(),
        updated_at: new Date(deck.updatedAt).toISOString(),
        user_id: userId || null,
      });

    if (error) {
      console.error("Supabase upsert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase sync error:", err);
    return { success: false, error: err.message };
  }
}

export async function fetchUserDecksFromSupabase(userId: string): Promise<PitchDeck[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")) {
      return [];
    }

    const { data, error } = await supabase
      .from("pitch_decks")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      companyName: d.company_name,
      tagline: d.tagline,
      industry: d.industry,
      targetAudience: d.target_audience,
      fundingGoal: d.funding_goal,
      themeId: d.theme_id,
      slides: d.slides,
      createdAt: new Date(d.created_at).getTime(),
      updatedAt: new Date(d.updated_at).getTime(),
      authorId: d.user_id,
    }));
  } catch (e) {
    console.error("Failed to fetch decks from Supabase:", e);
    return [];
  }
}
