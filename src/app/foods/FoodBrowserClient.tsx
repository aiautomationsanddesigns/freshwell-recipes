"use client";

import { Suspense, useMemo } from "react";
import { FOOD_DATABASE } from "@/lib/foods-data";
import { filterFoods } from "@/lib/utils";
import { useFilters } from "@/hooks/useFilters";
import { useFoodSelection } from "@/hooks/useFoodSelection";
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

  const filteredFoods = useMemo(
    () => filterFoods(FOOD_DATABASE, filters),
    [filters]
  );

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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Foods</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredFoods.length} food{filteredFoods.length !== 1 ? "s" : ""} found
              {hasActiveFilters ? " (filtered)" : ""}
            </p>
          </div>
        </div>

        <FoodGrid
          foods={filteredFoods}
          selectedFoods={selectedFoods}
          onToggleFood={toggleFood}
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
