/**
 * useReducedMotion
 * Detects user's prefers-reduced-motion setting.
 * All animations must respect this preference.
 */

import { useState, useEffect } from "react";

const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
};

export default useReducedMotion;