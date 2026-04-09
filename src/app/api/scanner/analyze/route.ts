import { NextRequest, NextResponse } from "next/server";
import { analyzeImageWithAI } from "@/lib/ai-client";
import { FOOD_DATABASE } from "@/lib/foods-data";
import type { ScannedItem, FoodItem } from "@/types";

// Common stop words that shouldn't trigger a match on their own
const STOP_WORDS = new Set([
  "in", "the", "and", "or", "of", "with", "a", "an",
  "fresh", "raw", "cooked", "sliced", "diced", "chopped",
  "fat", "full", "low", "high", "free", "range", "organic",
  "tinned", "canned", "packet", "bag", "pack",
  "oil", "sauce", "butter", // 'oil' is too generic - "olive oil" shouldn't match "olives"
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const rawResponse = await analyzeImageWithAI(base64, mimeType);

    let identifiedItems: Array<{ name: string; confidence: number }>;
    try {
      identifiedItems = JSON.parse(rawResponse);
      if (!Array.isArray(identifiedItems)) identifiedItems = [];
    } catch {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      identifiedItems = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

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

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenise(s: string): string[] {
  return normalise(s).split(" ").filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function findBestMatch(name: string): FoodItem | null {
  const lower = normalise(name);
  const inputTokens = tokenise(name);

  // 1. Exact name match (highest priority)
  const exact = FOOD_DATABASE.find((f) => normalise(f.name) === lower);
  if (exact) return exact;

  // 2. Exact match on any significant word (e.g. "beef" matches "Beef Steak")
  // But only if the input is a single strong word
  if (inputTokens.length === 1) {
    const singleWord = inputTokens[0];
    // Find foods where the FIRST significant word matches
    const wordMatch = FOOD_DATABASE.find((f) => {
      const foodTokens = tokenise(f.name);
      return foodTokens.includes(singleWord) || foodTokens[0] === singleWord;
    });
    if (wordMatch) return wordMatch;
  }

  // 3. Token overlap scoring - require at least 50% of input tokens to match
  let bestMatch: FoodItem | null = null;
  let bestScore = 0;

  for (const food of FOOD_DATABASE) {
    const foodTokens = tokenise(food.name);
    if (foodTokens.length === 0) continue;

    // Count exact token matches (no substring/prefix tricks)
    let matches = 0;
    for (const inputToken of inputTokens) {
      if (foodTokens.includes(inputToken)) matches++;
    }

    // Require: at least 1 match AND at least 50% of input tokens to match
    const inputMatchRatio = inputTokens.length > 0 ? matches / inputTokens.length : 0;
    if (matches === 0 || inputMatchRatio < 0.5) continue;

    // Score: matches weighted by food token count (prefer more specific foods)
    const foodMatchRatio = matches / foodTokens.length;
    const score = matches + inputMatchRatio + foodMatchRatio;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = food;
    }
  }

  // Only return a match if we have a confident score
  return bestScore >= 1.5 ? bestMatch : null;
}
