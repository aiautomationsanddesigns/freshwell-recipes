import type { FoodItem, MealType, RecipePreferences } from "@/types";

export function buildRecipePrompt(
  selectedFoods: FoodItem[],
  mealTypes: MealType[],
  preferences: RecipePreferences,
  count: number = 10
): string {
  const greenFoods = selectedFoods.filter((f) => f.trafficLight === "green");
  const amberFoods = selectedFoods.filter((f) => f.trafficLight === "amber");
  const mealTypeStr = mealTypes.join(", ");

  let preferencesSection = "";

  if (preferences.cuisineStyles.length > 0 && !preferences.cuisineStyles.includes("any")) {
    preferencesSection += `\nCUISINE STYLE: Focus on ${preferences.cuisineStyles.join(", ")} cuisine.`;
  }
  if (preferences.cookTime) {
    const timeMap = { quick: "under 15 minutes total", medium: "15-30 minutes total", long: "30+ minutes total" };
    preferencesSection += `\nCOOK TIME: Recipes should take ${timeMap[preferences.cookTime]}.`;
  }
  if (preferences.difficulty) {
    const diffMap = { easy: "simple with few steps and common ingredients", medium: "moderate skill required", advanced: "complex techniques and presentation" };
    preferencesSection += `\nDIFFICULTY: Recipes should be ${diffMap[preferences.difficulty]}.`;
  }
  if (preferences.dietaryFilters.length > 0) {
    const dietRules: string[] = [];
    if (preferences.dietaryFilters.includes("high-protein")) dietRules.push("Prioritise high-protein ingredients (meat, fish, eggs, dairy)");
    if (preferences.dietaryFilters.includes("vegetarian")) dietRules.push("NO meat or fish - use eggs, dairy, vegetables, nuts, and legumes only");
    if (preferences.dietaryFilters.includes("vegan")) dietRules.push("NO animal products at all - use vegetables, nuts, seeds, legumes, and plant oils only");
    if (preferences.dietaryFilters.includes("dairy-free")) dietRules.push("NO dairy products (no butter, cream, cheese, yogurt, milk) - use olive oil/coconut oil instead");
    if (preferences.dietaryFilters.includes("nut-free")) dietRules.push("NO nuts or nut-based ingredients");
    if (preferences.dietaryFilters.includes("gluten-free")) dietRules.push("NO gluten-containing ingredients (no wheat, barley, rye, oats unless certified gluten-free, no soy sauce - use tamari instead)");
    preferencesSection += `\nDIETARY REQUIREMENTS:\n${dietRules.map((r) => `- ${r}`).join("\n")}`;
  }
  if (preferences.trafficLightOnly === "green-only") {
    preferencesSection += `\nSTRICT GREEN ONLY: Use ONLY green-rated ingredients. NO amber or red foods at all. All ingredients must be from the green category.`;
  } else if (preferences.trafficLightOnly === "green-amber") {
    preferencesSection += `\nGREEN + AMBER ONLY: Use green and amber ingredients only. NO red foods. Amber foods can be used freely in this mode.`;
  }

  return `You are a recipe generator for the Freshwell Low Carb program, a UK-based healthy eating system.

FRESHWELL RULES:
- GREEN foods can be eaten freely: meat, fish, eggs, full-fat dairy, above-ground vegetables, nuts, seeds, olive oil, coconut oil, butter
- AMBER foods in moderation: berries, some fruits, root veg in small amounts, legumes, dark chocolate 85%+
- RED foods must be AVOIDED: bread, pasta, rice, potatoes, cereals, sugar, fizzy drinks, fruit juice, seed oils, margarine, processed foods

AVAILABLE INGREDIENTS:
Green (eat freely): ${greenFoods.map((f) => f.name).join(", ") || "None selected"}
Amber (moderation): ${amberFoods.map((f) => f.name).join(", ") || "None selected"}
${preferencesSection}

TASK: Generate exactly ${count} diverse recipes for: ${mealTypeStr}

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
- Make ALL ${count} recipes diverse (different styles, different main ingredients, different cooking methods)
- Tags should include relevant keywords like "quick", "high-protein", "one-pan", "batch-cook", etc.

Return ONLY the JSON array with exactly ${count} recipes.`;
}

