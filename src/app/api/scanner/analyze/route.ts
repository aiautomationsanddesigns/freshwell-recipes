import { NextRequest, NextResponse } from "next/server";
import { analyzeImageWithAI } from "@/lib/ai-client";
import { FOOD_DATABASE } from "@/lib/foods-data";
import type { ScannedItem } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided." },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    // Analyze with AI
    const rawResponse = await analyzeImageWithAI(base64, mimeType);

    // Parse identified items
    let identifiedItems: Array<{ name: string; confidence: number }>;
    try {
      identifiedItems = JSON.parse(rawResponse);
      if (!Array.isArray(identifiedItems)) {
        identifiedItems = [];
      }
    } catch {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        identifiedItems = JSON.parse(jsonMatch[0]);
      } else {
        identifiedItems = [];
      }
    }

    // Match against food database
    const scannedItems: ScannedItem[] = identifiedItems.map((item) => {
      const matchedFood = findBestMatch(item.name);
      return {
        name: item.name,
        confidence: item.confidence,
        matchedFoodId: matchedFood?.id,
        trafficLight: matchedFood?.trafficLight,
      };
    });

    return NextResponse.json({ items: scannedItems });
  } catch (error) {
    console.error("[API] Scanner analysis failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze image." },
      { status: 500 }
    );
  }
}

function findBestMatch(name: string) {
  const lower = name.toLowerCase();

  // Exact match on food name
  let match = FOOD_DATABASE.find(
    (f) => f.name.toLowerCase() === lower
  );
  if (match) return match;

  // Substring match: food name contains AI name or vice versa
  match = FOOD_DATABASE.find(
    (f) =>
      f.name.toLowerCase().includes(lower) ||
      lower.includes(f.name.toLowerCase())
  );
  if (match) return match;

  // Keyword matching: split AI name into words, find best overlap
  const words = lower.split(/\s+/);
  let bestMatch = null;
  let bestScore = 0;

  for (const food of FOOD_DATABASE) {
    const foodWords = food.name.toLowerCase().split(/\s+/);
    const score = words.filter((w) =>
      foodWords.some((fw) => fw.includes(w) || w.includes(fw))
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = food;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}
