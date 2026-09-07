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
  return json.data;
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

/* ─────────────────────────────────────────────────────
   fetchGymBySlug
   GET /gyms/:slug
   Returns a single gym's full detail object.
───────────────────────────────────────────────────── */
export const fetchGymBySlug = async (slug) => {
  const json = await apiFetch(`/gyms/${slug}`);
  return json.data;
};

/* ─────────────────────────────────────────────────────
   fetchSimilarGyms
   GET /gyms?limit=n
   Returns gyms in the same category, excluding current slug.
───────────────────────────────────────────────────── */
export const fetchSimilarGyms = async (category, excludeSlug, limit = 4) => {
  const qs = new URLSearchParams({ limit: limit + 1 }).toString();
  const json = await apiFetch(`/gyms?${qs}`);
  const list = json.data ?? json.gyms ?? [];
  return list.filter((g) => g.slug !== excludeSlug).slice(0, limit);
};

/* ─────────────────────────────────────────────────────
   fetchFeaturedTrainers
   GET /trainers/featured
   Returns array of featured trainer objects.
───────────────────────────────────────────────────── */
export const fetchFeaturedTrainers = async () => {
  const json = await apiFetch("/trainers/featured");
  return json.data;
};

/* ─────────────────────────────────────────────────────
   fetchTrendingExperiences
   GET /experiences/trending
   Returns array of trending experience objects.
───────────────────────────────────────────────────── */
export const fetchTrendingExperiences = async () => {
  const json = await apiFetch("/experiences/trending");
  return json.data;
};

/* ─────────────────────────────────────────────────────
   fetchPopularCities
   GET /cities/popular
   Returns array of popular city objects.
───────────────────────────────────────────────────── */
export const fetchPopularCities = async () => {
  const json = await apiFetch("/cities/popular");
  return json.data;
};

/* ─────────────────────────────────────────────────────
   fetchGymsByCity
   GET /gyms?city={citySlug}&category={category}
───────────────────────────────────────────────────── */
export const fetchGymsByCity = async (
  citySlug,
  category = "",
  extraParams = {},
) => {
  const params = {
    city: citySlug,
    ...(category ? { category } : {}),
    ...extraParams,
  };

  const qs = new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined,
    ),
  ).toString();

  const json = await apiFetch(`/gyms${qs ? `?${qs}` : ""}`);

  return {
    data: json.data ?? json.gyms ?? [],
    total: json.total ?? json.count ?? 0,
  };
};

/* ─────────────────────────────────────────────────────
   fetchCityInfo
   GET /cities/popular — finds matching city by slug.
───────────────────────────────────────────────────── */
export const fetchCityInfo = async (slug) => {
  const json = await apiFetch("/cities/popular");
  const list = json.data ?? [];
  return list.find((c) => c.slug === slug) ?? null;
};

/* ─────────────────────────────────────────────────────
   fetchTrainerBySlug
   GET /trainers/:slug
   Returns a single trainer's full detail object.
───────────────────────────────────────────────────── */
export const fetchTrainerBySlug = async (slug) => {
  const json = await apiFetch(`/trainers/${slug}`);
  return json.data;
};

/* ─────────────────────────────────────────────────────
   fetchWellnessExperiences
   GET /experiences/trending?type=wellness
───────────────────────────────────────────────────── */
export const fetchWellnessExperiences = async () => {
  const json = await apiFetch("/experiences/trending?type=wellness");

  const raw = json.data ?? [];

  return raw
    .filter((exp) => exp?.isActive !== false)
    .slice(0, 6)
    .map((exp) => ({
      ...exp,
      id: exp._id,
      image: exp.image?.url ?? "",
      duration:
        typeof exp.duration === "number" ? `${exp.duration} min` : exp.duration,
    }));
};

/* ─────────────────────────────────────────────────────
   fetchFeaturedWellnessCenters
   GET /gyms/featured?type=wellness
───────────────────────────────────────────────────── */
export const fetchFeaturedWellnessCenters = async () => {
  const json = await apiFetch("/gyms/featured?type=wellness");

  const raw = json.data ?? [];

  return raw
    .filter((gym) => gym?.isActive !== false)
    .slice(0, 6)
    .map((gym) => ({
      ...gym,
      id: gym._id ?? gym.id,
      image: gym.image?.url
        ? gym.image
        : {
            url: gym.images?.cover ?? gym.images?.gallery?.[0]?.url ?? "",
            alt: gym.name ?? "",
          },
      location:
        typeof gym.location === "string"
          ? gym.location
          : gym.location?.area && gym.location?.city
            ? `${gym.location.area}, ${gym.location.city}`
            : (gym.location?.city ?? gym.location?.area ?? ""),
      reviews:
        typeof gym.reviews === "number"
          ? gym.reviews
          : (gym.reviewCount ??
            (Array.isArray(gym.reviews) ? gym.reviews.length : 0)),
    }));
};

/* ─────────────────────────────────────────────────────
   fetchFeaturedNutritionists                     ← SINGLE definition
   GET /nutritionists/featured
   Returns raw API objects with safe fallbacks applied.
   NutritionistCard reads image.src, image.srcSet, image.sizes, image.alt
   directly — do NOT flatten image to a string here.
───────────────────────────────────────────────────── */
export const fetchFeaturedNutritionists = async () => {
  const json = await apiFetch("/nutritionists/featured");

  const raw = Array.isArray(json.data) ? json.data : [];

  return raw
    .filter((n) => n?.isActive !== false)
    .map((n) => ({
      ...n,
      // Stable id for React keys
      id: n._id ?? n.id,

      // Keep image as the original object so NutritionistCard can read
      // image.src / image.srcSet / image.sizes / image.alt safely.
      // If the API ever returns image as a plain string, wrap it.
      image:
        n.image && typeof n.image === "object"
          ? n.image
          : { src: n.image ?? "", alt: n.name ?? "" },

      // Safe numeric/array fallbacks
      rating: n.rating ?? 0,
      reviews: n.reviews ?? 0,
      consultationFee: n.consultationFee ?? 0,
      currency: n.currency ?? "₹",
      specializations: Array.isArray(n.specializations)
        ? n.specializations
        : [],
      certifications: Array.isArray(n.certifications) ? n.certifications : [],
      dietTypes: Array.isArray(n.dietTypes) ? n.dietTypes : [],
      languages: Array.isArray(n.languages) ? n.languages : [],
    }));
};

/* ─────────────────────────────────────────────────────
   fetchNutritionistBySlug
   GET /nutritionists/:slug
   Returns a single nutritionist's full detail object.
   Returns null if not found (caller renders NotFound).
───────────────────────────────────────────────────── */
export const fetchNutritionistBySlug = async (slug) => {
  const json = await apiFetch(`/nutritionists/${slug}`);
  return json.data ?? null;
};
