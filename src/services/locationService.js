import { apiRequest } from "./apiClient.js";

export const LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH = 2;
export const LOCATION_AUTOCOMPLETE_LIMIT = 5;
export const LOCATION_AUTOCOMPLETE_ENDPOINT = "/locations/autocomplete";

export async function loadLocationSuggestions(query, request = apiRequest, { signal } = {}) {
  const normalizedQuery = typeof query === "string" ? query.trim().replace(/\s+/g, " ") : "";
  if (normalizedQuery.length < LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH) return [];
  const params = new URLSearchParams({ q: normalizedQuery, limit: String(LOCATION_AUTOCOMPLETE_LIMIT) });
  const payload = await request(`${LOCATION_AUTOCOMPLETE_ENDPOINT}?${params}`, { method: "GET", signal });
  return Array.isArray(payload?.data) ? payload.data.slice(0, LOCATION_AUTOCOMPLETE_LIMIT) : [];
}

export async function reverseDeviceLocation(latitude, longitude, request = apiRequest) {
  const params = new URLSearchParams({ lat: String(latitude), lng: String(longitude) });
  const payload = await request(`/locations/reverse?${params}`, { method: "GET" });
  return payload?.data || null;
}
