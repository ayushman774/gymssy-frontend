/**
 * categoryService.js
 * All category and listing API calls in one place.
 *
 * Base URL reads from env → falls back to production.
 * Never hardcodes localhost.
 */

const BASE = import.meta.env.VITE_API_URL ?? "https://api.gymssy.com/api";

/* ─────────────────────────────────────────────────────
   Internal fetch wrapper
   Handles HTTP errors and JSON parsing consistently.
───────────────────────────────────────────────────── */
const apiFetch = async (path, options = {}) => {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(tid);

    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText} — ${path}`);
    }

    const json = await res.json();

    if (json.success === false) {
      throw new Error(json.message ?? `API returned success:false — ${path}`);
    }

    return json;
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
};

/* ─────────────────────────────────────────────────────
   fetchCategories
   GET /categories
   Returns pre-nested array of main categories.
───────────────────────────────────────────────────── */
export const fetchCategories = async () => {
  const json = await apiFetch("/categories");
  return json.data; // Category[]  (already nested)
};

/* ─────────────────────────────────────────────────────
   fetchCategoryBySlug
   GET /categories/:slug
   Returns a single category object (main or sub).
───────────────────────────────────────────────────── */
export const fetchCategoryBySlug = async (slug) => {
  const json = await apiFetch(`/categories/${slug}`);
  return json.data;
};

/* ─────────────────────────────────────────────────────
   fetchListingsByCategory
   GET /gyms/category/:slug
   Returns listings for a given category slug.
   Supports optional query params (page, limit, sort, etc.)
───────────────────────────────────────────────────── */
export const fetchListingsByCategory = async (slug, params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined,
    ),
  ).toString();

  const path = `/gyms/category/${slug}${qs ? `?${qs}` : ""}`;
  const json = await apiFetch(path);

  return {
    data: json.data ?? json.gyms ?? [],
    total: json.total ?? json.count ?? json.data?.length ?? 0,
    page: json.page ?? 1,
  };
};

/**
 * fetchGymBySlug
 * GET /gyms/:slug
 * Returns a single gym's full detail object.
 */
export const fetchGymBySlug = async (slug) => {
  const json = await apiFetch(`/gyms/${slug}`);
  return json.data;
};

/**
 * fetchSimilarGyms
 * GET /gyms?category=:category&limit=4
 * Returns gyms in the same category (exclude current slug client-side).
 */
export const fetchSimilarGyms = async (category, excludeSlug, limit = 4) => {
  const qs = new URLSearchParams({ limit: limit + 1 }).toString();
  const json = await apiFetch(`/gyms?${qs}`);
  const list = json.data ?? json.gyms ?? [];
  return list.filter((g) => g.slug !== excludeSlug).slice(0, limit);
};

/**
 * fetchFeaturedTrainers
 * GET /trainers/featured
 * Returns array of featured trainer objects.
 */
export const fetchFeaturedTrainers = async () => {
  const json = await apiFetch("/trainers/featured");
  return json.data; // Trainer[]
};

/**
 * fetchTrendingExperiences
 * GET /experiences/trending
 * Returns array of trending experience objects.
 */
export const fetchTrendingExperiences = async () => {
  const json = await apiFetch("/experiences/trending");
  return json.data; // Experience[]
};

/**
 * fetchPopularCities
 * GET /cities/popular
 * Returns array of popular city objects.
 */
export const fetchPopularCities = async () => {
  const json = await apiFetch("/cities/popular");
  return json.data; // City[]
};


/**
 * fetchGymsByCity
 * GET /gyms?city={citySlug}&category={category}
 *
 * category is optional — omit or pass "" to fetch all.
 */
export const fetchGymsByCity = async (citySlug, category = "", extraParams = {}) => {
  const params = {
    city: citySlug,
    ...(category ? { category } : {}),
    ...extraParams,
  };

  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined),
  ).toString();

  const json = await apiFetch(`/gyms${qs ? `?${qs}` : ""}`);

  return {
    data:  json.data  ?? json.gyms ?? [],
    total: json.total ?? json.count ?? 0,
  };
};

/**
 * fetchCityBySlug
 * GET /cities/popular  — finds matching city from the popular list.
 * We reuse the existing popular cities endpoint; no new backend route needed.
 */
export const fetchCityInfo = async (slug) => {
  const json = await apiFetch("/cities/popular");
  const list = json.data ?? [];
  return list.find((c) => c.slug === slug) ?? null;
};