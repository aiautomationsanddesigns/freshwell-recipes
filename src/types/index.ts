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
