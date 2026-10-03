import { apiRequest } from "./apiClient.js";

export const fetchRecentlyViewed = (token, options) => apiRequest("/recently-viewed", { token, ...options });
export const recordRecentlyViewed = (token, gymId, options) => apiRequest(`/recently-viewed/${encodeURIComponent(gymId)}`, { method: "POST", token, ...options });
export const removeRecentlyViewed = (token, gymId, options) => apiRequest(`/recently-viewed/${encodeURIComponent(gymId)}`, { method: "DELETE", token, ...options });
