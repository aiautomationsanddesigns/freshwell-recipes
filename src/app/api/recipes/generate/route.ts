import { NextRequest, NextResponse } from "next/server";
import { FOOD_BY_ID } from "@/lib/foods-data";
import { generateRecipeWithAI } from "@/lib/ai-client";
import { buildRecipePrompt, buildMealPlanPrompt, buildDayRegenerationPrompt } from "@/lib/prompts";
import { generateId } from "@/lib/utils";
import type { MealType, Recipe, RecipePreferences, GenerationMode, MealPlanDay, FoodItem } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      foodIds,
      mealTypes,
      mode = "recipes",
      preferences,
      count = 10,
      regenerateDay,
      existingMealTitles,
    } = body as {
      foodIds: string[];
      mealTypes?: MealType[];
      mode?: GenerationMode;
      preferences?: RecipePreferences;
      count?: number;
      regenerateDay?: { dayNumber: number; dayName: string };
      existingMealTitles?: string[];
    };

    if (!foodIds?.length) {
      return NextResponse.json(
        { error: "Please select at least one food." },
        { status: 400 }
      );
    }

    const foods = foodIds
      .map((id: string) => FOOD_BY_ID.get(id))
      .filter(Boolean) as FoodItem[];

    if (foods.length === 0) {
      return NextResponse.json(
        { error: "None of the selected food IDs were recognized." },
        { status: 400 }
      );
    }

    const prefs: RecipePreferences = preferences || {
      cuisineStyles: [],
      cookTime: null,
      difficulty: null,
      dietaryFilters: [],
      trafficLightOnly: "all" as const,
    };

    // Regenerate a single day in a meal plan
    if (regenerateDay) {
      const prompt = buildDayRegenerationPrompt(
        foods,
        prefs,
        regenerateDay.dayName,
        existingMealTitles || []
      );
      const rawResponse = await generateRecipeWithAI(prompt, 4096);
      const parsed = parseJSON(rawResponse);
      if (parsed && parsed.lunch && parsed.dinner) {
        parsed.lunch.id = generateId();
        parsed.dinner.id = generateId();
        return NextResponse.json({
          day: {
            day: regenerateDay.dayNumber,
            dayName: regenerateDay.dayName,
            lunch: parsed.lunch,
            dinner: parsed.dinner,
          },
        });
      }
      return NextResponse.json(
        { error: "Failed to parse day regeneration response." },
        { status: 500 }
      );
    }

    // Meal plan mode
    if (mode === "meal-plan") {
      const prompt = buildMealPlanPrompt(foods, prefs);
      const rawResponse = await generateRecipeWithAI(prompt, 16384);
      let days: MealPlanDay[];
      try {
        const parsed = parseJSONArray(rawResponse);
        days = parsed.map((d: MealPlanDay) => ({
          ...d,
          lunch: d.lunch ? { ...d.lunch, id: generateId() } : null,
          dinner: d.dinner ? { ...d.dinner, id: generateId() } : null,
        }));
      } catch {
        return NextResponse.json(
          { error: "Failed to parse meal plan response. Please try again." },
          { status: 500 }
        );
      }
      return NextResponse.json({ mealPlan: { days } });
    }

    // Standard recipes mode
    if (!mealTypes?.length) {
      return NextResponse.json(
        { error: "Please select at least one meal type." },
        { status: 400 }
      );
    }

    // Generate in 2 parallel batches of 5 for speed
    const batchSize = Math.ceil(count / 2);
    const batch1Count = batchSize;
    const batch2Count = count - batchSize;

    const [raw1, raw2] = await Promise.all([
      generateRecipeWithAI(buildRecipePrompt(foods, mealTypes, prefs, batch1Count), 8192),
      generateRecipeWithAI(buildRecipePrompt(foods, mealTypes, prefs, batch2Count), 8192),
    ]);

    let recipes: Recipe[] = [];
    try {
      const parsed1 = parseJSONArray(raw1);
      const parsed2 = parseJSONArray(raw2);
      recipes = [...parsed1, ...parsed2].map((r: Recipe) => ({ ...r, id: generateId() }));
    } catch {
      // If one batch fails, try to use the other
      try {
        recipes = parseJSONArray(raw1).map((r: Recipe) => ({ ...r, id: generateId() }));
      } catch {
        try {
          recipes = parseJSONArray(raw2).map((r: Recipe) => ({ ...r, id: generateId() }));
        } catch {
          return NextResponse.json(
            { error: "Failed to parse recipe response. Please try again." },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("[API] Recipe generation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJSON(raw: string): Record<string, any> | null {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJSONArray(raw: string): any[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) {
      return [JSON.parse(objMatch[0])];
    }
    throw new Error("Could not extract JSON from response");
  }
}
