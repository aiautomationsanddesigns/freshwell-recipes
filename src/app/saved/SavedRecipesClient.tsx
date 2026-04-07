"use client";

import { useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeDetail } from "@/components/recipes/RecipeDetail";
import { Spinner } from "@/components/ui/Spinner";
import type { Recipe } from "@/types";

export function SavedRecipesClient() {
  const { user, loading: authLoading } = useAuth();
  const { savedRecipes, loading, unsaveRecipe } = useSavedRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to see saved recipes</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Create an account or sign in to save your favourite recipes and access them anytime.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Recipes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {savedRecipes.length} recipe{savedRecipes.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" className="text-emerald-600" />
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Heart className="mx-auto h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No saved recipes yet</p>
            <Link
              href="/foods"
              className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium hover:underline"
            >
              Browse foods and generate recipes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedRecipes.map((saved) => (
              <RecipeCard
                key={saved.id}
                recipe={saved.recipe_data}
                onClick={() => setSelectedRecipe(saved.recipe_data)}
                onRemove={() => unsaveRecipe(saved.recipe_data.id)}
              />
            ))}
          </div>
        )}

        <RecipeDetail
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      </main>
    </div>
  );
}