export function buildMealPlanPrompt(
  selectedFoods: FoodItem[],
  preferences: RecipePreferences
): string {
  const greenFoods = selectedFoods.filter((f) => f.trafficLight === "green");
  const amberFoods = selectedFoods.filter((f) => f.trafficLight === "amber");

  let preferencesSection = "";
  if (preferences.cuisineStyles.length > 0 && !preferences.cuisineStyles.includes("any")) {
    preferencesSection += `\nCUISINE STYLE: Mix of ${preferences.cuisineStyles.join(", ")} cuisines across the week.`;
  }
  if (preferences.cookTime) {
    const timeMap = { quick: "under 15 minutes total", medium: "15-30 minutes total", long: "30+ minutes total" };
    preferencesSection += `\nCOOK TIME: Most recipes should take ${timeMap[preferences.cookTime]}.`;
  }
  if (preferences.difficulty) {
    const diffMap = { easy: "simple with few steps", medium: "moderate skill", advanced: "complex techniques" };
    preferencesSection += `\nDIFFICULTY: ${diffMap[preferences.difficulty]}.`;
  }
  if (preferences.dietaryFilters.length > 0) {
    const dietRules: string[] = [];
    if (preferences.dietaryFilters.includes("high-protein")) dietRules.push("Prioritise high-protein ingredients");
    if (preferences.dietaryFilters.includes("vegetarian")) dietRules.push("NO meat or fish");
    if (preferences.dietaryFilters.includes("vegan")) dietRules.push("NO animal products");
    if (preferences.dietaryFilters.includes("dairy-free")) dietRules.push("NO dairy");
    if (preferences.dietaryFilters.includes("nut-free")) dietRules.push("NO nuts");
    preferencesSection += `\nDIETARY: ${dietRules.join(", ")}`;
  }

  return `You are a meal plan generator for the Freshwell Low Carb program.

FRESHWELL RULES:
- GREEN foods can be eaten freely: meat, fish, eggs, full-fat dairy, above-ground veg, nuts, seeds, olive oil, coconut oil, butter
- AMBER foods in moderation: berries, some fruits, root veg in small amounts, legumes
- RED foods must be AVOIDED: bread, pasta, rice, potatoes, cereals, sugar, seed oils, processed foods

AVAILABLE INGREDIENTS:
Green: ${greenFoods.map((f) => f.name).join(", ") || "Use any green foods"}
Amber: ${amberFoods.map((f) => f.name).join(", ") || "Use amber foods sparingly"}
${preferencesSection}

TASK: Create a 7-day meal plan with LUNCH and DINNER for each day (14 meals total).

Return ONLY a valid JSON array with no markdown formatting, no code fences:
[
  {
    "day": 1,
    "dayName": "Monday",
    "lunch": {
      "title": "Recipe Name",
      "description": "One sentence",
      "mealTypes": ["lunch"],
      "prepTime": 10,
      "cookTime": 15,
      "servings": 2,
      "overallTrafficLight": "green",
      "ingredients": [{"name": "Ingredient", "quantity": "200", "unit": "g", "trafficLight": "green"}],
      "instructions": ["Step 1", "Step 2"],
      "tags": ["quick"]
    },
    "dinner": {
      "title": "Different Recipe",
      "description": "One sentence",
      "mealTypes": ["dinner"],
      "prepTime": 10,
      "cookTime": 25,
      "servings": 2,
      "overallTrafficLight": "green",
      "ingredients": [{"name": "Ingredient", "quantity": "300", "unit": "g", "trafficLight": "green"}],
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "tags": ["one-pan"]
    }
  }
]

Rules:
- Day names: Monday through Sunday (days 1-7)
- All 14 meals must be DIFFERENT (no repeats)
- Use UK measurements
- Vary cooking methods across the week
- Include diverse ingredients - don't use the same protein every day
- 4-8 ingredients and 3-6 steps per recipe
- NEVER use RED foods

Return ONLY the JSON array with exactly 7 day objects.`;
}

export function buildDayRegenerationPrompt(
  selectedFoods: FoodItem[],
  preferences: RecipePreferences,
  dayName: string,
  existingMeals: string[]
): string {
  const greenFoods = selectedFoods.filter((f) => f.trafficLight === "green");
  const amberFoods = selectedFoods.filter((f) => f.trafficLight === "amber");

  return `You are a meal plan generator for the Freshwell Low Carb program.

FRESHWELL RULES: GREEN (eat freely), AMBER (moderation), RED (avoid - bread, pasta, rice, potatoes, sugar, seed oils).

AVAILABLE INGREDIENTS:
Green: ${greenFoods.map((f) => f.name).join(", ") || "Use any green foods"}
Amber: ${amberFoods.map((f) => f.name).join(", ") || "Use sparingly"}

Generate 1 lunch and 1 dinner for ${dayName}. Make them DIFFERENT from these existing meals in the plan: ${existingMeals.join(", ")}.

Return ONLY valid JSON (no markdown):
{
  "lunch": { "title": "...", "description": "...", "mealTypes": ["lunch"], "prepTime": 10, "cookTime": 15, "servings": 2, "overallTrafficLight": "green", "ingredients": [{"name": "...", "quantity": "...", "unit": "...", "trafficLight": "green"}], "instructions": ["..."], "tags": ["..."] },
  "dinner": { "title": "...", "description": "...", "mealTypes": ["dinner"], "prepTime": 10, "cookTime": 25, "servings": 2, "overallTrafficLight": "green", "ingredients": [{"name": "...", "quantity": "...", "unit": "...", "trafficLight": "green"}], "instructions": ["..."], "tags": ["..."] }
}`;
}
