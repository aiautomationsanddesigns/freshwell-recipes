import { NextRequest, NextResponse } from "next/server";
import { FOOD_BY_ID } from "@/lib/foods-data";
import { generateRecipeWithAI } from "@/lib/ai-client";
import { buildRecipePrompt } from "@/lib/prompts";
import { generateId } from "@/lib/utils";
import type { MealType, Recipe } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { foodIds, mealTypes } = body as {
      foodIds: string[];
      mealTypes: MealType[];
    };

    if (!foodIds?.length || !mealTypes?.length) {
      return NextResponse.json(
        { error: "Please select at least one food and one meal type." },
        { status: 400 }
      );
    }

    // Look up food items
    const foods = foodIds
      .map((id: string) => FOOD_BY_ID.get(id))
      .filter(Boolean);

    if (foods.length === 0) {
      return NextResponse.json(
        { error: "None of the selected food IDs were recognized." },
        { status: 400 }
      );
    }

    // Build prompt and generate
    const prompt = buildRecipePrompt(foods as any[], mealTypes);
    const rawResponse = await generateRecipeWithAI(prompt);

    // Parse the AI response
    let recipes: Recipe[];
    try {
      // Try direct parse
      const parsed = JSON.parse(rawResponse);
      recipes = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Try to extract JSON from markdown-wrapped response
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0]);
      } else {
        const objMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (objMatch) {
          recipes = [JSON.parse(objMatch[0])];
        } else {
          return NextResponse.json(
            { error: "Failed to parse recipe response. Please try again.", raw: rawResponse },
            { status: 500 }
          );
        }
      }
    }

    // Add IDs to recipes
    recipes = recipes.map((r) => ({
      ...r,
      id: generateId(),
    }));

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("[API] Recipe generation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
