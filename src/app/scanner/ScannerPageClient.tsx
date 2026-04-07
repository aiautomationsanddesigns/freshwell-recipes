"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ScanLine, RefreshCw, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ScannerTabs } from "@/components/scanner/ScannerTabs";
import { ScanResults } from "@/components/scanner/ScanResults";
import type { ScannedItem } from "@/types";

export function ScannerPageClient() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<ScannedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hasScanned, setHasScanned] = useState(false);

  const handleImageSelect = useCallback(async (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
    setScanResults([]);
    setSelectedItems(new Set());
    setHasScanned(false);

    // Auto-scan
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/scanner/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }
      setScanResults(data.items || []);
      // Auto-select all matched items
      const matched = (data.items || [])
        .filter((item: ScannedItem) => item.matchedFoodId)
        .map((item: ScannedItem) => item.matchedFoodId as string);
      setSelectedItems(new Set(matched));
      setHasScanned(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setImage(null);
    setPreview(null);
    setScanResults([]);
    setSelectedItems(new Set());
    setError(null);
    setHasScanned(false);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const matchedFoodIds = [...selectedItems].filter((id) =>
    scanResults.some((item) => item.matchedFoodId === id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <ScanLine className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fridge Scanner</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Take a photo of your fridge or food items. Our AI will identify ingredients
            and suggest Freshwell-compliant recipes.
          </p>
        </div>

        {/* Image input */}
        <ScannerTabs
          onImageSelect={handleImageSelect}
          preview={preview}
          onClear={handleClear}
        />

        {/* Scanning state */}
        {isScanning && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Spinner size="lg" className="text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">Analyzing your fridge...</p>
            <p className="text-xs text-gray-400">This may take a few seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={handleClear}
              className="ml-2 underline hover:no-underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {hasScanned && !isScanning && (
          <>
            <ScanResults
              items={scanResults}
              selectedItems={selectedItems}
              onToggleItem={toggleItem}
            />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="h-4 w-4" />
                Scan Another
              </Button>
              {matchedFoodIds.length > 0 && (
                <Link href={`/recipes?foods=${matchedFoodIds.join(",")}`}>
                  <Button>
                    <ChefHat className="h-4 w-4" />
                    Generate Recipes ({matchedFoodIds.length} items)
                  </Button>
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
