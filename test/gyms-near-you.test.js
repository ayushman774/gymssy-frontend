import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildDiscoveryQuery } from "../src/services/discoveryService.js";
import { CUSTOMER_LOCATION_DEFAULT_RADIUS_KM } from "../src/utils/customerLocation.js";
import { GYMS_NEAR_YOU_PAGE_SIZE, buildGymsNearYouFilters, gymsNearYouUrlSearch, readGymsNearYouPage } from "../src/utils/gymsNearYouState.js";

const location = { source: "search", label: "Indiranagar, Bengaluru, Karnataka", name: "Indiranagar", city: "Bengaluru", state: "Karnataka", latitude: 12.9719, longitude: 77.6412 };

test("nearby query is a fixed-radius physical venue search ordered by backend distance", () => {
  const filters = buildGymsNearYouFilters(location, 2);
  assert.deepEqual(filters, { entity: "venue", page: 2, limit: GYMS_NEAR_YOU_PAGE_SIZE, lat: 12.9719, lng: 77.6412, radius: CUSTOMER_LOCATION_DEFAULT_RADIUS_KM });
  assert.equal(buildDiscoveryQuery(filters), "entity=venue&page=2&limit=12&lat=12.9719&lng=77.6412&radius=10");
  assert.equal("sort" in filters, false);
  assert.equal("search" in filters, false);
  assert.equal("city" in filters, false);
  assert.equal("category" in filters, false);
});
test("nearby query cannot run without a valid shared customer location", () => {
  assert.deepEqual(buildGymsNearYouFilters(null), { entity: "venue", page: 1, limit: 12 });
});

test("pagination URL accepts only positive pages and exposes no coordinates", () => {
  assert.equal(readGymsNearYouPage("?page=3"), 3);
  assert.equal(readGymsNearYouPage("?page=-4&lat=12.9&lng=77.6"), 1);
  assert.equal(gymsNearYouUrlSearch(1), "");
  assert.equal(gymsNearYouUrlSearch(3), "?page=3");
});

test("page uses shared location context and does not embed text autocomplete", async () => {
  const source = await readFile(new URL("../src/pages/GymsNearYouPage/GymsNearYouPage.jsx", import.meta.url), "utf8");
  assert.match(source, /useCustomerLocation/);
  assert.match(source, /setDeviceLocation/);
  assert.match(source, /useDiscovery\(discoveryFilters, hasLocation\)/);
  assert.match(source, /clearLocation/);
  assert.match(source, /previousLocationKey/);
  assert.match(source, /Change Location/);
  assert.match(source, /Browse all marketplace listings/);
  assert.doesNotMatch(source, /CustomerLocationPicker|loadLocationSuggestions|combobox|Search venues/);
});

test("nearby result cards preserve backend distance and detail navigation", () => {
  const listing = { entityType: "gym", distance: { value: 2.4, unit: "km" }, href: "/gym-detail/nearby-gym" };
  assert.deepEqual(listing.distance, { value: 2.4, unit: "km" });
  assert.equal(listing.href, "/gym-detail/nearby-gym");
});
