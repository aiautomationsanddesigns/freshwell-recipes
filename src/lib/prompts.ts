import type { FoodItem, MealType } from "@/types";

export function buildRecipePrompt(
  selectedFoods: FoodItem[],
  mealTypes: MealType[]
): string {
  const greenFoods = selectedFoods.filter((f) => f.trafficLight === "green");
  const amberFoods = selectedFoods.filter((f) => f.trafficLight === "amber");

  const mealTypeStr = mealTypes.join(", ");

  return `You are a recipe generator for the Freshwell Low Carb program, a UK-based healthy eating system.

FRESHWELL RULES:
- GREEN foods can be eaten freely: meat, fish, eggs, full-fat dairy, above-ground vegetables, nuts, seeds, olive oil, coconut oil, butter
- AMBER foods in moderation: berries, some fruits, root veg in small amounts, legumes, dark chocolate 85%+
- RED foods must be AVOIDED: bread, pasta, rice, potatoes, cereals, sugar, fizzy drinks, fruit juice, seed oils, margarine, processed foods

AVAILABLE INGREDIENTS:
Green (eat freely): ${greenFoods.map((f) => f.name).join(", ") || "None selected"}
Amber (moderation): ${amberFoods.map((f) => f.name).join(", ") || "None selected"}

TASK: Generate 3 recipes for: ${mealTypeStr}

You may add basic Freshwell-approved green ingredients (salt, pepper, herbs, spices, olive oil, butter) even if not in the list above.
NEVER use any RED foods (bread, pasta, rice, potatoes, sugar, flour, cereals, seed oils).
Use AMBER foods sparingly and note when they're amber.

Return ONLY a valid JSON array with no markdown formatting, no code fences. Each recipe:
[
  {
    "title": "Recipe Name",
    "description": "One sentence description",
    "mealTypes": [${mealTypes.map((m) => `"${m}"`).join(", ")}],
    "prepTime": 10,
    "cookTime": 20,
    "servings": 2,
    "overallTrafficLight": "green",
    "ingredients": [
      { "name": "Ingredient", "quantity": "200", "unit": "g", "trafficLight": "green" }
    ],
    "instructions": ["Step 1...", "Step 2..."],
    "tags": ["quick", "high-protein"]
  }
]

Rules for the JSON:
- overallTrafficLight: "green" if all ingredients green, "amber" if any amber used
- Use UK measurements (g, ml, tbsp, tsp)
- prepTime and cookTime in minutes (integers)
- Each recipe should be practical, tasty, and achievable for a home cook
- Include 4-8 ingredients per recipe
- Include 3-6 instruction steps per recipe
- Make recipes diverse (don't repeat the same style)

Return ONLY the JSON array.`;
}
