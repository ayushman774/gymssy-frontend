import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildDiscoveryQuery } from "../src/services/discoveryService.js";
import { CUSTOMER_LOCATION_DEFAULT_RADIUS_KM } from "../src/utils/customerLocation.js";
import {
  GYMS_NEAR_YOU_PAGE_SIZE,
  buildGymsNearYouFilters,
  gymsNearYouUrlSearch,
  readGymsNearYouPage,
} from "../src/utils/gymsNearYouState.js";
import {
  createNearbyPopupContent,
  mapReadyVenues,
  nextSelectedVenueId,
  safeVenueHref,
} from "../src/utils/nearbyVenuesMap.js";

const location = {
  source: "search",
  label: "Indiranagar, Bengaluru, Karnataka",
  name: "Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  latitude: 12.9719,
  longitude: 77.6412,
};

test("nearby query is a fixed-radius physical venue search ordered by backend distance", () => {
  const filters = buildGymsNearYouFilters(location, 2);
  assert.deepEqual(filters, {
    entity: "venue",
    page: 2,
    limit: GYMS_NEAR_YOU_PAGE_SIZE,
    lat: 12.9719,
    lng: 77.6412,
    radius: CUSTOMER_LOCATION_DEFAULT_RADIUS_KM,
  });
  assert.equal(
    buildDiscoveryQuery(filters),
    "entity=venue&page=2&limit=12&lat=12.9719&lng=77.6412&radius=10",
  );
  assert.equal("sort" in filters, false);
  assert.equal("search" in filters, false);
  assert.equal("city" in filters, false);
  assert.equal("category" in filters, false);
});
test("nearby query cannot run without a valid shared customer location", () => {
  assert.deepEqual(buildGymsNearYouFilters(null), {
    entity: "venue",
    page: 1,
    limit: 12,
  });
});

test("pagination URL accepts only positive pages and exposes no coordinates", () => {
  assert.equal(readGymsNearYouPage("?page=3"), 3);
  assert.equal(readGymsNearYouPage("?page=-4&lat=12.9&lng=77.6"), 1);
  assert.equal(gymsNearYouUrlSearch(1), "");
  assert.equal(gymsNearYouUrlSearch(3), "?page=3");
});

test("page uses shared location context and does not embed text autocomplete", async () => {
  const source = await readFile(
    new URL(
      "../src/pages/GymsNearYouPage/GymsNearYouPage.jsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(source, /useCustomerLocation/);
  assert.match(source, /setDeviceLocation/);
  assert.match(source, /useDiscovery\(discoveryFilters, hasLocation\)/);
  assert.match(source, /clearLocation/);
  assert.match(source, /previousLocationKey/);
  assert.match(source, /Change Location/);
  assert.match(source, /Browse all marketplace listings/);
  assert.doesNotMatch(
    source,
    /CustomerLocationPicker|loadLocationSuggestions|combobox|Search venues/,
  );
});

test("nearby result cards preserve backend distance and detail navigation", () => {
  const listing = {
    entityType: "gym",
    distance: { value: 2.4, unit: "km" },
    href: "/gym-detail/nearby-gym",
  };
  assert.deepEqual(listing.distance, { value: 2.4, unit: "km" });
  assert.equal(listing.href, "/gym-detail/nearby-gym");
});

test("map uses only listings with validated authoritative coordinates", () => {
  const listings = [
    {
      id: "valid",
      coordinates: { lat: 12.97, lng: 77.64 },
      href: "/gym-detail/valid",
    },
    { id: "missing", href: "/gym-detail/missing" },
    { id: "partial", coordinates: { lat: 12.97 } },
    { id: "strings", coordinates: { lat: "12.97", lng: 77.64 } },
    { id: "range", coordinates: { lat: 91, lng: 77.64 } },
  ];
  assert.deepEqual(
    mapReadyVenues(listings).map((item) => item.id),
    ["valid"],
  );
  assert.deepEqual(mapReadyVenues(listings)[0].coordinates, {
    latitude: 12.97,
    longitude: 77.64,
  });
});

test("map selection persists when possible and resets across pagination or location results", () => {
  const firstPage = [{ id: "one" }, { id: "two" }];
  assert.equal(nextSelectedVenueId(null, firstPage), "one");
  assert.equal(nextSelectedVenueId("two", firstPage), "two");
  assert.equal(nextSelectedVenueId("two", [{ id: "three" }]), "three");
  assert.equal(nextSelectedVenueId("two", []), null);
});

test("map popup treats listing content as text and accepts only internal detail paths", () => {
  class FakeElement {
    constructor() {
      this.children = [];
      this.textContent = "";
      this.attributes = {};
    }
    set innerHTML(_value) {
      throw new Error("unsafe HTML assignment");
    }
    append(...children) {
      this.children.push(...children);
    }
    setAttribute(name, value) {
      this.attributes[name] = value;
    }
  }
  const documentRef = { createElement: () => new FakeElement() };
  const hostile = '<img src=x onerror="alert(1)">';
  const popup = createNearbyPopupContent(
    { name: hostile, href: "/gym-detail/safe" },
    { typeLabel: "Gym", distanceLabel: "1 km away", documentRef },
  );
  assert.equal(popup.children[0].textContent, hostile);
  assert.equal(popup.children.at(-1).href, "/gym-detail/safe");
  assert.equal(safeVenueHref("javascript:alert(1)"), "");
  assert.equal(safeVenueHref("//evil.example"), "");
});

test("map view is an accessible current-page projection with safe navigation and tile failure fallback", async () => {
  const [page, map] = await Promise.all([
    readFile(
      new URL(
        "../src/pages/GymsNearYouPage/GymsNearYouPage.jsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../src/components/NearbyVenuesMap/NearbyVenuesMap.jsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  assert.match(page, /useState\("list"\)/);
  assert.match(page, /NearbyVenuesMap listings=\{discovery\.listings\}/);
  assert.match(page, /aria-label="Nearby venue view"/);
  assert.doesNotMatch(page, /CustomerLocationPicker|loadLocationSuggestions/);
  assert.match(map, /current paginated result\s+set only/);
  assert.match(map, /tileerror/);
  assert.doesNotMatch(
    map,
    /\.on\("tileload",\s*\(\)\s*=>\s*mounted\s*&&\s*setMapFailed\(false\)\)/,
  );
  assert.match(map, /tileLayer\.on\("tileerror"/);
  assert.match(map, /Switch to List/);
  assert.match(map, /keyboard/);
  assert.match(map, /safeVenueHref\(venue\.href\)/);
  assert.match(map, /<strong>\{venue\.name\}<\/strong>/);
  assert.doesNotMatch(map, /venue\.name.*html|html:.*venue/);
});
