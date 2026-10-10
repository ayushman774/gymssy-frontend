export const DISCOVERY_TYPES = Object.freeze([
  ["gym", "Gym"], ["fitness_centre", "Fitness Centre"], ["wellness_centre", "Wellness Centre"],
  ["sports_academy", "Sports Academy"], ["studio", "Studio"], ["trainer", "Trainer"],
  ["coach", "Coach"], ["nutritionist", "Nutritionist"],
]);

export const DISCOVERY_SORTS = Object.freeze([
  ["recommended", "Recommended"], ["rating", "Rating"], ["reviews", "Reviews"], ["newest", "Newest"],
]);

const PROFESSIONAL_TYPES = new Set(["trainer", "coach", "nutritionist"]);
const TYPE_VALUES = new Set(DISCOVERY_TYPES.map(([value]) => value));
const SORT_VALUES = new Set(DISCOVERY_SORTS.map(([value]) => value));

export function readDiscoveryUrl(search = "") {
  const params = new URLSearchParams(search);
  return {
    search: (params.get("search") || params.get("q") || "").trim(),
    category: (params.get("category") || "").trim().toLowerCase(),
    subcategory: (params.get("subcategory") || "").trim().toLowerCase(),
    type: (params.get("type") || "").trim().toLowerCase(),
    entity: (params.get("entity") || "").trim().toLowerCase(),
    collection: (params.get("collection") || "").trim().toLowerCase(),
    city: (params.get("city") || "").trim().toLowerCase(),
    sort: (params.get("sort") || "recommended").trim().toLowerCase(),
    page: Math.max(Number.parseInt(params.get("page") || "1", 10) || 1, 1),
    limit: 6,
  };
}

export function validateDiscoveryState(filters, categories = [], cities = []) {
  const next = { ...filters };
  if (!["beginner-gyms", "top-trainers", "womens-studios", "premium-clubs", "budget-gyms", "luxury-wellness"].includes(next.collection)) next.collection = "";
  if (["fitness", "wellness", "sports"].includes(next.type) && !next.category) {
    next.category = next.type;
    next.type = "";
  }
  let category = categories.find((item) => item.slug === next.category);
  if (!category && next.category) {
    const parent = categories.find((item) => (item.subcategories || []).some((subcategory) => subcategory.slug === next.category));
    if (parent) {
      next.subcategory = next.category;
      next.category = parent.slug;
      category = parent;
    }
  }
  if (!category) next.category = "";
  const subcategories = category?.subcategories || [];
  if (!subcategories.some((item) => item.slug === next.subcategory)) next.subcategory = "";
  if (!TYPE_VALUES.has(next.type)) next.type = "";
  if (next.entity !== "venue") next.entity = "";
  if (!SORT_VALUES.has(next.sort)) next.sort = "recommended";
  const city = cities.find((item) => item.slug === next.city || item.name?.trim().toLowerCase() === next.city);
  next.city = city?.slug || "";
  if (next.city && PROFESSIONAL_TYPES.has(next.type)) next.type = "";
  return next;
}

export function changeDiscoveryFilter(filters, field, value) {
  const next = { ...filters, [field]: value, page: 1, collection: "" };
  if (field === "category") next.subcategory = "";
  if (field === "type" && PROFESSIONAL_TYPES.has(value)) next.city = "";
  return next;
}

export function discoveryUrlSearch(filters) {
  const params = new URLSearchParams();
  for (const field of ["search", "category", "subcategory", "type", "entity", "city", "sort", "collection"]) {
    const value = filters[field];
    if (!value || (field === "sort" && value === "recommended")) continue;
    params.set(field, value);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function clearDiscoveryFilters() {
  return { search: "", category: "", subcategory: "", type: "", entity: "", city: "", collection: "", sort: "recommended", page: 1, limit: 6 };
}

export function isProfessionalType(type) {
  return PROFESSIONAL_TYPES.has(type);
}
