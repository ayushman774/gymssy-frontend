import { useState, useEffect, useCallback } from "react";
import { fetchFeaturedTrainers } from "../services/categoryService";
import { normaliseFeaturedTrainer } from "../utils/homeMarketplace.js";

/* ─────────────────────────────────────────────────────── */
const useFeaturedTrainers = () => {
  const [state, setState] = useState({ trainers: [], error: null, resolvedKey: null });
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const raw = await fetchFeaturedTrainers();

        if (!cancelled) {
          const normalised = raw
            .filter((t) => t.isActive !== false)
            .map(normaliseFeaturedTrainer);

          setState({ trainers: normalised, error: null, resolvedKey: retryKey });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useFeaturedTrainers]", err);
          setState({ trainers: [], error: err?.message ?? "Failed to load trainers.", resolvedKey: retryKey });
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return {
    trainers: state.trainers,
    loading: state.resolvedKey !== retryKey,
    error: state.resolvedKey === retryKey ? state.error : null,
    refetch,
  };
};

export default useFeaturedTrainers;
