export type TrafficLight = "green" | "amber" | "red";

export type FoodCategory =
  | "meat"
  | "fish"
  | "dairy"
  | "eggs"
  | "vegetables"
  | "fruit"
  | "nuts-seeds"
  | "fats-oils"
  | "grains-starch"
  | "drinks"
  | "condiments"
  | "legumes"
  | "sweets-snacks"
  | "processed";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  subcategory: string;
  trafficLight: TrafficLight;
  description?: string;
  servingNote?: string;
}

export type MealType = "breakfast" | "lunch" | "dinner";

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  foodId?: string;
  trafficLight?: TrafficLight;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  mealTypes: MealType[];
  prepTime: number;
  cookTime: number;
  servings: number;
  overallTrafficLight: TrafficLight;
  ingredients: RecipeIngredient[];
  instructions: string[];
  tags?: string[];
}

export interface ScannedItem {
  name: string;
  confidence: number;
  matchedFoodId?: string;
  trafficLight?: TrafficLight;
}

export interface ScanResult {
  items: ScannedItem[];
  rawResponse: string;
}

export interface FilterState {
  trafficLights: TrafficLight[];
  categories: FoodCategory[];
  subcategories: string[];
  searchQuery: string;
}

// =====================================================
// Recipe Generation Preferences
// =====================================================

export type CuisineStyle =
  | "british"
  | "mediterranean"
  | "asian"
  | "mexican"
  | "indian"
  | "american"
  | "middle-eastern"
  | "any";

export type CookTimeRange = "quick" | "medium" | "long";

export type DifficultyLevel = "easy" | "medium" | "advanced";

export type DietaryFilter =
  | "high-protein"
  | "vegetarian"
  | "vegan"
  | "dairy-free"
  | "nut-free";

export interface RecipePreferences {
  cuisineStyles: CuisineStyle[];
  cookTime: CookTimeRange | null;
  difficulty: DifficultyLevel | null;
  dietaryFilters: DietaryFilter[];
}

export type GenerationMode = "recipes" | "meal-plan";

export interface MealPlanDay {
  day: number;
  dayName: string;
  lunch: Recipe | null;
  dinner: Recipe | null;
}

export interface MealPlan {
  id: string;
  name: string;
  startDate?: string;
  days: MealPlanDay[];
  createdAt: string;
}

// =====================================================
// Saved & Shared (Supabase)
// =====================================================

export interface SavedRecipe {
  id: string;
  user_id: string;
  recipe_data: Recipe;
  created_at: string;
}

export interface SharedRecipe {
  id: string;
  share_code: string;
  recipe_data: Recipe;
  created_by: string | null;
  created_at: string;
}

// =====================================================
// Labels
// =====================================================

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  meat: "Meat",
  fish: "Fish & Seafood",
  dairy: "Dairy",
  eggs: "Eggs",
  vegetables: "Vegetables",
  fruit: "Fruit",
  "nuts-seeds": "Nuts & Seeds",
  "fats-oils": "Fats & Oils",
  "grains-starch": "Grains & Starch",
  drinks: "Drinks",
  condiments: "Condiments",
  legumes: "Legumes",
  "sweets-snacks": "Sweets & Snacks",
  processed: "Processed Foods",
};

export const TRAFFIC_LIGHT_LABELS: Record<TrafficLight, string> = {
  green: "Eat Freely",
  amber: "In Moderation",
  red: "Avoid",
};

export const CUISINE_LABELS: Record<CuisineStyle, string> = {
  british: "British",
  mediterranean: "Mediterranean",
  asian: "Asian",
  mexican: "Mexican",
  indian: "Indian",
  american: "American",
  "middle-eastern": "Middle Eastern",
  any: "Any Style",
};

export const COOK_TIME_LABELS: Record<CookTimeRange, string> = {
  quick: "Quick (<15 min)",
  medium: "Medium (15-30 min)",
  long: "Longer (30+ min)",
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  advanced: "Advanced",
};

export const DIETARY_LABELS: Record<DietaryFilter, string> = {
  "high-protein": "High Protein",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "dairy-free": "Dairy Free",
  "nut-free": "Nut Free",
};

export const DEFAULT_PREFERENCES: RecipePreferences = {
  cuisineStyles: [],
  cookTime: null,
  difficulty: null,
  dietaryFilters: [],
};
