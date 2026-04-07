"use client";

import { Chip } from "@/components/ui/Chip";
import type { RecipePreferences as Prefs, CuisineStyle, CookTimeRange, DifficultyLevel, DietaryFilter, TrafficLightOnly } from "@/types";
import { CUISINE_LABELS, COOK_TIME_LABELS, DIFFICULTY_LABELS, DIETARY_LABELS, TRAFFIC_LIGHT_ONLY_LABELS } from "@/types";

interface RecipePreferencesProps {
  preferences: Prefs;
  onChange: (prefs: Prefs) => void;
}

const CUISINES: CuisineStyle[] = ["any", "british", "mediterranean", "asian", "mexican", "indian", "american", "middle-eastern"];
const COOK_TIMES: CookTimeRange[] = ["quick", "medium", "long"];
const DIFFICULTIES: DifficultyLevel[] = ["easy", "medium", "advanced"];
const DIETS: DietaryFilter[] = ["high-protein", "vegetarian", "vegan", "dairy-free", "nut-free", "gluten-free"];
const TL_OPTIONS: TrafficLightOnly[] = ["green-only", "green-amber", "all"];

export function RecipePreferencesPanel({ preferences, onChange }: RecipePreferencesProps) {
  const toggleCuisine = (c: CuisineStyle) => {
    const current = preferences.cuisineStyles;
    if (c === "any") {
      onChange({ ...preferences, cuisineStyles: current.includes("any") ? [] : ["any"] });
    } else {
      const without = current.filter((x) => x !== "any");
      const next = without.includes(c) ? without.filter((x) => x !== c) : [...without, c];
      onChange({ ...preferences, cuisineStyles: next });
    }
  };

  const setCookTime = (ct: CookTimeRange) => {
    onChange({ ...preferences, cookTime: preferences.cookTime === ct ? null : ct });
  };

  const setDifficulty = (d: DifficultyLevel) => {
    onChange({ ...preferences, difficulty: preferences.difficulty === d ? null : d });
  };

  const toggleDiet = (df: DietaryFilter) => {
    const current = preferences.dietaryFilters;
    const next = current.includes(df) ? current.filter((x) => x !== df) : [...current, df];
    onChange({ ...preferences, dietaryFilters: next });
  };

  const setTrafficLightOnly = (tl: TrafficLightOnly) => {
    onChange({ ...preferences, trafficLightOnly: tl });
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      {/* Traffic light restriction */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ingredient Restriction</p>
        <div className="flex flex-wrap gap-2">
          {TL_OPTIONS.map((tl) => (
            <Chip
              key={tl}
              label={TRAFFIC_LIGHT_ONLY_LABELS[tl]}
              active={preferences.trafficLightOnly === tl}
              onClick={() => setTrafficLightOnly(tl)}
              trafficLight={tl === "green-only" ? "green" : tl === "green-amber" ? "amber" : undefined}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cuisine Style</p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <Chip key={c} label={CUISINE_LABELS[c]} active={preferences.cuisineStyles.includes(c)} onClick={() => toggleCuisine(c)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cook Time</p>
        <div className="flex flex-wrap gap-2">
          {COOK_TIMES.map((ct) => (
            <Chip key={ct} label={COOK_TIME_LABELS[ct]} active={preferences.cookTime === ct} onClick={() => setCookTime(ct)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Difficulty</p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <Chip key={d} label={DIFFICULTY_LABELS[d]} active={preferences.difficulty === d} onClick={() => setDifficulty(d)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dietary</p>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((df) => (
            <Chip key={df} label={DIETARY_LABELS[df]} active={preferences.dietaryFilters.includes(df)} onClick={() => toggleDiet(df)} />
          ))}
        </div>
      </div>
    </div>
  );
}
