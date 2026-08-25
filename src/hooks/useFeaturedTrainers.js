import { useState, useEffect, useCallback } from "react";
import { fetchFeaturedTrainers } from "../services/categoryService";

/* ── image: { url, alt } | string → plain string URL ── */
const resolveImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url ?? "";
};

/* ── normalise a single trainer ── */
const normaliseTrainer = (raw) => ({
  id: raw._id,
  name: raw.name,
  slug: raw.slug,
  specialization: raw.specialization ?? "",
  experience: raw.experience ?? 0,
  rating: raw.rating ?? 0,
  reviewCount: raw.reviewCount ?? 0,
  image: resolveImageUrl(raw.image), // TrainerCard expects a string
  pricePerSession: raw.pricePerSession ?? 0,
  available: raw.available ?? false,
  isVerified: raw.isVerified ?? raw.verified ?? false,
  href: `/trainers/${raw.slug}`,
});

/* ─────────────────────────────────────────────────────── */
const useFeaturedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
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
        const raw = await fetchFeaturedTrainers();

        if (!cancelled) {
          const normalised = raw
            .filter((t) => t.isActive !== false)
            .map(normaliseTrainer);

          setTrainers(normalised);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useFeaturedTrainers]", err);
          setError(err?.message ?? "Failed to load trainers.");
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

  return { trainers, loading, error, refetch };
};

export default useFeaturedTrainers;
