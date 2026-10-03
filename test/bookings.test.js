import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildScheduledFor, formatBookingDateTime, isCustomerCancellable } from "../src/utils/booking.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("booking service uses centralized authenticated create, history, detail, and cancel APIs", async () => {
  const source = await read("src/services/bookingService.js");
  assert.match(source, /apiRequest\("\/bookings"/); assert.match(source, /method: "POST"/); assert.match(source, /getBookings/); assert.match(source, /getBooking/); assert.match(source, /cancelBooking/); assert.match(source, /Authorization|token/);
});

test("booking dialog preserves return path, prefills contact, validates time, locks submit, and sends only allowed payload", async () => {
  const source = await read("src/components/Bookings/BookingDialog.jsx");
  for (const marker of ["user?.name", "user?.email", "user?.phone", "buildScheduledFor", "resolveBrowserTimezone", "Booking request sent", "View My Bookings"]) assert.ok(source.includes(marker));
  assert.match(source, /if \(pending\) return/); assert.match(source, /disabled=\{pending\}/);
  assert.match(source, /navigate\("\/login"/); assert.match(source, /state: \{ from:/); assert.match(source, /service = \{ name: serviceName \}/);
  for (const forbidden of ["customerId", "providerId", "listingSnapshot", "serviceSnapshot", "paymentStatus", "price:"]) assert.doesNotMatch(source, new RegExp(forbidden));
});

test("local date-time construction is future-only and always produces an explicit UTC instant", () => {
  const future = new Date(Date.now() + 86_400_000); const date = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`; const time = `${String(future.getHours()).padStart(2, "0")}:${String(future.getMinutes()).padStart(2, "0")}`;
  assert.match(buildScheduledFor(date, time, new Date(0)), /Z$/);
  assert.throws(() => buildScheduledFor("2020-01-01", "00:00"), /future/);
  assert.equal(formatBookingDateTime("2026-10-10T10:30:00+05:30", "Invalid/Timezone").includes("2026"), true);
  for (const timezone of ["Asia/Kolkata", "UTC", "America/New_York"]) assert.match(formatBookingDateTime("2026-10-10T10:30:00Z", timezone), /2026/);
});

test("Gym, Trainer/Coach, and Nutritionist booking CTAs map to real supported contracts", async () => {
  const [gym, trainer, nutritionist] = await Promise.all([read("src/pages/GymDetailsPage/GymDetailsPage.jsx"), read("src/pages/TrainerDetail/TrainerDetail.jsx"), read("src/pages/Nutritionists/NutritionistDetailsPage.jsx")]);
  assert.match(gym, /bookingType: "visit"/); assert.match(gym, /bookingType: "class"/); assert.match(gym, /bookingType: "membership"/); assert.match(gym, /serviceName: gymClass.name/); assert.match(gym, /serviceName: membership.name/);
  assert.match(trainer, /targetType="trainer"/); assert.match(trainer, /bookingType="session"/); assert.match(nutritionist, /targetType="nutritionist"/); assert.match(nutritionist, /bookingType="consultation"/);
});

test("My Bookings is protected, server-paginated, and covers loading, empty, error, statuses and timezone display", async () => {
  const [page, app, navbar] = await Promise.all([read("src/pages/Bookings/BookingsPage.jsx"), read("src/App.jsx"), read("src/components/layout/Navbar/Navbar.jsx")]);
  assert.match(app, /path="\/bookings"/); assert.match(app, /path="\/bookings\/:id"/); assert.match(navbar, />My Bookings</); assert.match(page, /Navigate to="\/login"/); assert.match(page, /getBookings\(token, \{ page, limit: 12 \}\)/);
  for (const marker of ["Loading bookings", "No bookings yet", "Try again", "BookingStatus", "formatBookingDateTime"]) assert.match(page, new RegExp(marker));
});

test("booking detail renders snapshots, history, resolution and backend-backed cancellation", async () => {
  const source = await read("src/pages/Bookings/BookingDetailPage.jsx");
  for (const marker of ["listing?.name", "service?.name", "contact?.name", "statusHistory", "Provider response", "Cancelled by provider", "Cancelled by you", "cancelBooking", "CancelBookingDialog"]) assert.match(source, new RegExp(marker.replace(/[?.]/g, "\\$&")));
  assert.equal(isCustomerCancellable({ status: "requested", scheduledFor: new Date(0) }), true);
  assert.equal(isCustomerCancellable({ status: "confirmed", scheduledFor: new Date(Date.now() + 60_000) }), true);
  assert.equal(isCustomerCancellable({ status: "completed", scheduledFor: new Date(Date.now() + 60_000) }), false);
});

test("customer-facing booking copy avoids fake availability, payment, notification, and reservation claims", async () => {
  const sources = (await Promise.all(["src/components/Bookings/BookingDialog.jsx", "src/pages/Bookings/BookingsPage.jsx", "src/pages/Bookings/BookingDetailPage.jsx"].map(read))).join("\n");
  assert.match(sources, /provider will confirm your booking request/i); assert.doesNotMatch(sources, /slot reserved|seat reserved|instant booking|payment successful|we.ll notify you/i);
});
