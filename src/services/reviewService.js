import { apiRequest } from "./apiClient.js";

const TYPES = new Set(["gym", "trainer", "nutritionist"]);

function reviewPath(type, id) {
  if (!TYPES.has(type) || !/^[a-f\d]{24}$/i.test(String(id || ""))) {
    throw new Error("A valid Gymssy listing is required for reviews.");
  }
  return `/reviews/${type}/${id}`;
}

export function fetchListingReviews(type, id, { page = 1, limit = 10, signal } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiRequest(`${reviewPath(type, id)}?${params}`, { signal });
}

export function submitListingReview(token, type, id, { rating, title = "", text }) {
  return apiRequest(reviewPath(type, id), {
    method: "POST",
    token,
    body: { rating, title, text },
  });
}

export function editListingReview(token, type, id, { rating, title = "", text }) {
  return apiRequest(reviewPath(type, id), {
    method: "PATCH",
    token,
    body: { rating, title, text },
  });
}

export function deleteListingReview(token, type, id) {
  return apiRequest(reviewPath(type, id), { method: "DELETE", token });
}
