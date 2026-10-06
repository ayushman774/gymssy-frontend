export const CUSTOMER_LOCATION_STORAGE_KEY = "gymssy_customer_location";
export const CUSTOMER_LOCATION_STORAGE_VERSION = 1;
export const CUSTOMER_LOCATION_DEFAULT_RADIUS_KM = 10;
export const DEVICE_GEOLOCATION_OPTIONS = Object.freeze({
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 60_000,
});

const LOCATION_SOURCES = new Set(["search", "device"]);
const DISPLAY_FIELDS = ["label", "name", "area", "city", "state", "postcode"];
const PROFESSIONAL_TYPES = new Set(["trainer", "coach", "nutritionist"]);

function normalizedText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function validDisplayFields(value) {
  return DISPLAY_FIELDS.every((field) => value[field] === undefined || value[field] === null || typeof value[field] === "string");
}

function normalizedCoordinate(value, min, max) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) return null;
  return Number(value.toFixed(6));
}

export function normalizeCustomerLocation(value, forcedSource) {
  if (!value || typeof value !== "object" || Array.isArray(value) || !validDisplayFields(value)) return null;
  const source = forcedSource || value.source;
  if (!LOCATION_SOURCES.has(source)) return null;
  const latitude = normalizedCoordinate(value.latitude, -90, 90);
  const longitude = normalizedCoordinate(value.longitude, -180, 180);
  if (latitude === null || longitude === null) return null;

  const display = Object.fromEntries(DISPLAY_FIELDS.map((field) => [field, normalizedText(value[field])]));
  const fallbackLabel = source === "device"
    ? "Current location"
    : [display.name || display.area, display.city, display.state].filter(Boolean).join(", ");

  const label = display.label || fallbackLabel;
  if (!label) return null;

  return {
    source,
    ...display,
    label,
    latitude,
    longitude,
  };
}

export function normalizeSearchLocation(suggestion) {
  const displayParts = [suggestion?.name || suggestion?.area, suggestion?.city, suggestion?.state]
    .map(normalizedText)
    .filter((part, index, values) => part && values.findIndex((value) => value.toLowerCase() === part.toLowerCase()) === index);
  return normalizeCustomerLocation({
    source: "search",
    label: displayParts.join(", ") || suggestion?.label,
    name: suggestion?.name,
    area: suggestion?.area,
    city: suggestion?.city,
    state: suggestion?.state,
    postcode: suggestion?.postcode,
    latitude: suggestion?.latitude,
    longitude: suggestion?.longitude,
  });
}

export function normalizeDeviceLocation(coordinates) {
  return normalizeCustomerLocation({
    source: "device",
    label: "Current location",
    name: "Current location",
    latitude: coordinates?.latitude,
    longitude: coordinates?.longitude,
  });
}

export function parsePersistedCustomerLocation(raw) {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CUSTOMER_LOCATION_STORAGE_VERSION) return null;
    return normalizeCustomerLocation(parsed.location);
  } catch {
    return null;
  }
}

export function readPersistedCustomerLocation(storage = globalThis.localStorage) {
  if (!storage?.getItem) return null;
  try {
    const raw = storage.getItem(CUSTOMER_LOCATION_STORAGE_KEY);
    if (!raw) return null;
    const location = parsePersistedCustomerLocation(raw);
    if (!location) storage.removeItem?.(CUSTOMER_LOCATION_STORAGE_KEY);
    return location;
  } catch {
    return null;
  }
}

export function persistCustomerLocation(location, storage = globalThis.localStorage) {
  const normalized = normalizeCustomerLocation(location);
  if (!normalized || !storage?.setItem) return false;
  try {
    storage.setItem(CUSTOMER_LOCATION_STORAGE_KEY, JSON.stringify({
      version: CUSTOMER_LOCATION_STORAGE_VERSION,
      location: normalized,
    }));
    return true;
  } catch {
    return false;
  }
}

export function removePersistedCustomerLocation(storage = globalThis.localStorage) {
  try { storage?.removeItem?.(CUSTOMER_LOCATION_STORAGE_KEY); } catch { /* keep in-memory state usable */ }
}

export function customerLocationKey(location) {
  const normalized = normalizeCustomerLocation(location);
  return normalized ? `${normalized.source}:${normalized.latitude}:${normalized.longitude}` : "";
}

export function buildLocatedDiscoveryFilters(filters = {}, location, radius = CUSTOMER_LOCATION_DEFAULT_RADIUS_KM) {
  const base = { ...filters };
  const normalized = normalizeCustomerLocation(location);
  if (!normalized || PROFESSIONAL_TYPES.has(base.type)) return base;
  if (base.sort === "recommended") delete base.sort;
  return {
    ...base,
    lat: normalized.latitude,
    lng: normalized.longitude,
    radius,
  };
}

export class CustomerLocationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CustomerLocationError";
    this.code = code;
  }
}

export function deviceLocationError(error) {
  if (error instanceof CustomerLocationError) return error;
  const code = Number(error?.code);
  if (code === 1) return new CustomerLocationError("PERMISSION_DENIED", "Location access was blocked. Search for an area instead.");
  if (code === 2) return new CustomerLocationError("POSITION_UNAVAILABLE", "We couldn’t determine your location. Try again or search manually.");
  if (code === 3) return new CustomerLocationError("TIMEOUT", "We couldn’t get your location in time. Try again or search manually.");
  return new CustomerLocationError("UNKNOWN", "We couldn’t use your location. Try again or search manually.");
}

export function requestDeviceLocation(geolocation = globalThis.navigator?.geolocation) {
  if (!geolocation?.getCurrentPosition) {
    return Promise.reject(new CustomerLocationError("UNSUPPORTED", "This browser doesn’t support location access. Search for an area instead."));
  }
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      (position) => {
        const location = normalizeDeviceLocation(position?.coords);
        if (location) resolve(location);
        else reject(new CustomerLocationError("INVALID_POSITION", "Your device returned an invalid location. Search for an area instead."));
      },
      (error) => reject(deviceLocationError(error)),
      DEVICE_GEOLOCATION_OPTIONS,
    );
  });
}
