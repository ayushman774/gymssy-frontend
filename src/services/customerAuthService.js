import { apiRequest } from "./apiClient.js";

export const loginCustomer = (credentials, options) =>
  apiRequest("/auth/login", { method: "POST", body: credentials, ...options });

export const registerCustomer = (details, options) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: { accountType: "user", ...details },
    ...options,
  });

export const fetchCurrentCustomer = (token, options) =>
  apiRequest("/auth/me", { token, ...options });

export const saveCustomerProfile = (token, details) =>
  apiRequest("/auth/profile", { method: "PATCH", token, body: details });
