"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "freshwell-selected-foods";

export function useFoodSelection() {
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedFoods(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedFoods]));
    } catch {
      // Ignore storage errors
    }
  }, [selectedFoods]);

  const toggleFood = useCallback((id: string) => {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const removeFood = useCallback((id: string) => {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFoods(new Set());
  }, []);

  const addFoods = useCallback((ids: string[]) => {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  return {
    selectedFoods,
    toggleFood,
    removeFood,
    clearSelection,
    addFoods,
    selectionCount: selectedFoods.size,
  };
}
