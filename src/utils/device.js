/** Check if device is touch-based */
export const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/** Check if device prefers reduced motion */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Get device pixel ratio */
export const getPixelRatio = () =>
  typeof window !== "undefined"
    ? window.devicePixelRatio || 1
    : 1;

/** Check if mobile viewport */
export const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

/** Check if tablet viewport */
export const isTablet = () =>
  typeof window !== "undefined" &&
  window.innerWidth >= 768 &&
  window.innerWidth < 1024;

/** Check if desktop viewport */
export const isDesktop = () =>
  typeof window !== "undefined" && window.innerWidth >= 1024;