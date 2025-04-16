import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

function getSeason(lat: number, dateStr: string) {
  const month = new Date(dateStr).getUTCMonth() + 1;
  const southern = lat < 0;
  if (southern) {
    if (month <= 2 || month === 12) return "Summer";
    if (month <= 5) return "Autumn";
    if (month <= 8) return "Winter";
    return "Spring";
  } else {
    if (month <= 2 || month === 12) return "Winter";
    if (month <= 5) return "Spring";
    if (month <= 8) return "Summer";
    return "Autumn";
  }
}

export async function POST(req: NextRequest) {
  const { location, weather, temperature, lat, date } = await req.json();
  const season = getSeason(lat, date);

  const prompt = `
You're an assistant generating a "mood object" based on environment info. 
The "mood" should be a full scenarios related to that location and mood. 
"shortMood" just one or two words describing the person feelings

Location: ${location}
Weather: ${weather}, ${temperature}°C
Date: ${date}
Season: ${season}

Return JSON with:
{
  "mood": "...",
  shortMood": "...",
  "moodColor": "#...",
  "song": {
    "title": "...",
    "artist": "...",
    "youtubeLink": "..."
  },
  "image_prompt": "..."
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
    const parsed = JSON.parse(jsonMatch?.[0] || "{}");

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Gemini failed" }, { status: 500 });
  }
}
