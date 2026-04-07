"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrafficLight, MealType, Recipe } from "@/types";

export type RecipeSortBy = "newest" | "cook-time" | "name";

interface RecipeFiltersProps {
  recipes: Recipe[];
  sortBy: RecipeSortBy;
  onSortChange: (sort: RecipeSortBy) => void;
  filterTrafficLight: TrafficLight | null;
  onFilterTrafficLight: (tl: TrafficLight | null) => void;
  filterMealType: MealType | null;
  onFilterMealType: (mt: MealType | null) => void;
}

export function RecipeFilters({
  recipes,
  sortBy,
  onSortChange,
  filterTrafficLight,
  onFilterTrafficLight,
  filterMealType,
  onFilterMealType,
}: RecipeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 border border-gray-100">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filter:</span>

      {/* Traffic light filter */}
      <div className="flex gap-1">
        {(["green", "amber", "red"] as TrafficLight[]).map((tl) => (
          <button
            key={tl}
            onClick={() => onFilterTrafficLight(filterTrafficLight === tl ? null : tl)}
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-all cursor-pointer",
              {
                "bg-emerald-500": tl === "green",
                "bg-amber-500": tl === "amber",
                "bg-red-500": tl === "red",
              },
              filterTrafficLight === tl ? "border-gray-900 scale-110" : "border-transparent opacity-50 hover:opacity-100"
            )}
            title={tl}
          />
        ))}
      </div>

      {/* Meal type filter */}
      <div className="flex gap-1">
        {(["breakfast", "lunch", "dinner"] as MealType[]).map((mt) => (
          <button
            key={mt}
            onClick={() => onFilterMealType(filterMealType === mt ? null : mt)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
              filterMealType === mt
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-500 hover:text-gray-700 border border-gray-200"
            )}
          >
            {mt.charAt(0).toUpperCase() + mt.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as RecipeSortBy)}
          className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600 cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="cook-time">Cook Time</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <span className="text-xs text-gray-400">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""}</span>
    </div>
  );
}

export function applyRecipeFilters(
  recipes: Recipe[],
  sortBy: RecipeSortBy,
  filterTl: TrafficLight | null,
  filterMt: MealType | null,
  removedIds: Set<string>
): Recipe[] {
  let filtered = recipes.filter((r) => !removedIds.has(r.id));
  if (filterTl) filtered = filtered.filter((r) => r.overallTrafficLight === filterTl);
  if (filterMt) filtered = filtered.filter((r) => r.mealTypes?.includes(filterMt));

  switch (sortBy) {
    case "cook-time":
      filtered.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
      break;
    case "name":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "newest":
    default:
      break; // Keep insertion order (newest last = appended)
  }

  return filtered;
}
