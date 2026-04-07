"use client";

import { cn } from "@/lib/utils";
import type { TrafficLight } from "@/types";

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  trafficLight?: TrafficLight;
  count?: number;
  className?: string;
}

export function Chip({ label, active, onClick, trafficLight, count, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border-2 whitespace-nowrap cursor-pointer",
        active
          ? trafficLight
            ? {
                "bg-emerald-500 text-white border-emerald-500 shadow-md": trafficLight === "green",
                "bg-amber-500 text-white border-amber-500 shadow-md": trafficLight === "amber",
                "bg-red-500 text-white border-red-500 shadow-md": trafficLight === "red",
              }
            : "bg-gray-800 text-white border-gray-800 shadow-md"
          : trafficLight
            ? {
                "bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400": trafficLight === "green",
                "bg-white text-amber-700 border-amber-200 hover:border-amber-400": trafficLight === "amber",
                "bg-white text-red-700 border-red-200 hover:border-red-400": trafficLight === "red",
              }
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
        className
      )}
    >
      {trafficLight && (
        <span
          className={cn("h-2.5 w-2.5 rounded-full", {
            "bg-white": active,
            "bg-emerald-500": !active && trafficLight === "green",
            "bg-amber-500": !active && trafficLight === "amber",
            "bg-red-500": !active && trafficLight === "red",
          })}
        />
      )}
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "ml-1 rounded-full px-1.5 py-0.5 text-xs",
            active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
