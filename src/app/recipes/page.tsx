import type { Metadata } from "next";
import { RecipePageClient } from "./RecipePageClient";

export const metadata: Metadata = {
  title: "Generate Recipes | Freshwell",
  description: "Generate Freshwell-compliant low carb recipes with AI based on your selected ingredients.",
};

export default function RecipesPage() {
  return <RecipePageClient />;
}
