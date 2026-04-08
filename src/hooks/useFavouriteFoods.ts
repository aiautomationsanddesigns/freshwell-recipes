"use client";

import { useState, useCallback, useEffect } from "react";

const FAV_KEY = "freshwell-favourite-foods";
const HIDDEN_KEY = "freshwell-hidden-foods";

export function useFavouriteFoods() {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [hiddenFoods, setHiddenFoods] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const storedFav = localStorage.getItem(FAV_KEY);
      if (storedFav) setFavourites(new Set(JSON.parse(storedFav)));
      const storedHidden = localStorage.getItem(HIDDEN_KEY);
      if (storedHidden) setHiddenFoods(new Set(JSON.parse(storedHidden)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...favourites]));
    } catch { /* ignore */ }
  }, [favourites]);

  useEffect(() => {
    try {
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hiddenFoods]));
    } catch { /* ignore */ }
  }, [hiddenFoods]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // If favouriting, unhide
    setHiddenFoods((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleHidden = useCallback((id: string) => {
    setHiddenFoods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // If hiding, unfavourite
    setFavourites((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isFavourite = useCallback((id: string) => favourites.has(id), [favourites]);
  const isHidden = useCallback((id: string) => hiddenFoods.has(id), [hiddenFoods]);

  return {
    favourites,
    hiddenFoods,
    toggleFavourite,
    toggleHidden,
    isFavourite,
    isHidden,
    favCount: favourites.size,
    hiddenCount: hiddenFoods.size,
  };
}
