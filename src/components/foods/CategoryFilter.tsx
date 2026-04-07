"use client";

import { Chip } from "@/components/ui/Chip";
import { CATEGORIES } from "@/lib/foods-data";
import { CATEGORY_LABELS } from "@/types";
import type { FoodCategory } from "@/types";

interface CategoryFilterProps {
  active: FoodCategory[];
  onToggle: (cat: FoodCategory) => void;
}

export function CategoryFilter({ active, onToggle }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={CATEGORY_LABELS[cat] || cat}
          active={active.includes(cat)}
          onClick={() => onToggle(cat)}
        />
      ))}
    </div>
  );
}
