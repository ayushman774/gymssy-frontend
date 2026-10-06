import { fetchCategories } from "./categoryService.js";
import { GLOBAL_SEARCH_LIMIT, GLOBAL_SEARCH_MIN_LENGTH } from "../utils/globalSearch.js";

const configuredBase = import.meta.env?.VITE_API_URL ?? "https://api.gymssy.com/api";
const API_BASE = configuredBase.replace(/\/$/, "");

export class DiscoveryApiError extends Error {
  constructor(message, { status = 0, errors = [], cause } = {}) {
    super(message, { cause });
    this.name = "DiscoveryApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function buildDiscoveryQuery(filters = {}) {
  const params = new URLSearchParams();
  for (const field of ["search", "category", "subcategory", "type", "entity", "city", "sort", "page", "limit", "lat", "lng", "radius"]) {
    const value = filters[field];
    if (value === undefined || value === null || String(value).trim() === "") continue;
    params.set(field, String(value).trim());
  }
  return params.toString();
}

async function request(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" }, signal });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new DiscoveryApiError("Unable to reach the Gymssy marketplace.", { cause: error });
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new DiscoveryApiError("The marketplace returned an invalid response.", { status: response.status });
  }
  if (!response.ok || payload?.success === false) {
    throw new DiscoveryApiError(payload?.message || "Unable to load marketplace listings.", {
      status: response.status,
      errors: Array.isArray(payload?.errors) ? payload.errors : [],
    });
  }
  return payload;
}

export async function fetchDiscovery(filters, options) {
  const query = buildDiscoveryQuery(filters);
  const payload = await request(`/discover${query ? `?${query}` : ""}`, options);
  if (!Array.isArray(payload?.data) || !payload?.pagination) {
    throw new DiscoveryApiError("The marketplace returned an unexpected response.");
  }
  return { listings: payload.data, pagination: payload.pagination };
}

export async function searchMarketplace(query, options) {
  const search = String(query || "").trim();
  if (search.length < GLOBAL_SEARCH_MIN_LENGTH) {
    return {
      listings: [],
      pagination: { page: 1, limit: GLOBAL_SEARCH_LIMIT, total: 0, totalPages: 0 },
    };
  }
  return fetchDiscovery({ search, page: 1, limit: GLOBAL_SEARCH_LIMIT }, options);
}

export async function fetchDiscoveryReferences(options) {
  const [categories, cityPayload] = await Promise.all([
    fetchCategories(options),
    request("/cities", options),
  ]);
  return {
    categories: Array.isArray(categories) ? categories : [],
    cities: Array.isArray(cityPayload?.data) ? cityPayload.data : [],
  };
}
