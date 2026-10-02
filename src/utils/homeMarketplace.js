export const HOME_VENUE_LIMIT = 4;

export const HOME_VENUE_FILTERS = Object.freeze({
  entity: "venue",
  sort: "recommended",
  page: 1,
  limit: HOME_VENUE_LIMIT,
});

export function homeVenueLocation(venue) {
  return [venue.location?.area, venue.location?.city?.name]
    .filter(Boolean)
    .join(", ");
}

export function homeVenueTags(venue) {
  const taxonomy = Array.isArray(venue.subcategories)
    ? venue.subcategories
    : [];
  const summary = [venue.summary?.category, ...(venue.summary?.tags || [])];
  return [...new Set([...taxonomy, ...summary].filter(Boolean))];
}

function professionalImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.src || "";
}

export function normaliseFeaturedTrainer(raw) {
  return {
    id: raw._id ?? raw.id,
    name: raw.name,
    slug: raw.slug,
    role: raw.role ?? "",
    specialty: raw.specialty ?? "",
    experience: raw.experience ?? "",
    rating: raw.rating ?? 0,
    reviewCount: raw.reviews ?? raw.reviewCount ?? 0,
    image: professionalImageUrl(raw.image),
    available: raw.available,
    isVerified: raw.isVerified ?? raw.verified ?? false,
    href: raw.href || `/trainers/${raw.slug}`,
  };
}
