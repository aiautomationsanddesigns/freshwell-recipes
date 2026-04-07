"use client";

import { Coffee, UtensilsCrossed, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MealType } from "@/types";

interface MealTypeSelectorProps {
  selected: MealType[];
  onToggle: (mt: MealType) => void;
}

const MEAL_TYPES: { type: MealType; label: string; icon: React.ElementType }[] = [
  { type: "breakfast", label: "Breakfast", icon: Coffee },
  { type: "lunch", label: "Lunch", icon: UtensilsCrossed },
  { type: "dinner", label: "Dinner", icon: ChefHat },
];

export function MealTypeSelector({ selected, onToggle }: MealTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {MEAL_TYPES.map(({ type, label, icon: Icon }) => {
        const active = selected.includes(type);
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer",
              active
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
