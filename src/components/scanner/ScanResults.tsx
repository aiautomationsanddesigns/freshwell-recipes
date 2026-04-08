"use client";

import { useState } from "react";
import { X, Pencil, AlertTriangle, Check, Camera } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { TRAFFIC_LIGHT_LABELS } from "@/types";
import type { ScannedItem } from "@/types";

interface ScanResultsProps {
  items: ScannedItem[];
  selectedItems: Set<string>;
  onToggleItem: (name: string) => void;
  onDeleteItem: (index: number) => void;
  onEditItem: (index: number, newName: string) => void;
  onRequestBetterPhoto: (itemName: string) => void;
}

export function ScanResults({
  items,
  selectedItems,
  onToggleItem,
  onDeleteItem,
  onEditItem,
  onRequestBetterPhoto,
}: ScanResultsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
        <p className="text-sm">No food items identified. Try a clearer photo or better lighting.</p>
      </div>
    );
  }

  const uncertainItems = items.filter((i) => i.confidence < 0.6);
  const confidentItems = items.filter((i) => i.confidence >= 0.6);

  const startEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditValue(currentName);
  };

  const confirmEdit = (index: number) => {
    if (editValue.trim()) {
      onEditItem(index, editValue.trim());
    }
    setEditingIndex(null);
  };

  const renderItem = (item: ScannedItem, globalIndex: number) => {
    const isEditing = editingIndex === globalIndex;
    const isUncertain = item.confidence < 0.6;
    const itemKey = item.matchedFoodId || item.name;

    return (
      <div
        key={`${item.name}-${globalIndex}`}
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 p-3 transition-all",
          isUncertain && "border-amber-200 bg-amber-50/50",
          !isUncertain && selectedItems.has(itemKey) && "border-emerald-500 bg-emerald-50",
          !isUncertain && !selectedItems.has(itemKey) && "border-gray-200 bg-white"
        )}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selectedItems.has(itemKey)}
          onChange={() => onToggleItem(itemKey)}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
        />

        {/* Name (editable) */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(globalIndex); if (e.key === "Escape") setEditingIndex(null); }}
                className="flex-1 rounded-lg border border-emerald-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                autoFocus
              />
              <button onClick={() => confirmEdit(globalIndex)} className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{item.name}</span>
              {isUncertain && (
                <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                  <AlertTriangle className="h-3 w-3 mr-0.5" />
                  Unsure
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

        {/* Confidence bar */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={cn("h-full rounded-full", {
                "bg-emerald-500": item.confidence >= 0.7,
                "bg-amber-500": item.confidence >= 0.4 && item.confidence < 0.7,
                "bg-red-400": item.confidence < 0.4,
              })}
              style={{ width: `${item.confidence * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 w-7 text-right">
            {Math.round(item.confidence * 100)}%
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isUncertain && (
            <button
              onClick={() => onRequestBetterPhoto(item.name)}
              className="rounded-lg p-1.5 text-amber-500 hover:bg-amber-100 transition-colors cursor-pointer"
              title="Take a better photo of this item"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => startEdit(globalIndex, item.name)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Edit name"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDeleteItem(globalIndex)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {items.length} item{items.length !== 1 ? "s" : ""} identified. Edit, delete, or select the ones you want:
      </p>

      {/* Uncertain items first */}
      {uncertainItems.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Uncertain — please verify ({uncertainItems.length})
          </p>
          {uncertainItems.map((item) => {
            const globalIndex = items.indexOf(item);
            return renderItem(item, globalIndex);
          })}
        </div>
      )}

      {/* Confident items */}
      {confidentItems.length > 0 && (
        <div className="space-y-1.5">
          {uncertainItems.length > 0 && (
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Identified ({confidentItems.length})
            </p>
          )}
          {confidentItems.map((item) => {
            const globalIndex = items.indexOf(item);
            return renderItem(item, globalIndex);
          })}
        </div>
      )}
    </div>
  );
}
