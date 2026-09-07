// src/hooks/useNutritionists.js

import { useState, useEffect, useCallback } from "react";
import { fetchFeaturedNutritionists } from "../services/categoryService";

/**
 * Hook — fetches the featured nutritionists list.
 * Mirrors the architecture of useTrainerDetail.
 */
const useNutritionists = () => {
  const [nutritionists, setNutritionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await fetchFeaturedNutritionists();
        if (!cancelled) setNutritionists(data);
      } catch (err) {
        if (!cancelled) {
          console.error("[useNutritionists]", err);
          setError(err?.message ?? "Failed to load nutritionists.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return { nutritionists, loading, error, refetch };
};

export default useNutritionists;
