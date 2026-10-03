import { apiRequest } from "./apiClient.js";

export const fetchFavoriteIds = (token, options) => apiRequest("/favorites/ids", { token, ...options });
export const fetchFavorites = (token, { page = 1, limit = 20, ...options } = {}) => apiRequest(`/favorites?${new URLSearchParams({ page, limit })}`, { token, ...options });
export const saveFavorite = (token, targetType, targetId) => apiRequest("/favorites", { method: "POST", token, body: { targetType, targetId } });
export const unsaveFavorite = (token, targetType, targetId) => apiRequest(`/favorites/${targetType}/${encodeURIComponent(targetId)}`, { method: "DELETE", token });
