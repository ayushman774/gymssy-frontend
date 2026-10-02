import test from "node:test";
import assert from "node:assert/strict";

import { buildDiscoveryQuery } from "../src/services/discoveryService.js";
import {
  buildCategoryDiscoveryFilters,
  categoryDiscoveryUrlSearch,
  changeCategoryDiscoveryFilter,
  clearCategoryDiscoveryFilters,
  readCategoryDiscoveryUrl,
  resolveCategorySlug,
  validateCategoryDiscoveryState,
} from "../src/utils/categoryDiscovery.js";

const categories = [
  { id: "fitness", name: "Fitness", slug: "fitness", isActive: true, subcategories: [{ id: "hiit", name: "HIIT", slug: "hiit", isActive: true }, { id: "hidden", name: "Hidden", slug: "hidden", isActive: false }] },
  { id: "wellness", name: "Wellness", slug: "wellness", isActive: true, subcategories: [{ id: "nutrition", name: "Nutrition", slug: "nutrition", isActive: true }] },
  { id: "inactive", name: "Inactive", slug: "inactive", isActive: false, subcategories: [] },
];
const cities = [{ id: "delhi", name: "New Delhi", slug: "new-delhi" }];

test("main-category routes resolve to one fixed discovery category", () => {
  const resolution = resolveCategorySlug("fitness", categories);
  assert.equal(resolution.category.name, "Fitness");
  assert.equal(resolution.subcategory, null);
  assert.deepEqual(buildCategoryDiscoveryFilters(resolution, clearCategoryDiscoveryFilters()), {
    ...clearCategoryDiscoveryFilters(), category: "fitness", subcategory: "",
  });
});

test("subcategory routes preserve their parent in the discovery query", () => {
  const resolution = resolveCategorySlug("hiit", categories);
  assert.equal(resolution.category.name, "HIIT");
  const filters = buildCategoryDiscoveryFilters(resolution, { ...clearCategoryDiscoveryFilters(), type: "trainer", search: "strength" });
  assert.equal(buildDiscoveryQuery(filters), "search=strength&category=fitness&subcategory=hiit&type=trainer&sort=recommended&page=1&limit=20");
});

test("unknown and inactive taxonomy slugs do not resolve", () => {
  assert.equal(resolveCategorySlug("missing", categories), null);
  assert.equal(resolveCategorySlug("inactive", categories), null);
  assert.equal(resolveCategorySlug("hidden", categories), null);
});

test("category URL state keeps useful filters but never serializes fixed taxonomy", () => {
  const filters = validateCategoryDiscoveryState(readCategoryDiscoveryUrl("?q=yoga&type=gym&city=New%20Delhi&sort=rating&page=3&category=wrong&subcategory=wrong"), cities);
  assert.deepEqual(filters, { search: "yoga", type: "gym", city: "new-delhi", sort: "rating", page: 3, limit: 20 });
  assert.equal(categoryDiscoveryUrlSearch(filters), "?search=yoga&type=gym&city=new-delhi&sort=rating&page=3");
});

test("category filter changes reset pagination and professional types clear city", () => {
  const initial = { ...clearCategoryDiscoveryFilters(), city: "new-delhi", page: 4 };
  assert.deepEqual(changeCategoryDiscoveryFilter(initial, "type", "coach"), { ...initial, type: "coach", city: "", page: 1 });
  assert.equal(changeCategoryDiscoveryFilter(initial, "sort", "newest").page, 1);
});

test("mixed discovery entities remain untouched for shared card rendering", () => {
  const listings = [
    { id: "g1", entityType: "gym", href: "/gym-detail/alpha" },
    { id: "t1", entityType: "trainer", href: "/trainers/alex" },
    { id: "c1", entityType: "coach", href: "/trainers/casey" },
    { id: "n1", entityType: "nutritionist", href: "/nutritionists/nina" },
  ];
  assert.deepEqual(listings.map(({ entityType, href }) => [entityType, href]), [["gym", "/gym-detail/alpha"], ["trainer", "/trainers/alex"], ["coach", "/trainers/casey"], ["nutritionist", "/nutritionists/nina"]]);
});
