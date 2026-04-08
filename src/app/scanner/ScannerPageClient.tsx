"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ScanLine, RefreshCw, ChefHat, Plus, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ScanResults } from "@/components/scanner/ScanResults";
import type { ScannedItem } from "@/types";
import { FOOD_DATABASE, FOOD_BY_ID } from "@/lib/foods-data";

const MAX_PHOTOS = 5;
const SCANNER_STATE_KEY = "freshwell-scanner-state";

interface ScannerState {
  previews: string[];
  scanResults: ScannedItem[];
  selectedItems: string[];
  hasScanned: boolean;
}

function saveScannerState(state: ScannerState) {
  try { sessionStorage.setItem(SCANNER_STATE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function loadScannerState(): ScannerState | null {
  try {
    const stored = sessionStorage.getItem(SCANNER_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function ScannerPageClient() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<ScannedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hasScanned, setHasScanned] = useState(false);
  const [betterPhotoRequest, setBetterPhotoRequest] = useState<string | null>(null);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualAddSearch, setManualAddSearch] = useState("");

  // Restore state from sessionStorage on mount
  useEffect(() => {
    const saved = loadScannerState();
    if (saved && saved.hasScanned) {
      setPreviews(saved.previews);
      setScanResults(saved.scanResults);
      setSelectedItems(new Set(saved.selectedItems));
      setHasScanned(saved.hasScanned);
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (hasScanned) {
      saveScannerState({
        previews,
        scanResults,
        selectedItems: [...selectedItems],
        hasScanned,
      });
    }
  }, [previews, scanResults, selectedItems, hasScanned]);

  const analyzeImage = useCallback(async (file: File): Promise<ScannedItem[]> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/scanner/analyze", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to analyze image");
    return data.items || [];
  }, []);

  const handleImageSelect = useCallback(async (file: File) => {
    if (previews.length >= MAX_PHOTOS) return;

    // Convert to base64 data URL for persistence (blob URLs don't survive navigation)
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviews((prev) => [...prev, dataUrl]);
    };
    reader.readAsDataURL(file);

    setError(null);
    setBetterPhotoRequest(null);
    setIsScanning(true);
    try {
      const newItems = await analyzeImage(file);
      setScanResults((prev) => {
        const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
        const uniqueNew = newItems.filter((i) => !existingNames.has(i.name.toLowerCase()));
        const updated = prev.map((existing) => {
          const better = newItems.find(
            (n) => n.name.toLowerCase() === existing.name.toLowerCase() && n.confidence > existing.confidence
          );
          return better ? { ...existing, confidence: better.confidence, matchedFoodId: better.matchedFoodId || existing.matchedFoodId, trafficLight: better.trafficLight || existing.trafficLight } : existing;
        });
        return [...updated, ...uniqueNew];
      });
      setSelectedItems((prev) => {
        const matched = newItems.filter((item) => item.matchedFoodId && item.confidence >= 0.6).map((item) => item.matchedFoodId as string);
        return new Set([...prev, ...matched]);
      });
      setHasScanned(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setIsScanning(false);
    }
  }, [analyzeImage, previews.length]);

  const handleClearAll = useCallback(() => {
    setPreviews([]); setScanResults([]); setSelectedItems(new Set());
    setError(null); setHasScanned(false); setBetterPhotoRequest(null); setShowManualAdd(false);
    try { sessionStorage.removeItem(SCANNER_STATE_KEY); } catch { /* ignore */ }
  }, []);

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const deleteItem = useCallback((index: number) => {
    setScanResults((prev) => {
      const item = prev[index];
      if (item) setSelectedItems((sel) => { const next = new Set(sel); next.delete(item.matchedFoodId || item.name); return next; });
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const editItem = useCallback((index: number, newName: string) => {
    setScanResults((prev) => {
      const updated = [...prev];
      const old = updated[index];
      if (!old) return prev;
      const match = FOOD_DATABASE.find((f) => f.name.toLowerCase() === newName.toLowerCase() || f.name.toLowerCase().includes(newName.toLowerCase()) || newName.toLowerCase().includes(f.name.toLowerCase()));
      updated[index] = { ...old, name: newName, matchedFoodId: match?.id || undefined, trafficLight: match?.trafficLight || undefined, confidence: match ? Math.max(old.confidence, 0.8) : old.confidence };
      if (match) setSelectedItems((sel) => new Set([...sel, match.id]));
      return updated;
    });
  }, []);

  const classifyItem = useCallback((index: number, foodId: string) => {
    const food = FOOD_BY_ID.get(foodId);
    if (!food) return;
    setScanResults((prev) => {
      const updated = [...prev];
      const old = updated[index];
      if (!old) return prev;
      updated[index] = { ...old, name: food.name, matchedFoodId: food.id, trafficLight: food.trafficLight, confidence: 1.0 };
      return updated;
    });
    setSelectedItems((prev) => new Set([...prev, foodId]));
  }, []);

  const addManualItem = useCallback((foodId: string) => {
    const food = FOOD_BY_ID.get(foodId);
    if (!food) return;
    if (scanResults.some((r) => r.matchedFoodId === foodId)) return;
    setScanResults((prev) => [...prev, { name: food.name, confidence: 1.0, matchedFoodId: food.id, trafficLight: food.trafficLight }]);
    setSelectedItems((prev) => new Set([...prev, foodId]));
    setManualAddSearch(""); setShowManualAdd(false); setHasScanned(true);
  }, [scanResults]);

  const matchedFoodIds = [...selectedItems].filter((id) => scanResults.some((item) => item.matchedFoodId === id));
  const canAddMore = previews.length < MAX_PHOTOS;

  const manualSuggestions = manualAddSearch.length >= 2
    ? FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(manualAddSearch.toLowerCase())).slice(0, 10)
    : [];

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
            Upload or take up to {MAX_PHOTOS} photos. AI identifies ingredients and suggests recipes.
          </p>
        </div>

        {/* Photo thumbnails */}
        {previews.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 items-center">
            {previews.map((p, i) => (
              <img key={i} src={p} alt={`Scan ${i + 1}`} className="h-16 w-16 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
            ))}
            <span className="text-xs text-gray-400 flex-shrink-0 pl-1">{previews.length}/{MAX_PHOTOS}</span>
          </div>
        )}

        {/* Better photo request */}
        {betterPhotoRequest && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-start gap-3">
            <ScanLine className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Better photo needed: &ldquo;{betterPhotoRequest}&rdquo;</p>
              <p className="text-xs text-amber-600 mt-0.5">Take a closer photo. All photos are combined.</p>
            </div>
          </div>
        )}

        {/* Upload / Camera - always visible when under limit */}
        {canAddMore && (
          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 text-sm font-medium text-gray-600 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload Photo
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                onChange={(e) => { const files = Array.from(e.target.files || []); files.slice(0, MAX_PHOTOS - previews.length).forEach((file) => handleImageSelect(file)); e.target.value = ""; }}
              />
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 text-sm font-medium text-gray-600 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all cursor-pointer">
              <Camera className="h-4 w-4" />
              Take Photo
              <input type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageSelect(file); e.target.value = ""; }}
              />
            </label>
          </div>
        )}
        {!canAddMore && <p className="text-xs text-center text-gray-400">Maximum {MAX_PHOTOS} photos reached</p>}

        {/* Scanning */}
        {isScanning && (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <Spinner size="sm" className="text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">{previews.length > 1 ? "Analyzing and merging results..." : "Analyzing your photo..."}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button onClick={handleClearAll} className="ml-2 underline hover:no-underline cursor-pointer">Start over</button>
          </div>
        )}

        {/* Results */}
        {hasScanned && scanResults.length > 0 && (
          <ScanResults items={scanResults} selectedItems={selectedItems} onToggleItem={toggleItem} onDeleteItem={deleteItem} onEditItem={editItem} onClassifyItem={classifyItem} />
        )}

        {/* Manual add */}
        {hasScanned && (
          <div className="space-y-2">
            {!showManualAdd ? (
              <button onClick={() => setShowManualAdd(true)} className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer">
                <Plus className="h-4 w-4" /> Add item manually
              </button>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Search foods to add..." value={manualAddSearch} onChange={(e) => setManualAddSearch(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" autoFocus
                  />
                  <button onClick={() => { setShowManualAdd(false); setManualAddSearch(""); }} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                    <ScanLine className="h-4 w-4" />
                  </button>
                </div>
                {manualSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {manualSuggestions.map((food) => (
                      <button key={food.id} onClick={() => addManualItem(food.id)}
                        className="rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer transition-colors">
                        {food.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {hasScanned && !isScanning && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleClearAll}>
              <RefreshCw className="h-4 w-4" /> Start Over
            </Button>
            {matchedFoodIds.length > 0 && (
              <Link href={`/recipes?foods=${matchedFoodIds.join(",")}&from=scanner`}>
                <Button>
                  <ChefHat className="h-4 w-4" /> Generate Recipes ({matchedFoodIds.length} items)
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
