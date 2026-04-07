"use client";

import { Spinner } from "@/components/ui/Spinner";

interface RecipeLoadingSkeletonProps {
  message?: string;
}

export function RecipeLoadingSkeleton({ message }: RecipeLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Loading message */}
      <div className="flex flex-col items-center gap-3 py-4">
        <Spinner size="lg" className="text-emerald-600" />
        <p className="text-sm font-medium text-gray-600">{message || "Generating your recipes..."}</p>
        <p className="text-xs text-gray-400">This usually takes 15-30 seconds</p>
      </div>

      {/* Skeleton cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="h-6 w-48 rounded-lg bg-gray-200" />
              <div className="h-5 w-20 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-4 w-16 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
