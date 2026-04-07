"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";
import type { Recipe } from "@/types";

export function useSavedRecipes() {
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<Array<{ id: string; recipe_data: Recipe; created_at: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  // Fetch saved recipes
  const fetchSaved = useCallback(async () => {
    if (!user) {
      setSavedRecipes([]);
      setSavedIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_recipes")
        .select("id, recipe_data, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSavedRecipes(data || []);
      setSavedIds(new Set((data || []).map((r: { recipe_data: Recipe }) => r.recipe_data.id)));
    } catch (err) {
      console.error("Failed to fetch saved recipes:", err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const saveRecipe = useCallback(async (recipe: Recipe) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from("saved_recipes")
        .insert({ user_id: user.id, recipe_data: recipe });
      if (error) throw error;
      setSavedIds((prev) => new Set([...prev, recipe.id]));
      await fetchSaved();
      return true;
    } catch (err) {
      console.error("Failed to save recipe:", err);
      return false;
    }
  }, [user, supabase, fetchSaved]);

  const unsaveRecipe = useCallback(async (recipeId: string) => {
    if (!user) return false;
    try {
      // Find the saved_recipes row by matching the recipe id inside recipe_data
      const row = savedRecipes.find((r) => r.recipe_data.id === recipeId);
      if (!row) return false;
      const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .eq("id", row.id);
      if (error) throw error;
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(recipeId);
        return next;
      });
      await fetchSaved();
      return true;
    } catch (err) {
      console.error("Failed to unsave recipe:", err);
      return false;
    }
  }, [user, supabase, savedRecipes, fetchSaved]);

  const isRecipeSaved = useCallback(
    (recipeId: string) => savedIds.has(recipeId),
    [savedIds]
  );

  return { savedRecipes, loading, saveRecipe, unsaveRecipe, isRecipeSaved, refetch: fetchSaved };
}
