"use client";

import { Badge } from "@/components/ui/Badge";
import { cn, getTrafficLightBgColor } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import type { ScannedItem } from "@/types";

interface ScanResultsProps {
  items: ScannedItem[];
  selectedItems: Set<string>;
  onToggleItem: (name: string) => void;
}

export function ScanResults({ items, selectedItems, onToggleItem }: ScanResultsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
        <p className="text-sm">No food items identified. Try a clearer photo or better lighting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        {items.length} item{items.length !== 1 ? "s" : ""} identified. Select the ones you want to use:
      </p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <label
            key={`${item.name}-${i}`}
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all",
              selectedItems.has(item.matchedFoodId || item.name)
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <input
              type="checkbox"
              checked={selectedItems.has(item.matchedFoodId || item.name)}
              onChange={() => onToggleItem(item.matchedFoodId || item.name)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </span>
                {item.trafficLight && (
                  <Badge trafficLight={item.trafficLight} className="flex-shrink-0">
                    {TRAFFIC_LIGHT_LABELS[item.trafficLight]}
                  </Badge>
                )}
                {!item.matchedFoodId && (
                  <Badge variant="outline" className="flex-shrink-0 text-xs">
                    Unknown
                  </Badge>
                )}
              </div>
            </div>
            {/* Confidence bar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", {
                    "bg-emerald-500": item.confidence >= 0.7,
                    "bg-amber-500": item.confidence >= 0.4 && item.confidence < 0.7,
                    "bg-red-400": item.confidence < 0.4,
                  })}
                  style={{ width: `${item.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {Math.round(item.confidence * 100)}%
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
