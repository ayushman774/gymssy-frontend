const configuredBase = import.meta.env?.VITE_API_URL ?? "https://api.gymssy.com/api";
export const API_BASE = configuredBase.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, payload = null, cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, { token, body, headers, signal, ...options } = {}) {
  const requestHeaders = { Accept: "application/json", ...headers };
  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ApiError("Unable to reach Gymssy. Please try again.", { cause: error });
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("Gymssy returned an invalid response.", { status: response.status });
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || "The request could not be completed.", {
      status: response.status,
      payload,
    });
  }
  return payload;
}
