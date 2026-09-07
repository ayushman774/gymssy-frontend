import { useState, useEffect } from "react";
import { FALLBACK_WELLNESS_CITIES } from "../assets/data/wellnessData";

import {
  fetchWellnessExperiences,
  fetchFeaturedWellnessCenters,
  fetchFeaturedNutritionists,
} from "../services/categoryService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* ─────────────────────────────────────────────────────────────
   fetchWithFallback
   Used only by cities — unchanged.
───────────────────────────────────────────────────────────── */
const fetchWithFallback = async (endpoint, fallback) => {
  if (!BASE_URL) {
    return { data: fallback, source: "fallback" };
  }
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data ?? json, source: "api" };
  } catch {
    return { data: fallback, source: "fallback" };
  }
};

/* ─────────────────────────────────────────────────────────────
   useWellnessData
   Centers:       fetchFeaturedWellnessCenters  — no fallback
   Experiences:   fetchWellnessExperiences      — no fallback
   Cities:        fetchWithFallback             — FALLBACK_WELLNESS_CITIES
   Nutritionists: fetchFeaturedNutritionists    — no fallback
───────────────────────────────────────────────────────────── */
const useWellnessData = () => {
  const [centers,       setCenters]       = useState([]);
  const [experiences,   setExperiences]   = useState([]);
  const [cities,        setCities]        = useState([]);
  const [nutritionists, setNutritionists] = useState([]);

  const [loading, setLoading] = useState({
    centers:       true,
    experiences:   true,
    cities:        true,
    nutritionists: true,
  });

  const [error, setError] = useState({
    centers:       null,
    experiences:   null,
    cities:        null,
    nutritionists: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // ── Cities: existing fallback behavior — unchanged ──
      const citiesResultPromise = fetchWithFallback(
        "/api/cities/popular",
        FALLBACK_WELLNESS_CITIES,
      );

      // ── Centers ──
      let centersData  = [];
      let centersError = null;
      try {
        centersData = await fetchFeaturedWellnessCenters();
      } catch (err) {
        centersError = err?.message ?? "Failed to load wellness centers.";
      }

      // ── Experiences ──
      let experiencesData  = [];
      let experiencesError = null;
      try {
        experiencesData = await fetchWellnessExperiences();
      } catch (err) {
        experiencesError = err?.message ?? "Failed to load experiences.";
      }

      // ── Nutritionists ──
      let nutritionistsData  = [];
      let nutritionistsError = null;
      try {
        nutritionistsData = await fetchFeaturedNutritionists();
      } catch (err) {
        nutritionistsError =
          err?.message ?? "Failed to load nutritionists.";
      }

      const citiesResult = await citiesResultPromise;

      if (cancelled) return;

      setCenters(centersData);
      setExperiences(experiencesData);
      setCities(citiesResult.data.slice(0, 6));
      setNutritionists(nutritionistsData);

      setLoading({
        centers:       false,
        experiences:   false,
        cities:        false,
        nutritionists: false,
      });

      setError({
        centers:       centersError,
        experiences:   experiencesError,
        cities:        null,
        nutritionists: nutritionistsError,
      });
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { centers, experiences, cities, nutritionists, loading, error };
};

export default useWellnessData;