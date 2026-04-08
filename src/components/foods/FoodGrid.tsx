"use client";

import { groupByCategory } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/types";
import type { FoodItem, FoodCategory } from "@/types";
import { FoodCard } from "./FoodCard";
import { PackageOpen, Star } from "lucide-react";

interface FoodGridProps {
  foods: FoodItem[];
  selectedFoods: Set<string>;
  onToggleFood: (id: string) => void;
  favourites: Set<string>;
  onToggleFavourite: (id: string) => void;
  onToggleHidden: (id: string) => void;
}

const CATEGORY_ORDER: FoodCategory[] = [
  "meat", "fish", "eggs", "dairy", "vegetables", "fruit",
  "nuts-seeds", "fats-oils", "legumes", "condiments", "drinks",
  "grains-starch", "sweets-snacks", "processed",
];

export function FoodGrid({ foods, selectedFoods, onToggleFood, favourites, onToggleFavourite, onToggleHidden }: FoodGridProps) {
  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
        <PackageOpen className="h-12 w-12" />
        <p className="text-lg font-medium">No foods match your filters</p>
        <p className="text-sm">Try adjusting or clearing your filters</p>
      </div>
    );
  }

  // Split into favourites and regular
  const favouriteFoods = foods.filter((f) => favourites.has(f.id));
  const regularFoods = foods.filter((f) => !favourites.has(f.id));

  const grouped = groupByCategory(regularFoods);
  const orderedCategories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0);

  return (
    <div className="space-y-8">
      {/* Favourites section at top */}
      {favouriteFoods.length > 0 && (
        <section>
          <div className="sticky top-[4rem] z-10 flex items-center gap-2 bg-gray-50/95 backdrop-blur-sm py-2 px-1 -mx-1 mb-3">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
              Your Favourites
            </h3>
            <span className="text-xs text-amber-500 bg-amber-100 rounded-full px-2 py-0.5">
              {favouriteFoods.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {favouriteFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                selected={selectedFoods.has(food.id)}
                onToggle={() => onToggleFood(food.id)}
                isFavourite={true}
                onToggleFavourite={() => onToggleFavourite(food.id)}
                onToggleHidden={() => onToggleHidden(food.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular categories */}
      {orderedCategories.map((category) => (
        <section key={category}>
          <div className="sticky top-[4rem] z-10 flex items-center gap-2 bg-gray-50/95 backdrop-blur-sm py-2 px-1 -mx-1 mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {CATEGORY_LABELS[category]}
            </h3>
            <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
              {grouped[category].length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {grouped[category].map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                selected={selectedFoods.has(food.id)}
                onToggle={() => onToggleFood(food.id)}
                isFavourite={false}
                onToggleFavourite={() => onToggleFavourite(food.id)}
                onToggleHidden={() => onToggleHidden(food.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
