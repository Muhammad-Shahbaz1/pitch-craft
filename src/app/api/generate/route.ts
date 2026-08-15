import { NextRequest, NextResponse } from "next/server";
import { generatePitchDeckWithAI } from "@/lib/gemini";
import { GenerateDeckRequest } from "@/types/pitch";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateDeckRequest = await req.json();

    if (!body.companyName || !body.industry) {
      return NextResponse.json(
        { error: "Company name and industry are required." },
        { status: 400 }
      );
    }

    const deck = await generatePitchDeckWithAI(body);
    return NextResponse.json({ success: true, deck });
  } catch (error: any) {
    console.error("Deck generation API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate pitch deck." },
      { status: 500 }
    );
  }
}
