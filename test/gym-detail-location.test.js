import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  approximateDistanceKm,
  approximateDistanceLabel,
  createSafeLocationPopup,
  googleMapsDirectionsUrl,
  normalizeVenueCoordinates,
} from "../src/utils/gymDetailLocation.js";

const customerLocation = { latitude: 12.9719, longitude: 77.6412 };
const venueCoordinates = { lat: 12.9784, lng: 77.6408 };

test("venue coordinate validation accepts supported shapes and rejects missing or invalid values", () => {
  assert.deepEqual(normalizeVenueCoordinates(venueCoordinates), { latitude: 12.9784, longitude: 77.6408 });
  assert.deepEqual(normalizeVenueCoordinates({ latitude: 0, longitude: 0 }), { latitude: 0, longitude: 0 });
  assert.equal(normalizeVenueCoordinates(null), null);
  assert.equal(normalizeVenueCoordinates({ lat: 12.9 }), null);
  assert.equal(normalizeVenueCoordinates({ lat: "12.9", lng: 77.6 }), null);
  assert.equal(normalizeVenueCoordinates({ lat: 91, lng: 77.6 }), null);
  assert.equal(normalizeVenueCoordinates({ lat: 12.9, lng: 181 }), null);
});

test("Haversine distance is an explicit approximate straight-line value", () => {
  assert.equal(approximateDistanceKm(customerLocation, venueCoordinates), 0.7);
  assert.deepEqual(approximateDistanceLabel(customerLocation, venueCoordinates), {
    value: 0.7,
    unit: "km",
    label: "0.7 km away",
    qualifier: "Approx. straight-line distance",
  });
  assert.equal(approximateDistanceKm(null, venueCoordinates), null);
  assert.equal(approximateDistanceKm(customerLocation, null), null);
});

test("distance changes when the active shared customer location changes", () => {
  const nearby = approximateDistanceKm(customerLocation, venueCoordinates);
  const farther = approximateDistanceKm({ latitude: 12.9352, longitude: 77.6245 }, venueCoordinates);
  assert.notEqual(nearby, farther);
  assert.ok(farther > nearby);
});

test("directions URL contains only verified venue coordinates", () => {
  const directions = googleMapsDirectionsUrl(venueCoordinates);
  const url = new URL(directions);
  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.pathname, "/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("destination"), "12.9784,77.6408");
  assert.equal(url.searchParams.has("origin"), false);
  assert.doesNotMatch(directions, /12\.9719|77\.6412/);
  assert.equal(googleMapsDirectionsUrl({ lat: 12.9 }), null);
});

test("popup content uses text nodes and preserves hostile-looking content as inert text", () => {
  class FakeElement {
    constructor(tagName) {
      this.tagName = tagName;
      this.className = "";
      this.textContent = "";
      this.children = [];
    }

    set innerHTML(_value) {
      throw new Error("innerHTML must not be used for venue content");
    }

    append(...children) {
      this.children.push(...children);
    }
  }

  const fakeDocument = { createElement: (tagName) => new FakeElement(tagName) };
  const hostileName = '<img src=x onerror="alert(1)">';
  const hostileAddress = "<script>alert(1)</script>";
  const popup = createSafeLocationPopup({
    name: hostileName,
    location: { address: hostileAddress },
  }, fakeDocument);

  assert.equal(popup.className, "gymssy-location-popup");
  assert.equal(popup.children[0].textContent, hostileName);
  assert.equal(popup.children[1].textContent, hostileAddress);
});

test("detail UI consumes shared location, hides invalid map controls, and keeps its route contract", async () => {
  const [page, map, header, quickInfo, routes] = await Promise.all([
    readFile(new URL("../src/pages/GymDetailsPage/GymDetailsPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/GymDetails/LocationMap/LocationMap.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/GymDetails/GymHeader/GymHeader.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/GymDetails/GymQuickInfo/GymQuickInfo.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /useCustomerLocation\(\)/);
  assert.match(page, /approximateDistanceLabel\(customerLocation, gym\?\.coordinates\)/);
  assert.doesNotMatch(page, /setDeviceLocation|requestDeviceLocation/);
  assert.match(map, /coordinates && \(/);
  assert.match(map, /directionsUrl && \(/);
  assert.match(map, /target="_blank"/);
  assert.match(map, /rel="noopener noreferrer"/);
  assert.match(map, /createSafeLocationPopup/);
  assert.doesNotMatch(map, /bindPopup\(\s*`/);
  assert.match(header, /distance &&/);
  assert.match(header, /distance\.label/);
  assert.doesNotMatch(header, /gym\.distance/);
  assert.match(quickInfo, /distance &&/);
  assert.match(routes, /path="\/gym-detail\/:slug"/);
});
