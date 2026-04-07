"use client";

import { ChevronDown, ChevronUp, FilterX } from "lucide-react";
import { useState } from "react";
import { TrafficLightFilter } from "./TrafficLightFilter";
import { CategoryFilter } from "./CategoryFilter";
import { SubcategoryFilter } from "./SubcategoryFilter";
import { SearchInput } from "@/components/ui/SearchInput";
import type { TrafficLight, FoodCategory } from "@/types";

interface FilterBarProps {
  trafficLights: TrafficLight[];
  categories: FoodCategory[];
  subcategories: string[];
  searchQuery: string;
  onToggleTrafficLight: (tl: TrafficLight) => void;
  onToggleCategory: (cat: FoodCategory) => void;
  onToggleSubcategory: (sub: string) => void;
  onSearchChange: (q: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  trafficLights,
  categories,
  subcategories,
  searchQuery,
  onToggleTrafficLight,
  onToggleCategory,
  onToggleSubcategory,
  onSearchChange,
  onClearAll,
  hasActiveFilters,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 space-y-3">
        {/* Top row: search + expand toggle */}
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors md:hidden cursor-pointer"
          >
            Filters
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FilterX className="h-4 w-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className={`space-y-3 ${expanded ? "block" : "hidden md:block"}`}>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Traffic Light</p>
            <TrafficLightFilter active={trafficLights} onToggle={onToggleTrafficLight} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Food Type</p>
            <CategoryFilter active={categories} onToggle={onToggleCategory} />
          </div>
          {categories.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Subcategory</p>
              <SubcategoryFilter
                activeCategories={categories}
                activeSubcategories={subcategories}
                onToggle={onToggleSubcategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
