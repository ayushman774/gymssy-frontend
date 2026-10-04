import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { fetchDiscovery } from "../src/services/discoveryService.js";
import {
  HOME_VENUE_FILTERS,
  HOME_VENUE_LIMIT,
  homeVenueLocation,
  homeVenueTags,
  normaliseFeaturedTrainer,
} from "../src/utils/homeMarketplace.js";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test("Home venues use a bounded recommended venue-only Discovery query", async () => {
  assert.deepEqual(HOME_VENUE_FILTERS, { entity: "venue", sort: "recommended", page: 1, limit: 4 });
  assert.equal(HOME_VENUE_LIMIT, 4);
  let requestedUrl;
  globalThis.fetch = async (url) => {
    requestedUrl = url;
    return { ok: true, status: 200, async json() { return { success: true, data: [], pagination: { page: 1, limit: 4, total: 0, totalPages: 0 } }; } };
  };
  const result = await fetchDiscovery(HOME_VENUE_FILTERS);
  const query = new URL(requestedUrl).searchParams;
  assert.equal(query.get("entity"), "venue");
  assert.equal(query.get("sort"), "recommended");
  assert.equal(query.get("limit"), "4");
  assert.equal(query.has("city"), false);
  assert.deepEqual(result.listings, []);
});

test("Home venue presentation uses normalized location, taxonomy, nullable price, and backend href", () => {
  const venue = {
    href: "/gym-detail/alpha",
    location: { area: "Indiranagar", city: { name: "Bangalore" } },
    subcategories: ["gyms"],
    summary: { category: "Premium Gym", tags: ["24/7", "gyms"] },
    price: null,
  };
  assert.equal(venue.href, "/gym-detail/alpha");
  assert.equal(homeVenueLocation(venue), "Indiranagar, Bangalore");
  assert.deepEqual(homeVenueTags(venue), ["gyms", "Premium Gym", "24/7"]);
  assert.equal(venue.price, null);
  assert.equal("distance" in venue, false);
});

test("featured trainer adapter follows the current safe public professional contract", () => {
  const trainer = normaliseFeaturedTrainer({
    _id: "t1",
    name: "Asha",
    slug: "asha",
    role: "Strength Coach",
    specialty: "Powerlifting",
    experience: "8 Years",
    reviews: 42,
    available: true,
    href: "/trainers/asha",
    image: { src: "/asha.jpg" },
  });
  assert.deepEqual(trainer, {
    id: "t1",
    name: "Asha",
    slug: "asha",
    role: "Strength Coach",
    specialty: "Powerlifting",
    experience: "8 Years",
    rating: 0,
    reviewCount: 42,
    image: "/asha.jpg",
    available: true,
    isVerified: false,
    href: "/trainers/asha",
  });
  assert.equal("pricePerSession" in trainer, false);
});

test("Home venue section contains real loading, empty, and retry states without static inventory", async () => {
  const [section, card] = await Promise.all([
    readFile(new URL("../src/components/sections/home/GymsNearYou/GymsNearYou.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/sections/home/GymsNearYou/HomeVenueCard.jsx", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(section, /FEATURED_GYMS|gymsData/);
  assert.match(section, /useHomeVenues/);
  assert.match(section, /Loading recommended venues/);
  assert.match(section, /No published venues/);
  assert.match(section, /onClick=\{retry\}/);
  assert.doesNotMatch(card, /venue\.distance|Open Now|Closed|venue\.facilities|Join Now/);
  assert.match(card, /navigate\(venue\.href\)/);
});

test("Home marketing copy stays within implemented marketplace and booking-request capabilities", async () => {
  const [hero, marketplace, whyChooseUs, footer] = await Promise.all([
    readFile(new URL("../src/components/sections/home/Hero/HeroContent.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/assets/data/marketplace.js", import.meta.url), "utf8"),
    readFile(new URL("../src/components/sections/home/WhyChooseUs/WhyChooseUs.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/layout/Footer/Footer.jsx", import.meta.url), "utf8"),
  ]);
  const homeCopy = [hero, marketplace, whyChooseUs, footer].join("\n");
  for (const unsupportedClaim of [
    "Secure Online Booking",
    "payments and personal data",
    "physically verified",
    "background-verified",
    "Every review is verified",
    "10,000+ Members",
    "15 Years Excellence",
    "98% Retention Rate",
  ]) assert.doesNotMatch(homeCopy, new RegExp(unsupportedClaim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  assert.match(hero, /Booking Request Tracking/);
  assert.match(marketplace, /Send a booking request and track the provider's response/);
});
