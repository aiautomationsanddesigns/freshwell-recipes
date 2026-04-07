import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Users, Leaf } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { formatTime, cn, getTrafficLightBgColor } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import type { Recipe } from "@/types";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("shared_recipes")
    .select("recipe_data")
    .eq("share_code", code)
    .single();

  if (!data) return { title: "Recipe Not Found | Freshwell" };
  const recipe = data.recipe_data as Recipe;
  return {
    title: `${recipe.title} | Freshwell`,
    description: recipe.description,
  };
}

export default async function SharedRecipePage({ params }: PageProps) {
  const { code } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("shared_recipes")
    .select("recipe_data, created_at")
    .eq("share_code", code)
    .single();

  if (error || !data) {
    notFound();
  }

  const recipe = data.recipe_data as Recipe;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
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
          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="text-lg text-gray-600">{recipe.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Prep: {formatTime(recipe.prepTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Cook: {formatTime(recipe.cookTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Ingredients</h2>
          <ul className="space-y-2.5">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                {ing.trafficLight && (
                  <span className={cn("h-2 w-2 rounded-full flex-shrink-0", getTrafficLightBgColor(ing.trafficLight))} />
                )}
                <span className="text-gray-700">
                  <strong>{ing.quantity}{ing.unit ? ` ${ing.unit}` : ""}</strong> {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Method */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Method</h2>
          <ol className="space-y-4">
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

        {/* CTA */}
        <div className="rounded-2xl bg-emerald-600 p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-100">
            <Leaf className="h-5 w-5" />
            <span className="text-sm font-medium">Freshwell Low Carb Recipes</span>
          </div>
          <p className="text-white text-lg font-semibold">
            Want to generate your own low carb recipes?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Try Freshwell
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
