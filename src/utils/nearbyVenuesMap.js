import { normalizeVenueCoordinates } from "./gymDetailLocation.js";

export function mapReadyVenues(listings = []) {
  if (!Array.isArray(listings)) return [];
  return listings.flatMap((listing) => {
    const coordinates = normalizeVenueCoordinates(listing?.coordinates);
    return coordinates ? [{ ...listing, coordinates }] : [];
  });
}

export function nextSelectedVenueId(selectedId, venues = []) {
  return venues.some((venue) => venue.id === selectedId) ? selectedId : venues[0]?.id || null;
}

export function safeVenueHref(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "";
}

export function createNearbyPopupContent(venue, { typeLabel = "Venue", distanceLabel = "", documentRef = globalThis.document } = {}) {
  if (!documentRef?.createElement) return null;
  const container = documentRef.createElement("div");
  const name = documentRef.createElement("strong");
  const type = documentRef.createElement("span");
  container.className = "gymssy-nearby-popup";
  name.textContent = typeof venue?.name === "string" ? venue.name : "Gymssy venue";
  type.textContent = typeLabel;
  container.append(name, type);
  if (distanceLabel) {
    const distance = documentRef.createElement("span");
    distance.textContent = distanceLabel;
    container.append(distance);
  }
  const href = safeVenueHref(venue?.href);
  if (href) {
    const link = documentRef.createElement("a");
    link.href = href;
    link.textContent = "View venue →";
    link.setAttribute("aria-label", `View details for ${name.textContent}`);
    container.append(link);
  }
  return container;
}
