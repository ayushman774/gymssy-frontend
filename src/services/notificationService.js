import { apiRequest } from "./apiClient.js";

export const getNotifications = (token, page = 1) =>
  apiRequest(`/notifications?page=${page}`, { token });

export const markNotificationRead = (token, id) =>
  apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH", token });

export const markAllNotificationsRead = (token) =>
  apiRequest("/notifications/read-all", { method: "PATCH", token });
