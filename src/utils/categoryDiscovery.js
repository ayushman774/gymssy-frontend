import { isProfessionalType } from "./discoveryState.js";

const TYPES = new Set(["gym", "fitness_centre", "wellness_centre", "sports_academy", "studio", "trainer", "coach", "nutritionist"]);
const SORTS = new Set(["recommended", "rating", "reviews", "newest"]);

export function resolveCategorySlug(slug, categories = []) {
  const normalized = String(slug || "").trim().toLowerCase();
  for (const mainCategory of categories) {
    if (mainCategory.isActive === false) continue;
    if (mainCategory.slug === normalized) return { category: mainCategory, mainCategory, subcategory: null };
    const subcategory = (mainCategory.subcategories || []).find((item) => item.isActive !== false && item.slug === normalized);
    if (subcategory) return { category: subcategory, mainCategory, subcategory };
  }
  return null;
}

export function readCategoryDiscoveryUrl(search = "") {
  const params = new URLSearchParams(search);
  return {
    search: (params.get("search") || params.get("q") || "").trim(),
    type: (params.get("type") || "").trim().toLowerCase(),
    city: (params.get("city") || "").trim().toLowerCase(),
    sort: (params.get("sort") || "recommended").trim().toLowerCase(),
    page: Math.max(Number.parseInt(params.get("page") || "1", 10) || 1, 1),
    limit: 20,
  };
}

export function validateCategoryDiscoveryState(filters, cities = []) {
  const next = { ...filters };
  if (!TYPES.has(next.type)) next.type = "";
  if (!SORTS.has(next.sort)) next.sort = "recommended";
  const city = cities.find((item) => item.slug === next.city || item.name?.trim().toLowerCase() === next.city);
  next.city = city?.slug || "";
  if (next.city && isProfessionalType(next.type)) next.type = "";
  return next;
}

export function buildCategoryDiscoveryFilters(resolution, filters) {
  if (!resolution) return filters;
  return {
    ...filters,
    category: resolution.mainCategory.slug,
    subcategory: resolution.subcategory?.slug || "",
  };
}

export function changeCategoryDiscoveryFilter(filters, field, value) {
  const next = { ...filters, [field]: value, page: 1 };
  if (field === "type" && isProfessionalType(value)) next.city = "";
  return next;
}

export function categoryDiscoveryUrlSearch(filters) {
  const params = new URLSearchParams();
  for (const field of ["search", "type", "city", "sort"]) {
    const value = filters[field];
    if (!value || (field === "sort" && value === "recommended")) continue;
    params.set(field, value);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function clearCategoryDiscoveryFilters() {
  return { search: "", type: "", city: "", sort: "recommended", page: 1, limit: 20 };
}
