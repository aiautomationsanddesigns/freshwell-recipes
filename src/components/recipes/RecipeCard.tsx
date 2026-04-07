"use client";

import { Clock, Users, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatTime } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import type { Recipe } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onRemove?: () => void;
}

export function RecipeCard({ recipe, onClick, onRemove }: RecipeCardProps) {
  return (
    <Card hoverable onClick={onClick} className="overflow-hidden relative group">
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 rounded-full p-1.5 bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm"
          title="Remove recipe"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {recipe.title}
          </h3>
          <Badge trafficLight={recipe.overallTrafficLight}>
            {TRAFFIC_LIGHT_LABELS[recipe.overallTrafficLight]}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Prep {formatTime(recipe.prepTime)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Cook {formatTime(recipe.cookTime)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
          </span>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
