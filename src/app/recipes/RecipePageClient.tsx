"use client";

import { useState, useCallback, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Plus, ArrowLeft, Settings2, ChevronDown, ChevronUp, Camera } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MealTypeSelector } from "@/components/recipes/MealTypeSelector";
import { SelectedFoodsSummary } from "@/components/recipes/SelectedFoodsSummary";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeDetail } from "@/components/recipes/RecipeDetail";
import { RecipeLoadingSkeleton } from "@/components/recipes/RecipeLoadingSkeleton";
import { RecipePreferencesPanel } from "@/components/recipes/RecipePreferences";
import { GenerationModeSelector } from "@/components/recipes/GenerationModeSelector";
import { RecipeFilters, applyRecipeFilters, type RecipeSortBy } from "@/components/recipes/RecipeFilters";
import { MealPlanView } from "@/components/recipes/MealPlanView";
import type { MealType, Recipe, GenerationMode, RecipePreferences, MealPlanDay, TrafficLight } from "@/types";
import { DEFAULT_PREFERENCES } from "@/types";

function RecipePageInner() {
  const searchParams = useSearchParams();
  const foodsParam = searchParams.get("foods") || "";
  const fromScanner = searchParams.get("from") === "scanner";
  const [foodIds, setFoodIds] = useState<string[]>(
    foodsParam ? foodsParam.split(",").filter(Boolean) : []
  );

  // Generation settings
  const [mode, setMode] = useState<GenerationMode>("recipes");
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [preferences, setPreferences] = useState<RecipePreferences>(DEFAULT_PREFERENCES);
  const [showPreferences, setShowPreferences] = useState(false);

  // Recipes state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [removedRecipeIds, setRemovedRecipeIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Meal plan state
  const [mealPlanDays, setMealPlanDays] = useState<MealPlanDay[]>([]);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  // Result filtering
  const [sortBy, setSortBy] = useState<RecipeSortBy>("newest");
  const [filterTrafficLight, setFilterTrafficLight] = useState<TrafficLight | null>(null);
  const [filterMealType, setFilterMealType] = useState<MealType | null>(null);

  const toggleMealType = useCallback((mt: MealType) => {
    setMealTypes((prev) =>
      prev.includes(mt) ? prev.filter((m) => m !== mt) : [...prev, mt]
    );
  }, []);

  const removeFood = useCallback((id: string) => {
    setFoodIds((prev) => prev.filter((f) => f !== id));
  }, []);

  const removeRecipe = useCallback((id: string) => {
    setRemovedRecipeIds((prev) => new Set([...prev, id]));
  }, []);

  const generateRecipes = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodIds,
          mealTypes: mode === "recipes" ? mealTypes : undefined,
          mode,
          preferences,
          count: 10,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate recipes");

      if (mode === "meal-plan" && data.mealPlan) {
        setMealPlanDays(data.mealPlan.days || []);
      } else if (data.recipes) {
        // APPEND to existing recipes, don't replace
        setRecipes((prev) => [...prev, ...data.recipes]);
      }
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [foodIds, mealTypes, mode, preferences]);

  const regenerateDay = useCallback(async (dayNumber: number) => {
    setRegeneratingDay(dayNumber);
    const day = mealPlanDays.find((d) => d.day === dayNumber);
    if (!day) return;

    const existingMealTitles = mealPlanDays.flatMap((d) => [
      d.lunch?.title, d.dinner?.title
    ]).filter(Boolean) as string[];

    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodIds,
          mode: "meal-plan",
          preferences,
          regenerateDay: { dayNumber, dayName: day.dayName },
          existingMealTitles,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.day) {
        setMealPlanDays((prev) =>
          prev.map((d) => (d.day === dayNumber ? data.day : d))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate day.");
    } finally {
      setRegeneratingDay(null);
    }
  }, [foodIds, mealPlanDays, preferences]);

  const canGenerate =
    foodIds.length > 0 &&
    (mode === "meal-plan" || mealTypes.length > 0);

  const filteredRecipes = useMemo(
    () => applyRecipeFilters(recipes, sortBy, filterTrafficLight, filterMealType, removedRecipeIds),
    [recipes, sortBy, filterTrafficLight, filterMealType, removedRecipeIds]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={fromScanner ? "/scanner" : "/foods"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Recipes</h1>
            <p className="text-sm text-gray-500">AI creates Freshwell-compliant recipes from your ingredients</p>
          </div>
          {fromScanner && (
            <Link
              href="/scanner"
              className="ml-auto flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Back to Photos
            </Link>
          )}
        </div>

        {/* Selected Foods */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Your Ingredients</h2>
          <SelectedFoodsSummary foodIds={foodIds} onRemove={removeFood} />
        </section>

        {/* Mode Selector */}
        <section>
          <GenerationModeSelector mode={mode} onModeChange={setMode} />
        </section>

        {/* Meal Type (recipes mode only) */}
        {mode === "recipes" && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Meal Type</h2>
            <MealTypeSelector selected={mealTypes} onToggle={toggleMealType} />
          </section>
        )}

        {mode === "meal-plan" && (
          <p className="text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            Generates lunch and dinner for 7 days (14 meals total). You can regenerate individual days afterwards.
          </p>
        )}

        {/* Preferences (collapsible) */}
        <section>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Settings2 className="h-4 w-4" />
            Recipe Preferences
            {showPreferences ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showPreferences && (
            <div className="mt-3">
              <RecipePreferencesPanel preferences={preferences} onChange={setPreferences} />
            </div>
          )}
        </section>

        {/* Generate Button */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={generateRecipes}
            disabled={!canGenerate}
            loading={isLoading}
          >
            {isLoading ? (
              mode === "meal-plan" ? "Generating Meal Plan..." : "Generating..."
            ) : hasGenerated && mode === "recipes" ? (
              <><Plus className="h-5 w-5" /> Generate More</>
            ) : (
              <><Sparkles className="h-5 w-5" /> {mode === "meal-plan" ? "Generate Meal Plan" : "Generate 10 Recipes"}</>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <RecipeLoadingSkeleton
            message={mode === "meal-plan"
              ? "Generating your 7-day meal plan (14 meals)..."
              : "Generating 10 recipes in parallel batches..."
            }
          />
        )}

        {/* Meal Plan Results */}
        {mode === "meal-plan" && mealPlanDays.length > 0 && !isLoading && (
          <MealPlanView
            days={mealPlanDays}
            onViewRecipe={setSelectedRecipe}
            onRegenerateDay={regenerateDay}
            regeneratingDay={regeneratingDay}
          />
        )}

        {/* Recipe Results */}
        {mode === "recipes" && recipes.length > 0 && !isLoading && (
          <section className="space-y-4">
            <RecipeFilters
              recipes={filteredRecipes}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterTrafficLight={filterTrafficLight}
              onFilterTrafficLight={setFilterTrafficLight}
              filterMealType={filterMealType}
              onFilterMealType={setFilterMealType}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onRemove={() => removeRecipe(recipe.id)}
                />
              ))}
            </div>
            {filteredRecipes.length === 0 && (
              <p className="text-center text-gray-400 py-8">No recipes match the current filters.</p>
            )}
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
