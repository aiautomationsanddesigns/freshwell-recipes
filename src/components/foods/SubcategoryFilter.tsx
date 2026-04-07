"use client";

import { Chip } from "@/components/ui/Chip";
import { SUBCATEGORIES_BY_CATEGORY } from "@/lib/foods-data";
import type { FoodCategory } from "@/types";

interface SubcategoryFilterProps {
  activeCategories: FoodCategory[];
  activeSubcategories: string[];
  onToggle: (sub: string) => void;
}

export function SubcategoryFilter({
  activeCategories,
  activeSubcategories,
  onToggle,
}: SubcategoryFilterProps) {
  const subcategories = activeCategories.flatMap(
    (cat) => SUBCATEGORIES_BY_CATEGORY[cat] || []
  );

  const uniqueSubs = Array.from(new Set(subcategories)).sort();

  if (uniqueSubs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueSubs.map((sub) => (
        <Chip
          key={sub}
          label={sub}
          active={activeSubcategories.includes(sub)}
          onClick={() => onToggle(sub)}
        />
      ))}
    </div>
  );
}
