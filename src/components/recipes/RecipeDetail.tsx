"use client";

import { useState } from "react";
import { Clock, Users, ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { RecipeActions } from "./RecipeActions";
import { formatTime, cn, getTrafficLightBgColor } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import type { Recipe } from "@/types";

interface RecipeDetailProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetail({ recipe, isOpen, onClose }: RecipeDetailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  if (!recipe) return null;

  const generateImage = async () => {
    setImageLoading(true);
    setImageError(null);
    try {
      const res = await fetch("/api/recipes/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.imageUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={recipe.title} size="lg">
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <RecipeActions recipe={recipe} className="justify-end" />

        {/* AI Image */}
        {imageUrl ? (
          <img src={imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded-xl" />
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={generateImage}
              loading={imageLoading}
              disabled={imageLoading}
            >
              <ImageIcon className="h-4 w-4" />
              {imageLoading ? "Generating image..." : "Generate Image"}
            </Button>
            {imageLoading && <span className="text-xs text-gray-400">~10 seconds</span>}
            {imageError && <span className="text-xs text-red-500">{imageError}</span>}
          </div>
        )}

        {/* Header info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge trafficLight={recipe.overallTrafficLight}>
              {TRAFFIC_LIGHT_LABELS[recipe.overallTrafficLight]}
            </Badge>
            {recipe.mealTypes?.map((mt) => (
              <Badge key={mt} variant="outline">
                {mt.charAt(0).toUpperCase() + mt.slice(1)}
              </Badge>
            ))}
          </div>
          <p className="text-gray-600">{recipe.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Prep: {formatTime(recipe.prepTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Cook: {formatTime(recipe.cookTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                {ing.trafficLight && (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full flex-shrink-0",
                      getTrafficLightBgColor(ing.trafficLight)
                    )}
                  />
                )}
                <span className="text-gray-700">
                  <strong>{ing.quantity}{ing.unit ? ` ${ing.unit}` : ""}</strong>{" "}
                  {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Method
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
