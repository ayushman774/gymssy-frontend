const EARTH_RADIUS_KM = 6371;

function finiteCoordinate(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : null;
}

export function normalizeVenueCoordinates(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const latitude = finiteCoordinate(value.lat ?? value.latitude, -90, 90);
  const longitude = finiteCoordinate(value.lng ?? value.longitude, -180, 180);
  return latitude === null || longitude === null ? null : { latitude, longitude };
}

export function approximateDistanceKm(customerLocation, venueCoordinates) {
  const origin = normalizeVenueCoordinates(customerLocation);
  const destination = normalizeVenueCoordinates(venueCoordinates);
  if (!origin || !destination) return null;

  const radians = (degrees) => degrees * (Math.PI / 180);
  const latitudeDelta = radians(destination.latitude - origin.latitude);
  const longitudeDelta = radians(destination.longitude - origin.longitude);
  const originLatitude = radians(origin.latitude);
  const destinationLatitude = radians(destination.latitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  const distance = EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return Number.isFinite(distance) ? Number(distance.toFixed(1)) : null;
}

export function approximateDistanceLabel(customerLocation, venueCoordinates) {
  const value = approximateDistanceKm(customerLocation, venueCoordinates);
  return value === null ? null : {
    value,
    unit: "km",
    label: `${value} km away`,
    qualifier: "Approx. straight-line distance",
  };
}

export function googleMapsDirectionsUrl(venueCoordinates) {
  const destination = normalizeVenueCoordinates(venueCoordinates);
  if (!destination) return null;
  const params = new URLSearchParams({
    api: "1",
    destination: `${destination.latitude},${destination.longitude}`,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function createSafeLocationPopup(gym, documentRef = globalThis.document) {
  if (!documentRef?.createElement) return null;
  const container = documentRef.createElement("div");
  const name = documentRef.createElement("strong");
  const address = documentRef.createElement("span");
  container.className = "gymssy-location-popup";
  name.textContent = typeof gym?.name === "string" ? gym.name : "Gymssy venue";
  address.textContent = typeof gym?.location?.address === "string" ? gym.location.address : "";
  container.append(name, address);
  return container;
}
