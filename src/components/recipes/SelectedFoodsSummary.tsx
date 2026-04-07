"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FOOD_BY_ID } from "@/lib/foods-data";
import type { FoodItem, TrafficLight } from "@/types";

interface SelectedFoodsSummaryProps {
  foodIds: string[];
  onRemove: (id: string) => void;
}

export function SelectedFoodsSummary({ foodIds, onRemove }: SelectedFoodsSummaryProps) {
  const foods = foodIds
    .map((id) => FOOD_BY_ID.get(id))
    .filter(Boolean) as FoodItem[];

  const grouped: Record<TrafficLight, FoodItem[]> = {
    green: foods.filter((f) => f.trafficLight === "green"),
    amber: foods.filter((f) => f.trafficLight === "amber"),
    red: foods.filter((f) => f.trafficLight === "red"),
  };

  if (foods.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
        <p className="text-sm">No foods selected. Go to the <a href="/foods" className="text-emerald-600 underline">food browser</a> to select ingredients.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(["green", "amber", "red"] as TrafficLight[]).map((tl) => {
        if (grouped[tl].length === 0) return null;
        return (
          <div key={tl} className="flex flex-wrap gap-2">
            {grouped[tl].map((food) => (
              <Badge key={food.id} trafficLight={food.trafficLight} className="pr-1">
                <span>{food.name}</span>
                <button
                  onClick={() => onRemove(food.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        );
      })}
    </div>
  );
}
