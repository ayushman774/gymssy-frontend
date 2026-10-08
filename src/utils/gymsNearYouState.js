import { CUSTOMER_LOCATION_DEFAULT_RADIUS_KM, buildLocatedDiscoveryFilters } from "./customerLocation.js";

export const GYMS_NEAR_YOU_PAGE_SIZE = 12;

export function readGymsNearYouPage(search = "") {
  const page = Number.parseInt(new URLSearchParams(search).get("page") || "1", 10);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function gymsNearYouUrlSearch(page = 1) {
  return page > 1 ? `?page=${page}` : "";
}

export function buildGymsNearYouFilters(location, page = 1) {
  return buildLocatedDiscoveryFilters({
    entity: "venue",
    page,
    limit: GYMS_NEAR_YOU_PAGE_SIZE,
  }, location, CUSTOMER_LOCATION_DEFAULT_RADIUS_KM);
}
