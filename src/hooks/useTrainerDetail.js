import { useState, useEffect, useCallback } from "react";
import { fetchTrainerBySlug } from "../services/categoryService";

const useTrainerDetail = (slug) => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setTrainer(null); // clear stale data immediately on slug change

    const load = async () => {
      try {
        const data = await fetchTrainerBySlug(slug);

        if (!cancelled) {
          setTrainer(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useTrainerDetail]", err);
          setError(err?.message ?? "Failed to load trainer.");
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

  return { trainer, loading, error, refetch };
};

export default useTrainerDetail;
