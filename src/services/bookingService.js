import { apiRequest } from "./apiClient.js";

export const createBooking = (token, booking, options = {}) =>
  apiRequest("/bookings", { method: "POST", token, body: booking, ...options });

export const getBookings = (token, { page = 1, limit = 12, status, bookingType, ...options } = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);
  if (bookingType) params.set("bookingType", bookingType);
  return apiRequest(`/bookings?${params}`, { token, ...options });
};

export const getBooking = (token, id, options = {}) =>
  apiRequest(`/bookings/${encodeURIComponent(id)}`, { token, ...options });

export const cancelBooking = (token, id, payload = {}, options = {}) =>
  apiRequest(`/bookings/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
    token,
    body: payload,
    ...options,
  });
