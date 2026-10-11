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
    const error = new Error(payload?.message || (response.status === 404 ? "Photo upload API not found. Deploy the latest Gymssy backend and verify VITE_API_URL." : response.status === 413 ? "Image is too large for the upload server. Choose a smaller image." : response.status === 401 ? "Your session has expired. Sign in again." : `Photo upload failed (HTTP ${response.status}).`));
    error.status = response.status;
    throw error;
  }
  if (!payload?.data?.user?.avatar?.url) throw new Error("Upload succeeded but no image URL was returned.");
  return payload;
};
