"use client";

import { Check, Heart, EyeOff } from "lucide-react";
import { cn, getTrafficLightBgColor, getTrafficLightBgLight, getTrafficLightBorderColor } from "@/lib/utils";
import type { FoodItem } from "@/types";

interface FoodCardProps {
  food: FoodItem;
  selected: boolean;
  onToggle: () => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  onToggleHidden: () => void;
}

export function FoodCard({ food, selected, onToggle, isFavourite, onToggleFavourite, onToggleHidden }: FoodCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-0.5 rounded-xl border-2 p-2.5 text-left transition-all duration-200 w-full group",
        selected
          ? cn(getTrafficLightBorderColor(food.trafficLight), getTrafficLightBgLight(food.trafficLight), "shadow-md")
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      {/* Top row */}
      <div className="flex w-full items-start justify-between">
        <span className={cn("h-2.5 w-2.5 rounded-full mt-0.5", getTrafficLightBgColor(food.trafficLight))} />
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
            className="rounded-full p-0.5 text-gray-200 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title="Hide this food"
          >
            <EyeOff className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavourite(); }}
            className={cn(
              "rounded-full p-0.5 transition-colors cursor-pointer",
              isFavourite ? "text-red-500" : "text-gray-300 hover:text-red-400"
            )}
            title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart className={cn("h-3.5 w-3.5", isFavourite && "fill-current")} />
          </button>
          {selected && (
            <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-white", getTrafficLightBgColor(food.trafficLight))}>
              <Check className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
      <button onClick={onToggle} className="w-full text-left cursor-pointer">
        <span className="text-sm font-medium text-gray-900 leading-tight">{food.name}</span>
        <span className="block text-xs text-gray-500">{food.subcategory}</span>
      </button>
    </div>
  );
}
