import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  CUSTOMER_LOCATION_DEFAULT_RADIUS_KM,
  CUSTOMER_LOCATION_STORAGE_KEY,
  CUSTOMER_LOCATION_STORAGE_VERSION,
  DEVICE_GEOLOCATION_OPTIONS,
  CustomerLocationError,
  buildLocatedDiscoveryFilters,
  deviceLocationError,
  normalizeCustomerLocation,
  normalizeDeviceLocation,
  normalizeSearchLocation,
  parsePersistedCustomerLocation,
  persistCustomerLocation,
  readPersistedCustomerLocation,
  removePersistedCustomerLocation,
  requestDeviceLocation,
} from "../src/utils/customerLocation.js";
import {
  loadLocationSuggestions,
  LOCATION_AUTOCOMPLETE_ENDPOINT,
  LOCATION_AUTOCOMPLETE_LIMIT,
  LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH,
} from "../src/services/locationService.js";
import {
  autocompleteErrorMessage,
  autocompleteListState,
  isCurrentAutocompleteRequest,
  nextAutocompleteIndex,
} from "../src/utils/locationAutocomplete.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    value: (key) => values.get(key),
  };
}

const suggestion = {
  id: "provider-place-id",
  label: " Indiranagar, Bengaluru, Karnataka, India ",
  name: " Indiranagar ",
  area: "Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  postcode: "560038",
  latitude: 12.97840049,
  longitude: 77.64080049,
  type: "suburb",
};

test("customer location starts empty and search selections normalize without provider metadata", () => {
  assert.equal(readPersistedCustomerLocation(memoryStorage()), null);
  assert.deepEqual(normalizeSearchLocation(suggestion), {
    source: "search",
    label: "Indiranagar, Bengaluru, Karnataka",
    name: "Indiranagar",
    area: "Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    postcode: "560038",
    latitude: 12.9784,
    longitude: 77.6408,
  });
});

test("active location persistence is versioned, minimal, and hydrates safely", () => {
  const storage = memoryStorage();
  const location = normalizeSearchLocation(suggestion);
  assert.equal(persistCustomerLocation(location, storage), true);
  const raw = storage.value(CUSTOMER_LOCATION_STORAGE_KEY);
  const envelope = JSON.parse(raw);
  assert.equal(envelope.version, CUSTOMER_LOCATION_STORAGE_VERSION);
  assert.equal("id" in envelope.location, false);
  assert.equal("type" in envelope.location, false);
  assert.deepEqual(readPersistedCustomerLocation(storage), location);
  removePersistedCustomerLocation(storage);
  assert.equal(readPersistedCustomerLocation(storage), null);
});

test("malformed, stale-version, nonnumeric, and out-of-range persisted values are rejected and discarded", () => {
  const malformed = memoryStorage({ [CUSTOMER_LOCATION_STORAGE_KEY]: "not json" });
  assert.equal(readPersistedCustomerLocation(malformed), null);
  assert.equal(malformed.value(CUSTOMER_LOCATION_STORAGE_KEY), undefined);
  assert.equal(parsePersistedCustomerLocation(JSON.stringify({ version: 99, location: normalizeSearchLocation(suggestion) })), null);
  assert.equal(normalizeCustomerLocation({ ...suggestion, source: "search", latitude: "12.9" }), null);
  assert.equal(normalizeCustomerLocation({ ...suggestion, source: "search", latitude: 91 }), null);
  assert.equal(normalizeCustomerLocation({ ...suggestion, source: "search", longitude: -181 }), null);
  assert.equal(normalizeCustomerLocation({ ...suggestion, source: "other" }), null);
  assert.equal(normalizeCustomerLocation({ ...suggestion, source: "search", city: 42 }), null);
  assert.equal(normalizeCustomerLocation({ source: "search", latitude: 12.9, longitude: 77.6 }), null);
});

test("device locations use a privacy-safe label and one-shot browser options", async () => {
  assert.deepEqual(normalizeDeviceLocation({ latitude: 12.12345678, longitude: 77.98765432 }), {
    source: "device", label: "Current location", name: "Current location", area: "", city: "", state: "", postcode: "", latitude: 12.123457, longitude: 77.987654,
  });
  let calls = 0;
  const geolocation = {
    getCurrentPosition(success, _failure, options) {
      calls += 1;
      assert.deepEqual(options, DEVICE_GEOLOCATION_OPTIONS);
      success({ coords: { latitude: 12.9, longitude: 77.6 } });
    },
  };
  assert.equal(calls, 0);
  assert.equal((await requestDeviceLocation(geolocation)).source, "device");
  assert.equal(calls, 1);
});

