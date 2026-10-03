import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { searchMarketplace } from "../src/services/discoveryService.js";
import {
  GLOBAL_SEARCH_DEBOUNCE_MS,
  GLOBAL_SEARCH_LIMIT,
  GLOBAL_SEARCH_MIN_LENGTH,
  globalSearchUrl,
  moveSuggestionIndex,
  normalizeGlobalSearch,
  suggestionMeta,
} from "../src/utils/globalSearch.js";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test("global-search constants keep autocomplete bounded and debounced", () => {
  assert.equal(GLOBAL_SEARCH_MIN_LENGTH, 2);
  assert.equal(GLOBAL_SEARCH_LIMIT, 6);
  assert.equal(GLOBAL_SEARCH_DEBOUNCE_MS, 300);
});

test("normalization trims input and submission creates canonical encoded search URLs", () => {
  assert.equal(normalizeGlobalSearch("  boxing  "), "boxing");
  assert.equal(globalSearchUrl("  boxing  "), "/discover?search=boxing");
  assert.equal(globalSearchUrl("strength & yoga"), "/discover?search=strength+%26+yoga");
  assert.equal(globalSearchUrl("   "), "/discover");
});

test("blank and one-character input do not make a marketplace request", async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error("unexpected request"); };
  assert.deepEqual((await searchMarketplace(" ")).listings, []);
  assert.deepEqual((await searchMarketplace("y")).listings, []);
  assert.equal(calls, 0);
});

test("marketplace autocomplete uses Discovery search, page one, and limit six", async () => {
  const mixed = [
    { id: "g1", entityType: "gym", name: "Alpha Gym", href: "/gym-detail/alpha-gym" },
    { id: "t1", entityType: "trainer", name: "A Trainer", href: "/trainers/a-trainer" },
    { id: "c1", entityType: "coach", name: "A Coach", href: "/trainers/a-coach" },
    { id: "n1", entityType: "nutritionist", name: "A Nutritionist", href: "/nutritionists/a-nutritionist" },
  ];
  let requestedUrl;
  globalThis.fetch = async (url) => {
    requestedUrl = url;
    return { ok: true, status: 200, async json() { return { success: true, data: mixed, pagination: { page: 1, limit: 6, total: 4, totalPages: 1 } }; } };
  };
  const result = await searchMarketplace("  yoga  ");
  const query = new URL(requestedUrl).searchParams;
  assert.equal(query.get("search"), "yoga");
  assert.equal(query.get("page"), "1");
  assert.equal(query.get("limit"), "6");
  assert.deepEqual(result.listings.map(({ href }) => href), [
    "/gym-detail/alpha-gym",
    "/trainers/a-trainer",
    "/trainers/a-coach",
    "/nutritionists/a-nutritionist",
  ]);
});

test("suggestion metadata uses venue location and professional role/specialty without fake fields", () => {
  assert.equal(suggestionMeta({ location: { area: "Indiranagar", city: { name: "Bengaluru" } } }), "Indiranagar, Bengaluru");
  assert.equal(suggestionMeta({ summary: { role: "Trainer", specialty: "Strength" } }), "Trainer · Strength");
  assert.equal(suggestionMeta({ summary: { role: "Coach", specialty: "Boxing" } }), "Coach · Boxing");
  assert.equal(suggestionMeta({ summary: { role: "Nutritionist", specialty: "Sports Nutrition" } }), "Nutritionist · Sports Nutrition");
});

test("keyboard movement wraps safely", () => {
  assert.equal(moveSuggestionIndex(-1, "next", 4), 0);
  assert.equal(moveSuggestionIndex(3, "next", 4), 0);
  assert.equal(moveSuggestionIndex(0, "previous", 4), 3);
  assert.equal(moveSuggestionIndex(2, "previous", 4), 1);
  assert.equal(moveSuggestionIndex(0, "next", 0), -1);
});

test("request cancellation is forwarded and autocomplete errors do not affect submission URLs", async () => {
  const controller = new AbortController();
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.signal, controller.signal);
    const error = new Error("cancelled");
    error.name = "AbortError";
    throw error;
  };
  await assert.rejects(() => searchMarketplace("yoga", { signal: controller.signal }), { name: "AbortError" });
  assert.equal(globalSearchUrl("yoga"), "/discover?search=yoga");
});

test("successful zero-result responses are handled as an empty suggestion collection", async () => {
  globalThis.fetch = async () => ({ ok: true, status: 200, async json() { return { success: true, data: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 } }; } });
  assert.deepEqual((await searchMarketplace("no-such-listing")).listings, []);
});

test("Home global search no longer imports static gymsData inventory", async () => {
  const [hero, search] = await Promise.all([
    readFile(new URL("../src/components/sections/home/Hero/HeroContent.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/MarketplaceSearch/GlobalMarketplaceSearch.jsx", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(hero, /gymsData/);
  assert.doesNotMatch(search, /gymsData/);
  assert.match(hero, /GlobalMarketplaceSearch/);
  assert.match(search, /item\.href/);
});
