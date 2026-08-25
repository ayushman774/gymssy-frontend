import { useState, useEffect, useCallback, useRef } from "react";
import { fetchGymsByCity, fetchCityInfo } from "../services/categoryService";

/* ── safe location helper ── */
const safeLocation = (raw) => {
  if (!raw) return { area: "", city: "", address: "" };
  if (typeof raw === "string") return { area: raw, city: "", address: raw };
  return raw;
};

/* ── safe reviews helper ── */
const safeReviewCount = (reviews, reviewCount) => {
  if (reviewCount != null) return reviewCount;
  if (typeof reviews === "number") return reviews;
  if (Array.isArray(reviews)) return reviews.length;
  return 0;
};

/* ── normalise a single listing ── */
const normaliseListing = (raw) => ({
  id: raw._id,
  name: raw.name,
  slug: raw.slug,
  category: raw.category ?? "",
  location: safeLocation(raw.location),
  rating: raw.rating ?? 0,
  reviewCount: safeReviewCount(raw.reviews, raw.reviewCount),
  priceFrom: raw.priceFrom ?? null,
  isOpen: raw.openNow ?? raw.isOpen ?? false,
  isVerified: raw.verified ?? raw.isVerified ?? false,
  featured: raw.featured ?? false,
  distance: raw.distance ?? null,
  tags: raw.tags ?? [],
  image: raw.image ?? { url: "", alt: raw.name },
  images: raw.images ?? {
    cover: raw.image?.url ?? "",
    gallery: [],
  },
});

/* ── normalise city metadata ── */
const normaliseCity = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id,
    name: raw.name,
    slug: raw.slug,
    state: raw.state ?? "",
    country: raw.country ?? "",
    gymCount: raw.gymCount ?? "0+",
    image: {
      url: raw.image?.url ?? "",
      alt: raw.image?.alt ?? raw.name,
    },
  };
};

/* ─────────────────────────────────────────────────────── */
const useCityListings = (citySlug, category = "") => {
  const [listings, setListings] = useState([]);
  const [cityInfo, setCityInfo] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cityLoading, setCityLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  /* ── Fetch city metadata once per slug ── */
  useEffect(() => {
    if (!citySlug) return;
    let cancelled = false;
    setCityLoading(true);

    fetchCityInfo(citySlug)
      .then((raw) => {
        if (!cancelled) setCityInfo(normaliseCity(raw));
      })
      .catch(() => {
        /* City info failing must not block the listing display */
        if (!cancelled) setCityInfo(null);
      })
      .finally(() => {
        if (!cancelled) setCityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [citySlug]);

  /* ── Fetch listings — reruns when slug, category, or retryKey changes ── */
  useEffect(() => {
    if (!citySlug) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const { data, total: t } = await fetchGymsByCity(citySlug, category);

        if (!cancelled) {
          const normalised = data
            .filter((g) => g.isActive !== false)
            .map(normaliseListing);

          setListings(normalised);
          setTotal(t || normalised.length);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useCityListings]", err);
          setError(err?.message ?? "Failed to load listings.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [citySlug, category, retryKey]);

  return {
    listings,
    cityInfo,
    total,
    loading,
    cityLoading,
    error,
    refetch,
  };
};

export default useCityListings;
