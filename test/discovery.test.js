import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import { DiscoveryApiError, buildDiscoveryQuery, fetchDiscovery } from "../src/services/discoveryService.js";
import { changeDiscoveryFilter, clearDiscoveryFilters, discoveryUrlSearch, readDiscoveryUrl, validateDiscoveryState } from "../src/utils/discoveryState.js";
import { buildLocatedDiscoveryFilters, normalizeSearchLocation } from "../src/utils/customerLocation.js";
import { listingDistance } from "../src/components/Discover/DiscoveryCard/discoveryCardUtils.js";
import { readFile } from "node:fs/promises";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

const categories = [
  { id: "fitness", name: "Fitness", slug: "fitness", subcategories: [{ id: "gyms", name: "Gyms", slug: "gyms" }, { id: "hiit", name: "HIIT", slug: "hiit" }] },
  { id: "wellness", name: "Wellness", slug: "wellness", subcategories: [{ id: "nutrition", name: "Nutrition", slug: "nutrition" }] },
];
const cities = [{ id: "delhi", name: "New Delhi", slug: "new-delhi" }];

test("discovery query construction omits empty values and preserves backend dimensions", () => {
  assert.equal(buildDiscoveryQuery({ search: " yoga ", category: "wellness", subcategory: "", type: "trainer", city: null, page: 2, limit: 20, sort: "rating" }), "search=yoga&category=wellness&type=trainer&sort=rating&page=2&limit=20");
  assert.equal(buildDiscoveryQuery({ entity: "venue", lat: 12.9784, lng: 77.6408, radius: 10, page: 2, limit: 20 }), "entity=venue&page=2&limit=20&lat=12.9784&lng=77.6408&radius=10");
});

test("URL state supports current parameters and migrates legacy Discover values", () => {
  const legacy = readDiscoveryUrl("?q=strength&type=wellness&city=New%20Delhi&sort=trending");
  assert.deepEqual(validateDiscoveryState(legacy, categories, cities), { search: "strength", category: "wellness", subcategory: "", type: "", entity: "", city: "new-delhi", sort: "recommended", page: 1, limit: 20 });
  const oldCategory = validateDiscoveryState(readDiscoveryUrl("?category=gyms"), categories, cities);
  assert.equal(oldCategory.category, "fitness");
  assert.equal(oldCategory.subcategory, "gyms");
});

test("changing major filters resets page and Category changes clear dependent Subcategory", () => {
  const initial = { ...clearDiscoveryFilters(), category: "fitness", subcategory: "hiit", page: 4 };
  assert.deepEqual(changeDiscoveryFilter(initial, "category", "wellness"), { ...initial, category: "wellness", subcategory: "", page: 1 });
  assert.equal(changeDiscoveryFilter(initial, "sort", "newest").page, 1);
});

test("professional type selection clears City and invalid URL combinations are normalized", () => {
  const initial = { ...clearDiscoveryFilters(), city: "new-delhi" };
  assert.equal(changeDiscoveryFilter(initial, "type", "trainer").city, "");
  const normalized = validateDiscoveryState({ ...initial, type: "coach" }, categories, cities);
  assert.equal(normalized.type, "");
  assert.equal(normalized.city, "new-delhi");
});

test("URL serialization uses backend vocabulary and omits defaults", () => {
  assert.equal(discoveryUrlSearch({ ...clearDiscoveryFilters(), category: "fitness", subcategory: "hiit", page: 2 }), "?category=fitness&subcategory=hiit&page=2");
  assert.equal(discoveryUrlSearch({ ...clearDiscoveryFilters(), entity: "venue" }), "?entity=venue");
});

test("customer location is request-only state, composes with filters and pagination, and preserves explicit sorting", () => {
  const location = normalizeSearchLocation({ label: "Indiranagar", name: "Indiranagar", city: "Bengaluru", state: "Karnataka", latitude: 12.9784, longitude: 77.6408 });
  const filters = { ...clearDiscoveryFilters(), category: "fitness", page: 3 };
  assert.equal(discoveryUrlSearch(filters), "?category=fitness&page=3");
  const nearby = buildLocatedDiscoveryFilters(filters, location);
  assert.deepEqual({ lat: nearby.lat, lng: nearby.lng, radius: nearby.radius, page: nearby.page, category: nearby.category }, { lat: 12.9784, lng: 77.6408, radius: 10, page: 3, category: "fitness" });
  assert.equal("sort" in nearby, false);
  assert.equal(buildLocatedDiscoveryFilters({ ...filters, sort: "newest" }, location).sort, "newest");
  assert.equal("lat" in buildLocatedDiscoveryFilters(filters, null), false);
});

test("distance rendering is backend-owned and missing or malformed values never become fake zero", () => {
  assert.equal(listingDistance({ value: 2.4, unit: "km" }), "2.4 km away");
  assert.equal(listingDistance({ value: 0, unit: "km" }), "0 km away");
  assert.equal(listingDistance(), "");
  assert.equal(listingDistance({ value: "", unit: "km" }), "");
  assert.equal(listingDistance({ value: 4, unit: "miles" }), "");
});

test("Discover resets pagination through shared location changes, handles nearby empty state, and rejects stale responses", async () => {
  const [page, hook] = await Promise.all([
    readFile(new URL("../src/pages/Discover/DiscoverMarketplacePage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/hooks/useDiscovery.js", import.meta.url), "utf8"),
  ]);
  assert.match(page, /previousLocationKey/);
  assert.match(page, /page: 1/);
  assert.match(page, /No Gymssy venues found within this area yet/);
  assert.match(page, /clearLocation/);
  assert.match(page, /buildLocatedDiscoveryFilters/);
  assert.match(hook, /let active = true/);
  assert.match(hook, /active = false; controller\.abort\(\)/);
});

test("service maps pagination, preserves hrefs, and accepts empty results", async () => {
  const item = { id: "1", entityType: "gym", href: "/gym-detail/alpha", name: "Alpha" };
  globalThis.fetch = async () => ({ ok: true, status: 200, async json() { return { success: true, data: [item], pagination: { page: 2, limit: 20, total: 21, totalPages: 2 } }; } });
  const result = await fetchDiscovery({ page: 2, limit: 20 });
  assert.equal(result.listings[0].href, "/gym-detail/alpha");
  assert.deepEqual(result.pagination, { page: 2, limit: 20, total: 21, totalPages: 2 });

  globalThis.fetch = async () => ({ ok: true, status: 200, async json() { return { success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }; } });
  assert.deepEqual((await fetchDiscovery({})).listings, []);
});

test("service surfaces safe HTTP errors for backend filter failures", async () => {
  globalThis.fetch = async () => ({ ok: false, status: 400, async json() { return { success: false, message: "Invalid listing type", errors: [{ field: "type", message: "Invalid listing type" }] }; } });
  await assert.rejects(() => fetchDiscovery({ type: "invalid" }), (error) => {
    assert.ok(error instanceof DiscoveryApiError);
    assert.equal(error.status, 400);
    assert.equal(error.errors[0].field, "type");
    return true;
  });
});
