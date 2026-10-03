export const GLOBAL_SEARCH_MIN_LENGTH = 2;
export const GLOBAL_SEARCH_LIMIT = 6;
export const GLOBAL_SEARCH_DEBOUNCE_MS = 300;

export function normalizeGlobalSearch(value) {
  return String(value || "").trim();
}

export function globalSearchUrl(value) {
  const search = normalizeGlobalSearch(value);
  if (!search) return "/discover";
  const params = new URLSearchParams({ search });
  return `/discover?${params.toString()}`;
}

export function moveSuggestionIndex(current, direction, count) {
  if (!count) return -1;
  if (direction === "next") return current >= count - 1 ? 0 : current + 1;
  return current <= 0 ? count - 1 : current - 1;
}

export function suggestionMeta(item) {
  if (item.location) return [item.location.area, item.location.city?.name].filter(Boolean).join(", ");
  return [item.summary?.role, item.summary?.specialty].filter(Boolean).join(" · ");
}
