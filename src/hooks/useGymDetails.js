// src/hooks/useGymDetails.js

import { useState, useEffect, useCallback } from "react";
import { fetchGymBySlug, fetchSimilarGyms } from "../services/categoryService";

/* ── distance: number → display string ── */
const formatDistance = (d) => {
  if (d == null) return null;
  if (typeof d === "string") return d;
  return d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d} km`;
};

/* ─────────────────────────────────────────────────────────────
   safeReviews
   The API sends either:
     - Array  → [ { user, rating, text, ... } ]   (full gym like Cult Fit)
     - Number → 724                                (lite gym like SARVA)
     - null / undefined

   Returns { reviewList: [], reviewCount: number }
───────────────────────────────────────────────────────────── */
const safeReviews = (raw) => {
  /* Already an array of review objects */
  if (Array.isArray(raw)) {
    return {
      reviewList: raw.map((r, i) => ({ ...r, id: r._id ?? i })),
      reviewCount: raw.length,
    };
  }

  /* A bare number — treat it as the review count, no detail */
  if (typeof raw === "number") {
    return { reviewList: [], reviewCount: raw };
  }

  /* null / undefined / anything else */
  return { reviewList: [], reviewCount: 0 };
};

/* ─────────────────────────────────────────────────────────────
   safeLocation
   The API sends either:
     - Object → { area, city, state, address, ... }  (full gym)
     - String → "HSR Layout"                         (lite gym)
───────────────────────────────────────────────────────────── */
const safeLocation = (raw) => {
  if (!raw)
    return {
      area: "",
      city: "",
      state: "",
      address: "",
      landmark: "",
      parking: "",
    };
  if (typeof raw === "string")
    return {
      area: raw,
      city: "",
      state: "",
      address: raw,
      landmark: "",
      parking: "",
    };
  return raw;
};

/* ─────────────────────────────────────────────────────────────
   normaliseGym
   Handles BOTH lite (listing-style) and full (detail) API shapes.
───────────────────────────────────────────────────────────── */
const normaliseGym = (raw) => {
  const { reviewList, reviewCount } = safeReviews(raw.reviews);

  /*
   * reviewCount precedence:
   *   1. raw.reviewCount  (explicit field — Cult Fit has this)
   *   2. reviewCount from safeReviews (array.length or bare number)
   */
  const finalReviewCount = raw.reviewCount ?? reviewCount;

  return {
    /* identity */
    id: raw._id,
    name: raw.name,
    slug: raw.slug,
    category: raw.category ?? "",

    /* location — string or object */
    location: safeLocation(raw.location),
    coordinates: raw.coordinates ?? null,
    distance: formatDistance(raw.distance),

    /* status */
    isOpen: raw.openNow ?? raw.isOpen ?? false,
    verified: raw.verified ?? raw.isVerified ?? false,
    featured: raw.featured ?? false,

    /* content */
    description: raw.description ?? "",
    highlights: raw.highlights ?? [],
    tags: raw.tags ?? [],

    /* media */
    image: raw.image,
    images: raw.images ?? {
      cover: raw.image?.url ?? "",
      gallery: [],
    },

    /* ratings */
    rating: raw.rating ?? 0,
    reviewCount: finalReviewCount,
    ratingBreakdown: raw.ratingBreakdown ?? [],
    reviews: reviewList, // always an array

    /* pricing */
    priceFrom: raw.priceFrom ?? null,
    memberships: raw.memberships ?? [],

    /* contact */
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    website: raw.website ?? null,

    /* schedule */
    timings: raw.timings ?? [],

    /* people */
    trainers: (raw.trainers ?? []).map((t, i) => ({
      ...t,
      id: t._id ?? t.slug ?? i,
    })),

    /* classes */
    classes: (raw.classes ?? []).map((c, i) => ({
      ...c,
      id: c._id ?? i,
    })),

    /* amenities */
    facilities: (raw.facilities ?? []).map((f, i) => ({
      ...f,
      id: f._id ?? i,
      available: f.available !== false,
    })),
  };
};

/* ─────────────────────────────────────────────────────────────
   HOOK
───────────────────────────────────────────────────────────── */
const useGymDetails = (slug) => {
  const [gym, setGym] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const raw = await fetchGymBySlug(slug);
        const normalised = normaliseGym(raw);

        if (cancelled) return;
        setGym(normalised);

        /* Similar gyms — non-blocking */
        try {
          const rawSimilar = await fetchSimilarGyms(
            normalised.category,
            slug,
            4,
          );
          if (!cancelled) setSimilar(rawSimilar.map(normaliseGym));
        } catch {
          /* similar gyms failing must never break the page */
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useGymDetails]", err);
          setError(err?.message ?? "Failed to load gym details.");
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

  return { gym, similarGyms: similar, loading, error, refetch };
};

export default useGymDetails;
