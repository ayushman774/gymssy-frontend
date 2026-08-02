/* ══════════════════════════════════════════════════════
   Recently Viewed — localStorage utility
   Key   : recentlyViewedGyms
   Shape : [{ slug: string, viewedAt: number }]
   Max   : 10 items (latest first)
══════════════════════════════════════════════════════ */

const STORAGE_KEY = "recentlyViewedGyms";
const MAX_ITEMS = 10;

/**
 * Read raw recently-viewed list from localStorage.
 * Always returns a clean array — never throws.
 */
export const getRawRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.slug === "string" &&
        typeof item.viewedAt === "number",
    );
  } catch {
    return [];
  }
};

/**
 * Persist the list back to localStorage.
 */
const persist = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage quota exceeded — silently fail
  }
};

/**
 * Record a gym visit.
 * - Removes existing entry for the same slug
 * - Prepends new entry with current timestamp
 * - Trims to MAX_ITEMS
 */
export const recordGymView = (slug) => {
  if (!slug || typeof slug !== "string") return;

  const existing = getRawRecentlyViewed().filter((item) => item.slug !== slug);

  const updated = [{ slug, viewedAt: Date.now() }, ...existing].slice(
    0,
    MAX_ITEMS,
  );

  persist(updated);
};

/**
 * Remove a single gym from recently viewed.
 */
export const removeFromRecentlyViewed = (slug) => {
  const updated = getRawRecentlyViewed().filter((item) => item.slug !== slug);
  persist(updated);
};

/**
 * Clear all recently viewed data.
 */
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
};
