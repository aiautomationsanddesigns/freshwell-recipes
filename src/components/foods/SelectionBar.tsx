"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SelectionBarProps {
  count: number;
  selectedIds: Set<string>;
  onClear: () => void;
}

export function SelectionBar({ count, selectedIds, onClear }: SelectionBarProps) {
  if (count === 0) return null;

  const foodsParam = [...selectedIds].join(",");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            <strong className="text-emerald-600">{count}</strong> food{count !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Link href={`/recipes?foods=${foodsParam}`}>
          <Button size="md">
            Generate Recipes
          </Button>
        </Link>
      </div>
    </div>
  );
}
