"use client";

import { Chip } from "@/components/ui/Chip";
import type { TrafficLight } from "@/types";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import { FOOD_DATABASE } from "@/lib/foods-data";

interface TrafficLightFilterProps {
  active: TrafficLight[];
  onToggle: (tl: TrafficLight) => void;
}

const LIGHTS: TrafficLight[] = ["green", "amber", "red"];

export function TrafficLightFilter({ active, onToggle }: TrafficLightFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LIGHTS.map((tl) => {
        const count = FOOD_DATABASE.filter((f) => f.trafficLight === tl).length;
        return (
          <Chip
            key={tl}
            label={TRAFFIC_LIGHT_LABELS[tl]}
            active={active.includes(tl)}
            onClick={() => onToggle(tl)}
            trafficLight={tl}
            count={count}
          />
        );
      })}
    </div>
  );
}
