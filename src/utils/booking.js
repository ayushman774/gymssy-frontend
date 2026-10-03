export const BOOKING_STATUS = Object.freeze({
  requested: { label: "Requested", message: "Waiting for provider confirmation" },
  confirmed: { label: "Confirmed", message: "Provider confirmed your booking" },
  rejected: { label: "Rejected", message: "Provider could not accept this request" },
  cancelled: { label: "Cancelled", message: "Booking cancelled" },
  completed: { label: "Completed", message: "Booking completed" },
});

export const BOOKING_TYPE_LABELS = Object.freeze({
  visit: "Gym visit", trial: "Trial", class: "Class", membership: "Membership",
  session: "Training session", consultation: "Nutrition consultation",
});

export function resolveBrowserTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!timezone) throw new Error("We could not determine your timezone. Check your browser settings and try again.");
  try { new Intl.DateTimeFormat("en", { timeZone: timezone }).format(); }
  catch { throw new Error("Your browser returned an invalid timezone. Check your browser settings and try again."); }
  return timezone;
}

export function buildScheduledFor(date, time, now = new Date()) {
  if (!date) throw new Error("Choose a preferred date.");
  if (!time) throw new Error("Choose a preferred time.");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const instant = new Date(year, month - 1, day, hour, minute, 0, 0);
  if ([year, month, day, hour, minute].some((value) => !Number.isInteger(value)) ||
      instant.getFullYear() !== year || instant.getMonth() !== month - 1 || instant.getDate() !== day ||
      instant.getHours() !== hour || instant.getMinutes() !== minute) {
    throw new Error("That local date and time does not exist in your timezone. Choose another time.");
  }
  if (instant.getTime() <= now.getTime()) throw new Error("Choose a date and time in the future.");
  return instant.toISOString();
}

export function formatBookingDateTime(value, timezone) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" };
  try { return new Intl.DateTimeFormat("en-IN", { ...options, timeZone: timezone }).format(date); }
  catch { return new Intl.DateTimeFormat("en-IN", { ...options, timeZone: "UTC" }).format(date); }
}

export function isCustomerCancellable(booking, now = new Date()) {
  if (booking?.status === "requested") return true;
  return booking?.status === "confirmed" && new Date(booking.scheduledFor).getTime() > now.getTime();
}

export function cancellationLabel(resolution) {
  if (resolution?.byRole === "provider") return "Cancelled by provider";
  if (resolution?.byRole === "customer") return "Cancelled by you";
  return "Booking cancelled";
}
