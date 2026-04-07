import type { Metadata } from "next";
import { SavedRecipesClient } from "./SavedRecipesClient";

export const metadata: Metadata = {
  title: "Saved Recipes | Freshwell",
  description: "Your saved Freshwell low carb recipes.",
};

export const dynamic = "force-dynamic";

export default function SavedPage() {
  return <SavedRecipesClient />;
}
