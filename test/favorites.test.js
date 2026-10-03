import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { favoriteKey, favoriteTargetType } from "../src/utils/favoriteIdentity.js";

test("marketplace presentation types map to three backing Favorite families", () => {
  for (const type of ["gym", "fitness_centre", "wellness_centre", "sports_academy", "studio"]) assert.equal(favoriteTargetType(type), "gym");
  assert.equal(favoriteTargetType("trainer"), "trainer");
  assert.equal(favoriteTargetType("coach"), "trainer");
  assert.equal(favoriteTargetType("nutritionist"), "nutritionist");
  assert.equal(favoriteTargetType("unknown"), null);
  assert.equal(favoriteKey("trainer", "123"), "trainer:123");
});

test("Favorite state uses one IDs hydration request and no localStorage saved state", () => {
  const context = fs.readFileSync(new URL("../src/context/FavoritesContext.jsx", import.meta.url), "utf8");
  const gymDetail = fs.readFileSync(new URL("../src/pages/GymDetailsPage/GymDetailsPage.jsx", import.meta.url), "utf8");
  assert.match(context, /fetchFavoriteIds/);
  assert.doesNotMatch(context, /localStorage/);
  assert.doesNotMatch(gymDetail, /gymssy_saved/);
});

test("shared Favorite button is accessible, prevents card navigation, and redirects signed-out customers through centralized state", () => {
  const button = fs.readFileSync(new URL("../src/components/Favorites/FavoriteButton.jsx", import.meta.url), "utf8");
  const context = fs.readFileSync(new URL("../src/context/FavoritesContext.jsx", import.meta.url), "utf8");
  assert.match(button, /aria-pressed/);
  assert.match(button, /stopPropagation/);
  assert.match(button, /disabled={pending}/);
  assert.match(context, /navigate\("\/login"/);
  assert.match(context, /setKeys\(\(current\).*removing/s);
  assert.match(context, /catch \(err\).*setKeys/s);
});

test("Favorites page renders mixed normalized Discovery cards with loading, error, retry, empty, and pagination states", () => {
  const page = fs.readFileSync(new URL("../src/pages/Favorites/FavoritesPage.jsx", import.meta.url), "utf8");
  assert.match(page, /DiscoveryCard/);
  for (const marker of ["Loading favorites", "role=\"alert\"", "Retry", "No favorites yet", "pagination"]) assert.match(page, new RegExp(marker));
  assert.doesNotMatch(page, /gymsData|FEATURED_GYMS|static/i);
});
