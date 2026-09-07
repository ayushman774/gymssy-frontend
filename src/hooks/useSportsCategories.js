// src/hooks/useSportsCategories.js
//
// Fetches Sports subcategories from the existing Categories API.
// Reuses fetchCategories() from categoryService — no new fetch logic.
// Falls back to SPORTS_SUBCATEGORIES if the API fails.

import { useState, useEffect, useCallback } from "react";
import { fetchCategories } from "../services/categoryService";
import { SPORTS_SUBCATEGORIES } from "../assets/data/sportsData";

/* ─────────────────────────────────────────────────────
   normalizeSportsCategory
   Converts a backend subcategory object into the shape
   that SportsCategories.jsx card already expects:

   Backend:                     Card expects:
   ─────────────────────────    ──────────────────────
   _id / id / slug         →   id
   name                    →   title
   slug                    →   slug
   description             →   description
   count  (number)         →   count  ("320+")
   image.url / image.alt   →   image  (string URL only)
                               imageAlt (string)
───────────────────────────────────────────────────── */
const normalizeSportsCategory = (category) => ({
  id: category._id ?? category.id ?? category.slug,
  title: category.name,
  slug: category.slug,
  description: category.description ?? "",

  // Backend count is a number → format as "320+"
  // If count is 0 or missing, omit the "+" to avoid "0+"
  count:
    typeof category.count === "number" && category.count > 0
      ? `${category.count}+`
      : (category.count ?? ""),

  // image must be a plain string — card renders src={sport.image}
  image: category.image?.url ?? "",
  imageAlt: category.image?.alt ?? category.name ?? "",
});

/* ─────────────────────────────────────────────────────
   useSportsCategories
   Returns:
     categories : normalized array ready for card rendering
     loading    : boolean
     error      : string | null
     refetch    : () => void
───────────────────────────────────────────────────── */
const useSportsCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const refetch = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchCategories()
      .then((data) => {
        if (cancelled) return;

        // data is already the unwrapped array from categoryService:
        // fetchCategories() returns json.data  → Category[]
        const allCategories = Array.isArray(data) ? data : [];

        // Extract Sports main category
        const sportsCategory = allCategories.find(
          (cat) => cat.slug === "sports",
        );

        const subcategories = sportsCategory?.subcategories ?? [];

        if (subcategories.length === 0) {
          // API returned Sports but with no subcategories — use fallback
          console.warn(
            "[useSportsCategories] No subcategories found for sports — using fallback",
          );
          setCategories(SPORTS_SUBCATEGORIES);
          return;
        }

        // Normalize each subcategory to the shape the card expects
        const normalized = subcategories
          .filter((cat) => cat?.isActive !== false) // respect isActive flag
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) // respect order field
          .map(normalizeSportsCategory);

        setCategories(normalized);
      })
      .catch((err) => {
        if (cancelled) return;

        console.error(
          "[useSportsCategories] API failed — using fallback:",
          err,
        );

        // Graceful fallback to existing static data
        setCategories(SPORTS_SUBCATEGORIES);
        setError(err?.message ?? "Failed to load sports categories.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return { categories, loading, error, refetch };
};

export default useSportsCategories;
