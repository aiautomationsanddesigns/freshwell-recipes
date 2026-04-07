"use client";

import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatTime } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import type { MealPlanDay, Recipe } from "@/types";

interface MealPlanViewProps {
  days: MealPlanDay[];
  onViewRecipe: (recipe: Recipe) => void;
  onRegenerateDay: (dayNumber: number) => void;
  regeneratingDay: number | null;
}

export function MealPlanView({ days, onViewRecipe, onRegenerateDay, regeneratingDay }: MealPlanViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">7-Day Meal Plan</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {days.map((day) => (
          <div key={day.day} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {/* Day header */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-800">{day.dayName}</span>
              <button
                onClick={() => onRegenerateDay(day.day)}
                disabled={regeneratingDay === day.day}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                title="Regenerate this day"
              >
                {regeneratingDay === day.day ? (
                  <Spinner size="sm" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Meals */}
            <div className="divide-y divide-gray-50">
              <MealSlot label="Lunch" recipe={day.lunch} onView={onViewRecipe} />
              <MealSlot label="Dinner" recipe={day.dinner} onView={onViewRecipe} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MealSlot({
  label,
  recipe,
  onView,
}: {
  label: string;
  recipe: Recipe | null;
  onView: (recipe: Recipe) => void;
}) {
  if (!recipe) {
    return (
      <div className="px-4 py-3">
        <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
        <p className="text-sm text-gray-300 mt-1">Not generated</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => onView(recipe)}
      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
        <Badge trafficLight={recipe.overallTrafficLight} className="text-[10px]">
          {TRAFFIC_LIGHT_LABELS[recipe.overallTrafficLight]}
        </Badge>
      </div>
      <p className="text-sm font-medium text-gray-900 leading-tight">{recipe.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {formatTime(recipe.prepTime + recipe.cookTime)}
      </p>
    </button>
  );
}
