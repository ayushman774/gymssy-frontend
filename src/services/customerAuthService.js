import { apiRequest, API_BASE } from "./apiClient.js";

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

export const uploadCustomerPhoto = async (token, file) => {
  const form = new FormData();
  form.append("photo", file);
  let response;
  try {
    response = await fetch(`${API_BASE}/auth/profile/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: form,
    });
  } catch {
    throw new Error("Unable to reach Gymssy. Please try again.");
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || "Photo upload failed.");
  }
  return payload;
};
