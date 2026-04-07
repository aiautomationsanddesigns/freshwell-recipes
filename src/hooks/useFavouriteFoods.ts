"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "freshwell-favourite-foods";

export function useFavouriteFoods() {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavourites(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favourites]));
    } catch { /* ignore */ }
  }, [favourites]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (id: string) => favourites.has(id),
    [favourites]
  );

  return { favourites, toggleFavourite, isFavourite, count: favourites.size };
}
