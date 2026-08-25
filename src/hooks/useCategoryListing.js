/**
 * useCategoryListing.js
 *
 * Fetches:
 *   1. Category metadata  → GET /categories/:slug
 *   2. Category listings  → GET /gyms/category/:slug
 *
 * Exposes clean loading / error / data states.
 * Retry is supported via retryKey.
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchCategoryBySlug,
  fetchListingsByCategory,
} from "../services/categoryService";

const useCategoryListing = (slug, queryParams = {}) => {
  const [category, setCategory] = useState(null);
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        /* Run both requests in parallel */
        const [cat, listing] = await Promise.allSettled([
          fetchCategoryBySlug(slug),
          fetchListingsByCategory(slug, queryParams),
        ]);

        if (cancelled) return;

        /* Category metadata */
        if (cat.status === "fulfilled") {
          setCategory(cat.value);
        } else {
          /* Non-fatal: category metadata unavailable, still show listings */
          console.warn(
            "[useCategoryListing] category fetch failed:",
            cat.reason,
          );
          setCategory(null);
        }

        /* Listings */
        if (listing.status === "fulfilled") {
          setListings(listing.value.data);
          setTotal(listing.value.total);
        } else {
          throw listing.reason;
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useCategoryListing]", err);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, retryKey]);

  return { category, listings, total, loading, error, retry };
};

export default useCategoryListing;