test("device geolocation returns understandable unsupported, denied, unavailable, timeout, and unknown errors", async () => {
  await assert.rejects(() => requestDeviceLocation(null), (error) => error instanceof CustomerLocationError && error.code === "UNSUPPORTED");
  for (const [code, expected] of [[1, "PERMISSION_DENIED"], [2, "POSITION_UNAVAILABLE"], [3, "TIMEOUT"], [99, "UNKNOWN"]]) {
    const error = deviceLocationError({ code });
    assert.equal(error.code, expected);
    assert.doesNotMatch(error.message, /\[object Object\]|undefined/);
  }
});

test("autocomplete enforces the two-character minimum and bounded Gymssy endpoint contract", async () => {
  assert.equal(LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH, 2);
  assert.equal(LOCATION_AUTOCOMPLETE_LIMIT, 5);
  assert.equal(LOCATION_AUTOCOMPLETE_ENDPOINT, "/locations/autocomplete");
  let calls = 0;
  const request = async (path, options) => {
    calls += 1;
    assert.match(path, /^\/locations\/autocomplete\?q=Indiranagar&limit=5$/);
    assert.equal(options.method, "GET");
    return { data: Array.from({ length: 8 }, (_, index) => ({ id: index })) };
  };
  assert.deepEqual(await loadLocationSuggestions(" I ", request), []);
  assert.equal(calls, 0);
  assert.equal((await loadLocationSuggestions("  Indiranagar  ", request)).length, 5);
  assert.equal(calls, 1);
});

test("autocomplete state covers keyboard navigation, loading, empty, service errors, rate limits, and stale responses", () => {
  assert.equal(nextAutocompleteIndex(-1, "ArrowDown", 3), 0);
  assert.equal(nextAutocompleteIndex(2, "ArrowDown", 3), 0);
  assert.equal(nextAutocompleteIndex(0, "ArrowUp", 3), 2);
  assert.equal(nextAutocompleteIndex(1, "Escape", 3), -1);
  assert.equal(autocompleteListState({ open: true, loading: true, error: "", suggestionCount: 0, queryLength: 2 }), "loading");
  assert.equal(autocompleteListState({ open: true, loading: false, error: "", suggestionCount: 0, queryLength: 2 }), "empty");
  assert.equal(autocompleteListState({ open: true, loading: false, error: "failed", suggestionCount: 0, queryLength: 2 }), "error");
  assert.equal(autocompleteListState({ open: true, loading: false, error: "", suggestionCount: 2, queryLength: 2 }), "results");
  assert.match(autocompleteErrorMessage({ status: 429 }), /Too many location searches/);
  assert.match(autocompleteErrorMessage({ status: 503 }), /temporarily unavailable/);
  assert.equal(isCurrentAutocompleteRequest(4, 4), true);
  assert.equal(isCurrentAutocompleteRequest(5, 4), false);
});

test("location composes with discovery without putting default recommended ahead of nearest-first", () => {
  const location = normalizeSearchLocation(suggestion);
  const filters = { search: "gym", category: "fitness", city: "bangalore", sort: "recommended", page: 2, limit: 20 };
  assert.deepEqual(buildLocatedDiscoveryFilters(filters, null), filters);
  assert.deepEqual(buildLocatedDiscoveryFilters(filters, location), {
    search: "gym", category: "fitness", city: "bangalore", page: 2, limit: 20,
    lat: 12.9784, lng: 77.6408, radius: CUSTOMER_LOCATION_DEFAULT_RADIUS_KM,
  });
  assert.equal(buildLocatedDiscoveryFilters({ ...filters, sort: "rating" }, location).sort, "rating");
  assert.equal("lat" in buildLocatedDiscoveryFilters({ ...filters, type: "trainer" }, location), false);
});

test("location UI has debouncing, cancellation, stale guards, keyboard semantics, attribution, safe errors, and no direct provider request", async () => {
  const [component, context, utility] = await Promise.all([
    readFile(new URL("../src/components/Location/CustomerLocationPicker.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/context/CustomerLocationContext.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/utils/customerLocation.js", import.meta.url), "utf8"),
  ]);
  assert.match(component, /LOCATION_AUTOCOMPLETE_DEBOUNCE_MS = 300/);
  assert.match(component, /new AbortController\(\)/);
  assert.match(component, /isCurrentAutocompleteRequest/);
  for (const key of ["ArrowDown", "ArrowUp", "Enter", "Escape"]) assert.match(component, new RegExp(key));
  for (const aria of ["combobox", "listbox", "aria-activedescendant", "aria-selected", "aria-live"]) assert.match(component, new RegExp(aria));
  assert.match(component, /OpenStreetMap contributors/);
  assert.doesNotMatch(component + context, /api\.geoapify\.com|GEOAPIFY_API_KEY|apiKey=/i);
  assert.match(utility, /getCurrentPosition/);
  assert.doesNotMatch(utility + context, /watchPosition/);
  assert.doesNotMatch(context, /useEffect/);
});
