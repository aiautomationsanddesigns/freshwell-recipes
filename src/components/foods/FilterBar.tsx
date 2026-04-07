"use client";

import { ChevronDown, ChevronUp, FilterX, SlidersHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeCount = trafficLights.length + categories.length + subcategories.length + (searchQuery ? 1 : 0);

  // Close on click outside
  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

  return (
    <div ref={panelRef} className="sticky top-16 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5">
        {/* Single row: search + filters button + clear */}
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                {activeCount}
              </span>
            )}
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="rounded-xl p-2 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              title="Clear all filters"
            >
              <FilterX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Compact filter dropdown - inline chips, not large sections */}
      {expanded && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30 max-h-[50vh] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 space-y-2.5">
            {/* Traffic light - inline row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-16 flex-shrink-0">Light</span>
              <TrafficLightFilter active={trafficLights} onToggle={onToggleTrafficLight} />
            </div>
            {/* Category - inline row */}
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-16 flex-shrink-0 pt-2">Type</span>
              <div className="flex-1">
                <CategoryFilter active={categories} onToggle={onToggleCategory} />
              </div>
            </div>
            {/* Subcategory - only when categories selected */}
            {categories.length > 0 && (
              <div className="flex items-start gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-16 flex-shrink-0 pt-2">Sub</span>
                <div className="flex-1">
                  <SubcategoryFilter
                    activeCategories={categories}
                    activeSubcategories={subcategories}
                    onToggle={onToggleSubcategory}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
