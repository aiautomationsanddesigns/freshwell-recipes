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

    // STRICT VALIDATION: Remove recipes that use main ingredients not in the user's selection
    const selectedNames = new Set(foods.map((f) => (f as FoodItem).name.toLowerCase()));
    // Also add subcategories and common variants for matching
    foods.forEach((f) => {
      const food = f as FoodItem;
      selectedNames.add(food.name.toLowerCase());
      // Add singular/partial matches: "chicken breast" -> also match "chicken"
      const words = food.name.toLowerCase().split(/\s+/);
      if (words.length > 1) words.forEach((w) => { if (w.length > 3) selectedNames.add(w); });
    });

    const allowedBasics = new Set([
      "salt", "pepper", "black pepper", "white pepper", "sea salt",
      "herbs", "fresh herbs", "dried herbs", "dried herbs & spices", "mixed herbs",
      "spices", "cumin", "paprika", "turmeric", "chilli", "chili", "cayenne", "cinnamon", "nutmeg", "oregano", "thyme", "rosemary", "basil", "parsley", "coriander", "dill", "mint", "bay leaf", "bay leaves",
      "olive oil", "extra virgin olive oil",
      "butter",
      "garlic", "ginger",
      "stock", "stock cubes", "chicken stock", "beef stock", "vegetable stock", "bone broth",
      "vinegar", "apple cider vinegar", "wine vinegar", "balsamic vinegar",
      "water", "boiling water",
      "lemon juice", "lime juice",
      "mustard", "soy sauce", "tamari", "worcestershire sauce",
      "coconut oil",
    ]);

    const validRecipes = recipes.filter((r: Recipe) => {
      const badIngredients = (r.ingredients || []).filter((ing) => {
        const name = (ing.name || "").toLowerCase().trim();
        // Allow basic seasonings/cooking aids
        if (allowedBasics.has(name)) return false;
        // Check each word of the ingredient against allowed basics
        const ingWords = name.split(/\s+/);
        if (ingWords.some((w) => allowedBasics.has(w))) return false;
        // Allow if any selected food name matches (substring)
        for (const sel of selectedNames) {
          if (name.includes(sel) || sel.includes(name)) return false;
        }
        return true; // This ingredient wasn't selected
      });
      // Recipe is valid if no bad main ingredients
      return badIngredients.length === 0;
    });

    // If strict filtering removed too many, fall back to all recipes with a warning
    if (validRecipes.length === 0) {
      return NextResponse.json({
        recipes,
        warning: "Some recipes may include ingredients you didn't select. The AI was asked to only use your ingredients but couldn't generate enough matching recipes."
      });
    }

    return NextResponse.json({ recipes: validRecipes });
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
