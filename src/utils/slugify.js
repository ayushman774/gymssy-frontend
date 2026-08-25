/**
 * slugify.js
 * Converts any string to a lowercase URL-safe slug.
 *
 * slugify("Marcus Reid")   → "marcus-reid"
 * slugify("Sofia Vega")    → "sofia-vega"
 * slugify("Dex Williams")  → "dex-williams"
 */
export const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");

export default slugify;
