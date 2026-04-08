"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ScanLine, RefreshCw, ChefHat, Plus, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ScannerTabs } from "@/components/scanner/ScannerTabs";
import { ScanResults } from "@/components/scanner/ScanResults";
import type { ScannedItem } from "@/types";
import { FOOD_DATABASE } from "@/lib/foods-data";

export function ScannerPageClient() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<ScannedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hasScanned, setHasScanned] = useState(false);
  const [betterPhotoRequest, setBetterPhotoRequest] = useState<string | null>(null);
  const [showAddMore, setShowAddMore] = useState(false);

  const analyzeImage = useCallback(async (file: File): Promise<ScannedItem[]> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/scanner/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to analyze image");
    return data.items || [];
  }, []);

  const handleImageSelect = useCallback(async (file: File) => {
    const newPreview = URL.createObjectURL(file);
    setPreviews((prev) => [...prev, newPreview]);
    setError(null);
    setBetterPhotoRequest(null);

    setIsScanning(true);
    try {
      const newItems = await analyzeImage(file);

      // Merge with existing results (avoid duplicates)
      setScanResults((prev) => {
        const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
        const uniqueNew = newItems.filter((i) => !existingNames.has(i.name.toLowerCase()));
        // Also update uncertain items if new scan has higher confidence
        const updated = prev.map((existing) => {
          const better = newItems.find(
            (n) => n.name.toLowerCase() === existing.name.toLowerCase() && n.confidence > existing.confidence
          );
          return better ? { ...existing, confidence: better.confidence, matchedFoodId: better.matchedFoodId || existing.matchedFoodId, trafficLight: better.trafficLight || existing.trafficLight } : existing;
        });
        return [...updated, ...uniqueNew];
      });

      // Auto-select newly matched items
      const matched = newItems
        .filter((item) => item.matchedFoodId && item.confidence >= 0.6)
        .map((item) => item.matchedFoodId as string);
      setSelectedItems((prev) => new Set([...prev, ...matched]));
      setHasScanned(true);
      setShowAddMore(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setIsScanning(false);
    }
  }, [analyzeImage]);

  const handleClearAll = useCallback(() => {
    setPreviews([]);
    setScanResults([]);
    setSelectedItems(new Set());
    setError(null);
    setHasScanned(false);
    setBetterPhotoRequest(null);
    setShowAddMore(false);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const deleteItem = useCallback((index: number) => {
    setScanResults((prev) => {
      const item = prev[index];
      if (item) {
        setSelectedItems((sel) => {
          const next = new Set(sel);
          next.delete(item.matchedFoodId || item.name);
          return next;
        });
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const editItem = useCallback((index: number, newName: string) => {
    setScanResults((prev) => {
      const updated = [...prev];
      const old = updated[index];
      // Try to match new name against food database
      const match = FOOD_DATABASE.find(
        (f) => f.name.toLowerCase() === newName.toLowerCase() ||
          f.name.toLowerCase().includes(newName.toLowerCase()) ||
          newName.toLowerCase().includes(f.name.toLowerCase())
      );
      updated[index] = {
        ...old,
        name: newName,
        matchedFoodId: match?.id || old.matchedFoodId,
        trafficLight: match?.trafficLight || old.trafficLight,
        confidence: match ? Math.max(old.confidence, 0.8) : old.confidence,
      };
      // Auto-select if matched
      if (match) {
        setSelectedItems((sel) => new Set([...sel, match.id]));
      }
      return updated;
    });
  }, []);

  const requestBetterPhoto = useCallback((itemName: string) => {
    setBetterPhotoRequest(itemName);
    setShowAddMore(true);
  }, []);

  const matchedFoodIds = [...selectedItems].filter((id) =>
    scanResults.some((item) => item.matchedFoodId === id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <ScanLine className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fridge Scanner</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Take photos of your fridge or food items. AI identifies ingredients
            and suggests Freshwell-compliant recipes.
          </p>
        </div>

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {previews.map((p, i) => (
              <img key={i} src={p} alt={`Scan ${i + 1}`} className="h-20 w-20 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
            ))}
          </div>
        )}

        {/* Better photo request banner */}
        {betterPhotoRequest && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-3">
            <ScanLine className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Better photo needed for: &ldquo;{betterPhotoRequest}&rdquo;</p>
              <p className="text-xs text-amber-600 mt-1">Take a closer, clearer photo of this item. The AI will combine results from all your photos.</p>
            </div>
          </div>
        )}

        {/* Image input - show when no scans yet OR when adding more */}
        {(!hasScanned || showAddMore) && (
          <ScannerTabs
            onImageSelect={handleImageSelect}
            preview={null}
            onClear={() => setShowAddMore(false)}
          />
        )}

        {/* Scanning state */}
        {isScanning && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Spinner size="lg" className="text-emerald-600" />
            <p className="text-sm font-medium text-gray-600">
              {previews.length > 1 ? "Analyzing additional photo..." : "Analyzing your fridge..."}
            </p>
            <p className="text-xs text-gray-400">This may take a few seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button onClick={handleClearAll} className="ml-2 underline hover:no-underline cursor-pointer">
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
              onDeleteItem={deleteItem}
              onEditItem={editItem}
              onRequestBetterPhoto={requestBetterPhoto}
            />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {!showAddMore && (
                <Button variant="outline" onClick={() => setShowAddMore(true)}>
                  <ImagePlus className="h-4 w-4" />
                  Add Another Photo
                </Button>
              )}
              <Button variant="outline" onClick={handleClearAll}>
                <RefreshCw className="h-4 w-4" />
                Start Over
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
