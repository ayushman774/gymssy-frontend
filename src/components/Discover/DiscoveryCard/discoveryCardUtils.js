import { DISCOVERY_TYPES } from "../../../utils/discoveryState.js";

export const FALLBACK_IMAGE = "/images/logo/gymssy-logo.jpeg";
export const TYPE_LABELS = Object.fromEntries(DISCOVERY_TYPES);

export function listingLocation(item) {
  if (!item.location) return "";
  return [item.location.area, item.location.city?.name].filter(Boolean).join(", ");
}

export function listingTags(item) {
  const gymTypes = new Set(["gym", "fitness_centre", "wellness_centre", "sports_academy", "studio"]);
  if (gymTypes.has(item.entityType)) return item.subcategories || [];
  return [item.summary?.role, item.summary?.specialty, item.summary?.experience].filter(Boolean);
}

export function toCompareItem(item) {
  return {
    id: item.id,
    name: item.name,
    category: TYPE_LABELS[item.entityType] || item.entityType,
    image: item.image?.url || FALLBACK_IMAGE,
    rating: item.rating,
    reviews: item.reviewCount,
    price: item.price ? `${item.price.currency}${item.price.from}` : "—",
    verified: item.verified,
    amenities: listingTags(item),
    address: listingLocation(item),
    href: item.href,
  };
}
