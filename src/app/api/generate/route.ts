// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateMood } from "@/helper/generateMood";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mood = await generateMood(body);
    return NextResponse.json(mood);
  } catch (err: any) {
    console.error("Generate API error:", err);
    return NextResponse.json(
      { error: err.message || "Generation failed" },
      { status: 500 }
    );
  }
}
