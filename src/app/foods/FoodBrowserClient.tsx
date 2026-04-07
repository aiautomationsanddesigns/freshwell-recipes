"use client";

import { Suspense, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { FOOD_DATABASE } from "@/lib/foods-data";
import { filterFoods, cn } from "@/lib/utils";
import { useFilters } from "@/hooks/useFilters";
import { useFoodSelection } from "@/hooks/useFoodSelection";
import { useFavouriteFoods } from "@/hooks/useFavouriteFoods";
import { FilterBar } from "@/components/foods/FilterBar";
import { FoodGrid } from "@/components/foods/FoodGrid";
import { SelectionBar } from "@/components/foods/SelectionBar";

function FoodBrowserInner() {
  const {
    filters,
    toggleTrafficLight,
    toggleCategory,
    toggleSubcategory,
    setSearchQuery,
    clearAll,
    hasActiveFilters,
  } = useFilters();

  const { selectedFoods, toggleFood, clearSelection, selectionCount } = useFoodSelection();
  const { favourites, toggleFavourite, count: favCount } = useFavouriteFoods();
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  const filteredFoods = useMemo(() => {
    let foods = filterFoods(FOOD_DATABASE, filters);
    if (showFavouritesOnly) {
      foods = foods.filter((f) => favourites.has(f.id));
    }
    return foods;
  }, [filters, showFavouritesOnly, favourites]);

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterBar
        trafficLights={filters.trafficLights}
        categories={filters.categories}
        subcategories={filters.subcategories}
        searchQuery={filters.searchQuery}
        onToggleTrafficLight={toggleTrafficLight}
        onToggleCategory={toggleCategory}
        onToggleSubcategory={toggleSubcategory}
        onSearchChange={setSearchQuery}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Foods</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {filteredFoods.length} food{filteredFoods.length !== 1 ? "s" : ""}
              {showFavouritesOnly ? " (favourites)" : hasActiveFilters ? " (filtered)" : ""}
            </p>
          </div>
          {/* Favourites toggle */}
          <button
            onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium border-2 transition-all cursor-pointer",
              showFavouritesOnly
                ? "border-red-300 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            )}
          >
            <Heart className={cn("h-4 w-4", showFavouritesOnly && "fill-current")} />
            Favourites
            {favCount > 0 && (
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-xs",
                showFavouritesOnly ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-500"
              )}>
                {favCount}
              </span>
            )}
          </button>
        </div>

        <FoodGrid
          foods={filteredFoods}
          selectedFoods={selectedFoods}
          onToggleFood={toggleFood}
          favourites={favourites}
          onToggleFavourite={toggleFavourite}
        />
      </main>

      <SelectionBar
        count={selectionCount}
        selectedIds={selectedFoods}
        onClear={clearSelection}
      />
    </div>
  );
}

export function FoodBrowserClient() {
  return (
    <Suspense>
      <FoodBrowserInner />
    </Suspense>
  );
}
