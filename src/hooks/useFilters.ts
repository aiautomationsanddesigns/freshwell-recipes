"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { TrafficLight, FoodCategory, FilterState } from "@/types";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: FilterState = useMemo(() => {
    const tl = searchParams.get("tl");
    const cat = searchParams.get("cat");
    const sub = searchParams.get("sub");
    const q = searchParams.get("q");

    return {
      trafficLights: tl ? (tl.split(",") as TrafficLight[]) : [],
      categories: cat ? (cat.split(",") as FoodCategory[]) : [],
      subcategories: sub ? sub.split(",") : [],
      searchQuery: q || "",
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (newFilters: Partial<FilterState>) => {
      const merged = { ...filters, ...newFilters };
      const params = new URLSearchParams();

      if (merged.trafficLights.length > 0) params.set("tl", merged.trafficLights.join(","));
      if (merged.categories.length > 0) params.set("cat", merged.categories.join(","));
      if (merged.subcategories.length > 0) params.set("sub", merged.subcategories.join(","));
      if (merged.searchQuery) params.set("q", merged.searchQuery);

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [filters, router, pathname]
  );

  const toggleTrafficLight = useCallback(
    (tl: TrafficLight) => {
      const current = filters.trafficLights;
      const next = current.includes(tl)
        ? current.filter((t) => t !== tl)
        : [...current, tl];
      updateParams({ trafficLights: next });
    },
    [filters.trafficLights, updateParams]
  );

  const toggleCategory = useCallback(
    (cat: FoodCategory) => {
      const current = filters.categories;
      const next = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat];
      // Clear subcategories when category is removed
      const newSubs = next.length < current.length
        ? filters.subcategories
        : filters.subcategories;
      updateParams({ categories: next, subcategories: newSubs });
    },
    [filters.categories, filters.subcategories, updateParams]
  );

  const toggleSubcategory = useCallback(
    (sub: string) => {
      const current = filters.subcategories;
      const next = current.includes(sub)
        ? current.filter((s) => s !== sub)
        : [...current, sub];
      updateParams({ subcategories: next });
    },
    [filters.subcategories, updateParams]
  );

  const setSearchQuery = useCallback(
    (q: string) => {
      updateParams({ searchQuery: q });
    },
    [updateParams]
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters =
    filters.trafficLights.length > 0 ||
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.searchQuery !== "";

  return {
    filters,
    toggleTrafficLight,
    toggleCategory,
    toggleSubcategory,
    setSearchQuery,
    clearAll,
    hasActiveFilters,
  };
}
