import { NextRequest, NextResponse } from "next/server";
import { processAIAssist } from "@/lib/gemini";
import { AIAssistRequest } from "@/types/pitch";

export async function POST(req: NextRequest) {
  try {
    const body: AIAssistRequest = await req.json();

    if (!body.action || !body.slide) {
      return NextResponse.json(
        { error: "Action and slide payload are required." },
        { status: 400 }
      );
    }

    const result = await processAIAssist(body);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("AI Assist API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process AI assist." },
      { status: 500 }
    );
  }
}
