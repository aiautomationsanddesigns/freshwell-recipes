"use client";

import { ChefHat, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationMode } from "@/types";

interface GenerationModeSelectorProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

export function GenerationModeSelector({ mode, onModeChange }: GenerationModeSelectorProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
      <button
        onClick={() => onModeChange("recipes")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all cursor-pointer",
          mode === "recipes" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <ChefHat className="h-4 w-4" />
        Individual Recipes
      </button>
      <button
        onClick={() => onModeChange("meal-plan")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all cursor-pointer",
          mode === "meal-plan" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <CalendarDays className="h-4 w-4" />
        7-Day Meal Plan
      </button>
    </div>
  );
}
