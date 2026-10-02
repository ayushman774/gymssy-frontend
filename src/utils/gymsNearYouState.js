import { DISCOVERY_SORTS } from "./discoveryState.js";

export const VENUE_TYPES = Object.freeze([
  ["gym", "Gym"],
  ["fitness_centre", "Fitness Centre"],
  ["wellness_centre", "Wellness Centre"],
  ["sports_academy", "Sports Academy"],
  ["studio", "Studio"],
]);

const TYPE_VALUES = new Set(VENUE_TYPES.map(([value]) => value));
const SORT_VALUES = new Set(DISCOVERY_SORTS.map(([value]) => value));

export function readGymsNearYouUrl(search = "") {
  const params = new URLSearchParams(search);
  return {
    search: (params.get("search") || params.get("q") || "").trim(),
    city: (params.get("city") || "").trim().toLowerCase(),
    category: (params.get("category") || "").trim().toLowerCase(),
    subcategory: (params.get("subcategory") || "").trim().toLowerCase(),
    type: (params.get("type") || "").trim().toLowerCase(),
    sort: (params.get("sort") || "recommended").trim().toLowerCase(),
    page: Math.max(Number.parseInt(params.get("page") || "1", 10) || 1, 1),
    limit: 12,
  };
}

export function validateGymsNearYouState(filters, categories = [], cities = []) {
  const next = { ...filters };
  const category = categories.find((item) => item.isActive !== false && item.slug === next.category);
  next.category = category?.slug || "";
  if (!(category?.subcategories || []).some((item) => item.isActive !== false && item.slug === next.subcategory)) next.subcategory = "";
  const city = cities.find((item) => item.isActive !== false && (item.slug === next.city || item.name?.trim().toLowerCase() === next.city));
  next.city = city?.slug || "";
  if (!TYPE_VALUES.has(next.type)) next.type = "";
  if (!SORT_VALUES.has(next.sort)) next.sort = "recommended";
  return next;
}

export function buildGymsNearYouFilters(filters) {
  return { ...filters, entity: "venue" };
}

export function changeGymsNearYouFilter(filters, field, value) {
  const next = { ...filters, [field]: value, page: 1 };
  if (field === "category") next.subcategory = "";
  return next;
}

export function gymsNearYouUrlSearch(filters) {
  const params = new URLSearchParams();
  for (const field of ["search", "city", "category", "subcategory", "type", "sort"]) {
    const value = filters[field];
    if (!value || (field === "sort" && value === "recommended")) continue;
    params.set(field, value);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function clearGymsNearYouFilters() {
  return { search: "", city: "", category: "", subcategory: "", type: "", sort: "recommended", page: 1, limit: 12 };
}
