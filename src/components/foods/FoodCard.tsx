"use client";

import { Check } from "lucide-react";
import { cn, getTrafficLightBgColor, getTrafficLightBgLight, getTrafficLightBorderColor } from "@/lib/utils";
import type { FoodItem } from "@/types";

interface FoodCardProps {
  food: FoodItem;
  selected: boolean;
  onToggle: () => void;
}

export function FoodCard({ food, selected, onToggle }: FoodCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex flex-col items-start gap-0.5 rounded-xl border-2 p-2.5 text-left transition-all duration-200 w-full cursor-pointer",
        selected
          ? cn(
              getTrafficLightBorderColor(food.trafficLight),
              getTrafficLightBgLight(food.trafficLight),
              "shadow-md"
            )
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      {/* Traffic light dot */}
      <div className="flex w-full items-start justify-between">
        <span className={cn("h-2.5 w-2.5 rounded-full mt-0.5", getTrafficLightBgColor(food.trafficLight))} />
        {selected && (
          <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-white", getTrafficLightBgColor(food.trafficLight))}>
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-gray-900 leading-tight">{food.name}</span>
      <span className="text-xs text-gray-500">{food.subcategory}</span>
      {food.servingNote && (
        <span className="text-xs text-gray-400 italic">{food.servingNote}</span>
      )}
    </button>
  );
}
