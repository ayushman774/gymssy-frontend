import test from "node:test";
import assert from "node:assert/strict";
import { buildDiscoveryQuery } from "../src/services/discoveryService.js";
import {
  VENUE_TYPES,
  buildGymsNearYouFilters,
  changeGymsNearYouFilter,
  clearGymsNearYouFilters,
  gymsNearYouUrlSearch,
  readGymsNearYouUrl,
  validateGymsNearYouState,
} from "../src/utils/gymsNearYouState.js";

const categories = [{ slug: "fitness", name: "Fitness", subcategories: [{ slug: "gyms", name: "Gyms" }, { slug: "hiit", name: "HIIT" }] }, { slug: "wellness", name: "Wellness", subcategories: [{ slug: "yoga", name: "Yoga" }] }];
const cities = [{ slug: "bangalore", name: "Bangalore" }, { slug: "old-city", name: "Old City", isActive: false }];

test("venue query carries every supported backend filter and canonical City slug", () => {
  const filters = buildGymsNearYouFilters({ ...clearGymsNearYouFilters(), city: "bangalore", category: "fitness", subcategory: "hiit", type: "fitness_centre", search: "strength", sort: "rating", page: 2 });
  assert.equal(buildDiscoveryQuery(filters), "search=strength&category=fitness&subcategory=hiit&type=fitness_centre&entity=venue&city=bangalore&sort=rating&page=2&limit=12");
});

test("venue types include only physical Gym-model classifications", () => {
  assert.deepEqual(VENUE_TYPES.map(([value]) => value), ["gym", "fitness_centre", "wellness_centre", "sports_academy", "studio"]);
  assert.ok(!VENUE_TYPES.some(([value]) => ["trainer", "coach", "nutritionist"].includes(value)));
});

test("URL validation rejects unknown or inactive Cities and invalid taxonomy", () => {
  assert.deepEqual(validateGymsNearYouState(readGymsNearYouUrl("?city=Bangalore&category=fitness&subcategory=hiit"), categories, cities), { ...clearGymsNearYouFilters(), city: "bangalore", category: "fitness", subcategory: "hiit" });
  assert.equal(validateGymsNearYouState(readGymsNearYouUrl("?city=unknown"), categories, cities).city, "");
  assert.equal(validateGymsNearYouState(readGymsNearYouUrl("?city=old-city"), categories, cities).city, "");
  assert.equal(validateGymsNearYouState(readGymsNearYouUrl("?category=wellness&subcategory=hiit"), categories, cities).subcategory, "");
});

test("major filters reset page and Category changes clear Subcategory", () => {
  const initial = { ...clearGymsNearYouFilters(), category: "fitness", subcategory: "hiit", page: 4 };
  assert.deepEqual(changeGymsNearYouFilter(initial, "category", "wellness"), { ...initial, category: "wellness", subcategory: "", page: 1 });
  assert.equal(changeGymsNearYouFilter(initial, "city", "bangalore").page, 1);
});

test("shareable URL omits internal venue constraint and defaults", () => {
  assert.equal(gymsNearYouUrlSearch({ ...clearGymsNearYouFilters(), city: "bangalore", sort: "reviews", page: 2 }), "?city=bangalore&sort=reviews&page=2");
});

test("normalized venue navigation preserves backend Gym detail href and has no distance field", () => {
  const listing = { id: "g1", entityType: "studio", name: "Real Studio", href: "/gym-detail/real-studio", location: { city: { slug: "bangalore" } } };
  assert.equal(listing.href, "/gym-detail/real-studio");
  assert.equal("distance" in listing, false);
});
