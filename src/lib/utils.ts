import { clsx, type ClassValue } from "clsx";
import type { FoodItem, FoodCategory, FilterState, TrafficLight } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getTrafficLightColor(tl: TrafficLight): string {
  switch (tl) {
    case "green":
      return "text-emerald-600";
    case "amber":
      return "text-amber-500";
    case "red":
      return "text-red-500";
  }
}

export function getTrafficLightBgColor(tl: TrafficLight): string {
  switch (tl) {
    case "green":
      return "bg-emerald-500";
    case "amber":
      return "bg-amber-500";
    case "red":
      return "bg-red-500";
  }
}

export function getTrafficLightBgLight(tl: TrafficLight): string {
  switch (tl) {
    case "green":
      return "bg-emerald-50";
    case "amber":
      return "bg-amber-50";
    case "red":
      return "bg-red-50";
  }
}

export function getTrafficLightBorderColor(tl: TrafficLight): string {
  switch (tl) {
    case "green":
      return "border-emerald-500";
    case "amber":
      return "border-amber-500";
    case "red":
      return "border-red-500";
  }
}

export function getTrafficLightRingColor(tl: TrafficLight): string {
  switch (tl) {
    case "green":
      return "ring-emerald-500";
    case "amber":
      return "ring-amber-500";
    case "red":
      return "ring-red-500";
  }
}

export function filterFoods(foods: FoodItem[], filters: FilterState): FoodItem[] {
  return foods.filter((food) => {
    if (filters.trafficLights.length > 0 && !filters.trafficLights.includes(food.trafficLight)) {
      return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(food.category)) {
      return false;
    }
    if (filters.subcategories.length > 0 && !filters.subcategories.includes(food.subcategory)) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        food.name.toLowerCase().includes(query) ||
        food.subcategory.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query)
      );
    }
    return true;
  });
}

export function groupByCategory(foods: FoodItem[]): Record<FoodCategory, FoodItem[]> {
  const groups = {} as Record<FoodCategory, FoodItem[]>;
  for (const food of foods) {
    if (!groups[food.category]) {
      groups[food.category] = [];
    }
    groups[food.category].push(food);
  }
  return groups;
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} mins`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
