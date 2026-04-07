"use client";

import { cn, getTrafficLightBgColor } from "@/lib/utils";
import type { TrafficLight } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  trafficLight?: TrafficLight;
  variant?: "default" | "outline";
  className?: string;
}

export function Badge({ children, trafficLight, variant = "default", className }: BadgeProps) {
  if (trafficLight && variant === "default") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
          {
            "bg-emerald-100 text-emerald-800": trafficLight === "green",
            "bg-amber-100 text-amber-800": trafficLight === "amber",
            "bg-red-100 text-red-800": trafficLight === "red",
          },
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", getTrafficLightBgColor(trafficLight))} />
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "outline"
          ? "border border-gray-300 text-gray-600"
          : "bg-gray-100 text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}
