"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MealTypeSelector } from "@/components/recipes/MealTypeSelector";
import { SelectedFoodsSummary } from "@/components/recipes/SelectedFoodsSummary";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeDetail } from "@/components/recipes/RecipeDetail";
import { RecipeLoadingSkeleton } from "@/components/recipes/RecipeLoadingSkeleton";
import type { MealType, Recipe } from "@/types";

function RecipePageInner() {
  const searchParams = useSearchParams();
  const foodsParam = searchParams.get("foods") || "";
  const [foodIds, setFoodIds] = useState<string[]>(
    foodsParam ? foodsParam.split(",").filter(Boolean) : []
  );
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleMealType = useCallback((mt: MealType) => {
    setMealTypes((prev) =>
      prev.includes(mt) ? prev.filter((m) => m !== mt) : [...prev, mt]
    );
  }, []);

  const removeFood = useCallback((id: string) => {
    setFoodIds((prev) => prev.filter((f) => f !== id));
  }, []);

  const generateRecipes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setRecipes([]);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodIds, mealTypes }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate recipes");
      }
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [foodIds, mealTypes]);

  const canGenerate = foodIds.length > 0 && mealTypes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/foods"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Recipes</h1>
            <p className="text-sm text-gray-500">
              AI will create Freshwell-compliant recipes from your ingredients
            </p>
          </div>
        </div>

        {/* Selected Foods */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Your Ingredients
          </h2>
          <SelectedFoodsSummary foodIds={foodIds} onRemove={removeFood} />
        </section>

        {/* Meal Type Selection */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Meal Type
          </h2>
          <MealTypeSelector selected={mealTypes} onToggle={toggleMealType} />
        </section>

        {/* Generate Button */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={generateRecipes}
            disabled={!canGenerate}
            loading={isLoading}
          >
            <Sparkles className="h-5 w-5" />
            {isLoading ? "Generating..." : "Generate Recipes"}
          </Button>
          {recipes.length > 0 && !isLoading && (
            <Button
              variant="outline"
              size="lg"
              onClick={generateRecipes}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && <RecipeLoadingSkeleton />}

        {/* Results */}
        {recipes.length > 0 && !isLoading && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Recipes ({recipes.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recipe Detail Modal */}
        <RecipeDetail
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      </main>
    </div>
  );
}

export function RecipePageClient() {
  return (
    <Suspense>
      <RecipePageInner />
    </Suspense>
  );
}
