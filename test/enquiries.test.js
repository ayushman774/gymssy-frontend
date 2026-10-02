import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("enquiry service uses authenticated centralized API endpoints", async () => {
  const source = await read("src/services/enquiryService.js");
  assert.match(source, /apiRequest\("\/enquiries"/); assert.match(source, /method: "POST"/); assert.match(source, /token/); assert.match(source, /fetchMyEnquiries/);
});

test("reusable enquiry dialog prefills customer snapshot, blocks duplicate submit, and uses honest success copy", async () => {
  const source = await read("src/components/Enquiries/EnquiryDialog.jsx");
  assert.match(source, /user\?\.name/); assert.match(source, /user\?\.email/); assert.match(source, /if \(pending\) return/); assert.match(source, /disabled=\{pending\}/);
  assert.match(source, /Enquiry sent/); assert.match(source, /does not confirm a booking or payment/i); assert.doesNotMatch(source, /Booking confirmed|Payment successful|Seat reserved/);
  assert.match(source, /navigate\("\/login"/); assert.match(source, /state: \{ from:/);
});

test("detail pages map transactional CTAs to the supported intents", async () => {
  const [gym, trainer, nutritionist] = await Promise.all([read("src/pages/GymDetailsPage/GymDetailsPage.jsx"), read("src/pages/TrainerDetail/TrainerDetail.jsx"), read("src/pages/Nutritionists/NutritionistDetailsPage.jsx")]);
  assert.match(gym, /intent: "trial"/); assert.match(gym, /intent: "membership"/); assert.match(gym, /membershipName/); assert.match(gym, /intent: "class"/); assert.match(gym, /className/);
  assert.match(trainer, /targetType="trainer"/); assert.match(trainer, /intent="training"/);
  assert.match(nutritionist, /targetType="nutritionist"/); assert.match(nutritionist, /intent="consultation"/);
});

test("My Enquiries is protected and renders loading, empty, error, mixed history, statuses, and unavailable listings", async () => {
  const [page, app, navbar] = await Promise.all([read("src/pages/Enquiries/EnquiriesPage.jsx"), read("src/App.jsx"), read("src/components/layout/Navbar/Navbar.jsx")]);
  assert.match(app, /path="\/enquiries"/); assert.match(navbar, />Enquiries</); assert.match(page, /Navigate to="\/login"/);
  for (const marker of ["Loading enquiries", "No enquiries yet", "Try again", "Submitted", "Viewed", "Contacted", "Closed", "Listing is no longer available"]) assert.match(page, new RegExp(marker));
});

test("Favorites and Recently Viewed integrations remain mounted", async () => {
  const [main, favorites, gym] = await Promise.all([read("src/main.jsx"), read("src/context/FavoritesContext.jsx"), read("src/pages/GymDetailsPage/GymDetailsPage.jsx")]);
  assert.match(main, /FavoritesProvider/); assert.match(favorites, /fetchFavoriteIds/); assert.match(gym, /useRecentlyViewed/);
});
