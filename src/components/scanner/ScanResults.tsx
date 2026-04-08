"use client";

import { useState, useMemo } from "react";
import { X, Pencil, AlertTriangle, Check, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import { FOOD_DATABASE } from "@/lib/foods-data";
import type { ScannedItem } from "@/types";

interface ScanResultsProps {
  items: ScannedItem[];
  selectedItems: Set<string>;
  onToggleItem: (name: string) => void;
  onDeleteItem: (index: number) => void;
  onEditItem: (index: number, newName: string) => void;
  onClassifyItem: (index: number, foodId: string) => void;
}

// Common foods for quick classification
const QUICK_CLASSIFY = [
  "Beef Steak", "Beef Mince", "Chicken Breast", "Chicken Thighs",
  "Pork Chops", "Lamb Chops", "Salmon", "Cod", "Prawns",
  "Eggs", "Butter", "Cheddar Cheese", "Full-Fat Milk",
  "Broccoli", "Spinach", "Bell Peppers", "Mushrooms",
  "Bacon", "Double Cream", "Greek Yogurt",
];

export function ScanResults({
  items,
  selectedItems,
  onToggleItem,
  onDeleteItem,
  onEditItem,
  onClassifyItem,
}: ScanResultsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [classifyingIndex, setClassifyingIndex] = useState<number | null>(null);
  const [classifySearch, setClassifySearch] = useState("");

  // Search suggestions from food database
  const classifySuggestions = useMemo(() => {
    if (!classifySearch) return [];
    const q = classifySearch.toLowerCase();
    return FOOD_DATABASE
      .filter((f) => f.name.toLowerCase().includes(q) || f.subcategory.toLowerCase().includes(q))
      .slice(0, 8);
  }, [classifySearch]);

  // Edit suggestions
  const editSuggestions = useMemo(() => {
    if (!editValue || editValue.length < 2) return [];
    const q = editValue.toLowerCase();
    return FOOD_DATABASE
      .filter((f) => f.name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [editValue]);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
        <p className="text-sm">No food items identified. Try a clearer photo or better lighting.</p>
      </div>
    );
  }

  const startEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditValue(currentName);
    setClassifyingIndex(null);
  };

  const confirmEdit = (index: number) => {
    if (editValue.trim()) {
      onEditItem(index, editValue.trim());
    }
    setEditingIndex(null);
  };

  const startClassify = (index: number) => {
    setClassifyingIndex(classifyingIndex === index ? null : index);
    setClassifySearch("");
    setEditingIndex(null);
  };

  const doClassify = (index: number, foodId: string) => {
    onClassifyItem(index, foodId);
    setClassifyingIndex(null);
  };

  // Render with stable indices
  const indexedItems = items.map((item, i) => ({ item, originalIndex: i }));
  const uncertainItems = indexedItems.filter(({ item }) => item.confidence < 0.6);
  const confidentItems = indexedItems.filter(({ item }) => item.confidence >= 0.6);

  const renderItem = ({ item, originalIndex }: { item: ScannedItem; originalIndex: number }) => {
    const isEditing = editingIndex === originalIndex;
    const isClassifying = classifyingIndex === originalIndex;
    const isUncertain = item.confidence < 0.6;
    const itemKey = item.matchedFoodId || item.name;

    return (
      <div key={`item-${originalIndex}`} className="space-y-0">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl border-2 p-2.5 transition-all",
            isUncertain && "border-amber-200 bg-amber-50/50",
            !isUncertain && selectedItems.has(itemKey) && "border-emerald-500 bg-emerald-50",
            !isUncertain && !selectedItems.has(itemKey) && "border-gray-200 bg-white",
            isClassifying && "rounded-b-none border-b-0"
          )}
        >
          <input
            type="checkbox"
            checked={selectedItems.has(itemKey)}
            onChange={() => onToggleItem(itemKey)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(originalIndex); if (e.key === "Escape") setEditingIndex(null); }}
                    className="flex-1 rounded-lg border border-emerald-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                  <button onClick={() => confirmEdit(originalIndex)} className="text-emerald-600 hover:text-emerald-700 cursor-pointer p-1">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingIndex(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Edit suggestions */}
                {editSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {editSuggestions.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => { setEditValue(food.name); onEditItem(originalIndex, food.name); setEditingIndex(null); }}
                        className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                      >
                        {food.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                {isUncertain && (
                  <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                    <AlertTriangle className="h-3 w-3 mr-0.5" /> Unsure
                  </Badge>
                )}
                {item.trafficLight && (
                  <Badge trafficLight={item.trafficLight} className="flex-shrink-0 text-[10px]">
                    {TRAFFIC_LIGHT_LABELS[item.trafficLight]}
                  </Badge>
                )}
                {!item.matchedFoodId && !isUncertain && (
                  <Badge variant="outline" className="flex-shrink-0 text-[10px]">Unknown</Badge>
                )}
              </div>
            )}
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={cn("h-full rounded-full", {
                  "bg-emerald-500": item.confidence >= 0.7,
                  "bg-amber-500": item.confidence >= 0.4 && item.confidence < 0.7,
                  "bg-red-400": item.confidence < 0.4,
                })}
                style={{ width: `${item.confidence * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 w-7 text-right">{Math.round(item.confidence * 100)}%</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {(isUncertain || !item.matchedFoodId) && (
              <button
                onClick={() => startClassify(originalIndex)}
                className={cn("rounded-lg p-1.5 transition-colors cursor-pointer", isClassifying ? "text-emerald-600 bg-emerald-50" : "text-amber-500 hover:bg-amber-50")}
                title="Classify this item"
              >
                <Tag className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => startEdit(originalIndex, item.name)}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Edit name"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDeleteItem(originalIndex)}
              className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Classification panel */}
        {isClassifying && (
          <div className="border-2 border-t-0 border-amber-200 rounded-b-xl bg-white p-3 space-y-2">
            <p className="text-xs font-medium text-gray-500">Classify as:</p>
            {/* Quick picks */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CLASSIFY.map((name) => {
                const food = FOOD_DATABASE.find((f) => f.name === name);
                if (!food) return null;
                return (
                  <button
                    key={food.id}
                    onClick={() => doClassify(originalIndex, food.id)}
                    className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {food.name}
                  </button>
                );
              })}
            </div>
            {/* Search */}
            <input
              type="text"
              placeholder="Search all foods..."
              value={classifySearch}
              onChange={(e) => setClassifySearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {classifySuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {classifySuggestions.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => doClassify(originalIndex, food.id)}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 cursor-pointer transition-colors"
                  >
                    {food.name}
                    <span className="ml-1 text-emerald-500">({food.subcategory})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {items.length} item{items.length !== 1 ? "s" : ""} identified. Edit, classify, or select:
      </p>

      {uncertainItems.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Needs verification ({uncertainItems.length})
          </p>
          {uncertainItems.map(renderItem)}
        </div>
      )}

      {confidentItems.length > 0 && (
        <div className="space-y-1.5">
          {uncertainItems.length > 0 && (
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Identified ({confidentItems.length})
            </p>
          )}
          {confidentItems.map(renderItem)}
        </div>
      )}
    </div>
  );
}
