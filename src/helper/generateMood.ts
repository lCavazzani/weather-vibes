// src/lib/generateMood.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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

export type MoodRequest = {
  location: string;
  weather: string;
  temperature?: number;
  lat: number;
  date: string;
};

export async function generateMood(req: MoodRequest) {
  const { location, weather, temperature, lat, date } = req;
  const season = getSeason(lat, date);

  const prompt = `
You're an assistant generating a "feeling" based on environment info.
The "feeling" should be a full scenario related to that location and how someone might feel.
The "summaryFeeling" should be a brief summary of the overall feeling.
"oneWordFeeling" should be just one or two simple words describing the person's feeling.
The "feelingColor" should be a hex color code representing the feeling.
youtubeSearchQuery should be a search query suitable for YouTube to find a relevant song.

Location: ${location}
Weather: ${weather}, ${temperature}°C
Date: ${date}
Season: ${season}

Return JSON with exactly:
{
  "feeling": "...",
  "summaryFeeling": "...",
  "oneWordFeeling": "...",
  "feelingColor": "#...",
  "song": {
    "title": "...",
    "artist": "...",
    "youtubeSearchQuery": "..."
  },
  "prompt": "..."
}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const responseText = await result.response.text();

  // find JSON block (your robust extraction code)…
  const matches = responseText.match(/\{[\s\S]+\}/g) || [];
  const jsonString = matches.pop() || "{}";

  try {
    return JSON.parse(jsonString);
  } catch {
    console.error("Failed to parse AI JSON:", responseText);
    throw new Error("AI parse error");
  }
}
