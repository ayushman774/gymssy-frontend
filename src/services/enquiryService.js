import { apiRequest } from "./apiClient.js";

export const createEnquiry = (token, enquiry) => apiRequest("/enquiries", { method: "POST", token, body: enquiry });
export const fetchMyEnquiries = (token, { page = 1, limit = 20, ...options } = {}) => apiRequest(`/enquiries?${new URLSearchParams({ page, limit })}`, { token, ...options });
