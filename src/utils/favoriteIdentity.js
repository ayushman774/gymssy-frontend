const GYM_TYPES = new Set(["gym", "fitness_centre", "wellness_centre", "sports_academy", "studio"]);

export function favoriteTargetType(entityType) {
  if (GYM_TYPES.has(entityType)) return "gym";
  if (entityType === "trainer" || entityType === "coach") return "trainer";
  if (entityType === "nutritionist") return "nutritionist";
  return null;
}

export const favoriteKey = (targetType, targetId) => `${targetType}:${targetId}`;
