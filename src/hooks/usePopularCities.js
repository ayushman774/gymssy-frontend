import { useState, useEffect, useCallback } from "react";
import { fetchPopularCities } from "../services/categoryService";

/* ── image: { url, alt } | string → { src, alt } ── */
const resolveImage = (image, fallbackAlt = "") => {
  if (!image) return { src: "", alt: fallbackAlt };
  if (typeof image === "string") return { src: image, alt: fallbackAlt };
  return { src: image.url ?? "", alt: image.alt ?? fallbackAlt };
};

/* ── normalise a single city ── */
const normaliseCity = (raw) => {
  const { src, alt } = resolveImage(raw.image, raw.name);
  return {
    id: raw._id,
    name: raw.name,
    slug: raw.slug,
    state: raw.state ?? "",
    country: raw.country ?? "",
    image: src,
    imageAlt: alt,
    gymCount: raw.gymCount ?? "0+",
    href: `/cities/${raw.slug}`,
  };
};

/* ─────────────────────────────────────────────────────── */
const usePopularCities = () => {
  const [cities, setCities] = useState([]);
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
        const raw = await fetchPopularCities();

        if (!cancelled) {
          setCities(raw.map(normaliseCity));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[usePopularCities]", err);
          setError(err?.message ?? "Failed to load cities.");
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

  return { cities, loading, error, refetch };
};

export default usePopularCities;
