/**
 * useCategoriesData.js
 *
 * Fetches the pre-nested categories API response and normalises
 * each item into the shape that MainCategoryCard and
 * SubcategoryChip already expect — so those components stay
 * completely unchanged.
 *
 * API shape IN  (already nested):
 *   {
 *     _id, name, slug, icon, description,
 *     image: { url: string, alt: string },
 *     isActive, order,
 *     subcategories: [
 *       { _id, name, slug, icon, description, count, image, isActive, order }
 *     ]
 *   }
 *
 * Normalised shape OUT (what the cards consume):
 *   {
 *     id,           ← _id
 *     title,        ← name
 *     slug,
 *     description,
 *     icon,         ← icon name string e.g. "Dumbbell"
 *     image: { url, alt },
 *     accentColor,  ← derived from slug
 *     subcategories: [
 *       {
 *         id,       ← _id
 *         title,    ← name
 *         slug,
 *         description,
 *         icon,
 *         count,
 *         image: { url, alt }
 *       }
 *     ]
 *   }
 */

import { useState, useEffect } from "react";
import { fetchCategories } from "../services/categoryService";

/* ─────────────────────────────────────────────────────────────
   ACCENT COLOR MAP
   Slug → brand colour already used on each category page.
   fitness  → neon green  (#a3ff12) — Fitness page accent
   wellness → soft purple (#c084fc) — Wellness page accent
   sports   → sky blue   (#38bdf8) — Sports page accent
───────────────────────────────────────────────────────────── */
const ACCENT_MAP = {
  fitness:  "#a3ff12",
  wellness: "#c084fc",
  sports:   "#38bdf8",
};

const DEFAULT_ACCENT = "#a3ff12";

/* ─────────────────────────────────────────────────────────────
   normaliseSubcategory
   Maps a single API subcategory object → card-ready shape.
───────────────────────────────────────────────────────────── */
const normaliseSubcategory = (sub) => ({
  id:          sub._id,
  title:       sub.name,          // ← API uses "name", cards expect "title"
  slug:        sub.slug,
  description: sub.description ?? "",
  icon:        sub.icon ?? "Dumbbell",
  count:       sub.count ?? 0,
  image: {
    url: sub.image?.url ?? "",
    alt: sub.image?.alt ?? sub.name,
  },
});

/* ─────────────────────────────────────────────────────────────
   normaliseMain
   Maps a single API main-category object → card-ready shape.
───────────────────────────────────────────────────────────── */
const normaliseMain = (main) => ({
  id:          main._id,
  title:       main.name,         // ← API "name" → "title"
  slug:        main.slug,
  description: main.description ?? "",
  icon:        main.icon ?? "Dumbbell",
  accentColor: ACCENT_MAP[main.slug] ?? DEFAULT_ACCENT,

  // ── Image: API returns { url, alt } — pass through as-is ──
  image: {
    url: main.image?.url ?? "",
    alt: main.image?.alt ?? main.name,
  },

  // ── Subcategories: already embedded by the API ──
  subcategories: Array.isArray(main.subcategories)
    ? main.subcategories
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(normaliseSubcategory)
    : [],
});

/* ─────────────────────────────────────────────────────────────
   HOOK
───────────────────────────────────────────────────────────── */
const useCategoriesData = (retryKey = 0) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const raw = await fetchCategories();

        if (!cancelled) {
          const normalised = raw
            .filter((c) => c.type === "main" && c.isActive !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(normaliseMain);

          setMainCategories(normalised);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useCategoriesData]", err);
          setError(
            err?.message ?? "Failed to load categories. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [retryKey]);

  return { mainCategories, loading, error };
};

export default useCategoriesData;