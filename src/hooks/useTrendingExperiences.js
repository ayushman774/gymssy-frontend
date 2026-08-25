import { useState, useEffect, useCallback } from "react";
import { fetchTrendingExperiences } from "../services/categoryService";

/* ── duration: number (minutes) → display string ── */
const formatDuration = (d) => {
  if (d == null) return "";
  if (typeof d === "string") return d; // already formatted
  if (d < 60) return `${d} min`;
  const h = Math.floor(d / 60);
  const m = d % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
};

/* ── image: { url, alt } | string → plain string URL ── */
const resolveImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url ?? "";
};

/* ── normalise a single experience ── */
const normaliseExperience = (raw) => ({
  id: raw._id,
  title: raw.title,
  slug: raw.slug,
  category: raw.category ?? "",
  image: resolveImageUrl(raw.image),
  duration: formatDuration(raw.duration),
  level: raw.level ?? "",
  rating: raw.rating ?? 0,
  priceFrom: raw.priceFrom ?? 0,
  spots: raw.spots ?? 0,
  trending: raw.trending ?? false,
  href: `/experiences/${raw.slug}`,
});

/* ─────────────────────────────────────────────────────── */
const useTrendingExperiences = () => {
  const [experiences, setExperiences] = useState([]);
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
        const raw = await fetchTrendingExperiences();

        if (!cancelled) {
          const normalised = raw
            .filter((e) => e.isActive !== false)
            .map(normaliseExperience);

          setExperiences(normalised);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useTrendingExperiences]", err);
          setError(err?.message ?? "Failed to load experiences.");
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

  return { experiences, loading, error, refetch };
};

export default useTrendingExperiences;
