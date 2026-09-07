// src/hooks/useNutritionistDetail.js

import { useState, useEffect, useCallback } from "react";
import { fetchNutritionistBySlug } from "../services/categoryService";

/**
 * Hook — fetches a single nutritionist by slug.
 * Mirrors useTrainerDetail exactly.
 */
const useNutritionistDetail = (slug) => {
  const [nutritionist, setNutritionist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNutritionist(null); // clear stale data on slug change

    const load = async () => {
      try {
        const data = await fetchNutritionistBySlug(slug);
        if (!cancelled) setNutritionist(data);
      } catch (err) {
        if (!cancelled) {
          console.error("[useNutritionistDetail]", err);
          setError(err?.message ?? "Failed to load nutritionist.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, retryKey]);

  return { nutritionist, loading, error, refetch };
};

export default useNutritionistDetail;
