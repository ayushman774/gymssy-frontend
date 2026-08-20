import { useState, useEffect } from "react";
import {
  FALLBACK_WELLNESS_CENTERS,
  FALLBACK_WELLNESS_EXPERIENCES,
  FALLBACK_WELLNESS_CITIES,
} from "../assets/data/wellnessData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

const useWellnessData = () => {
  const [centers, setCenters] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState({
    centers: true,
    experiences: true,
    cities: true,
  });

  const [error, setError] = useState({
    centers: null,
    experiences: null,
    cities: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [centersResult, experiencesResult, citiesResult] =
        await Promise.all([
          /* 
            Attempt wellness-filtered gym endpoint.
            Falls back to static wellness centers if API
            doesn't yet support ?type=wellness filter.
          */
          fetchWithFallback(
            "/api/gyms/featured?type=wellness",
            FALLBACK_WELLNESS_CENTERS,
          ),
          fetchWithFallback(
            "/api/experiences/trending?type=wellness",
            FALLBACK_WELLNESS_EXPERIENCES,
          ),
          /* Same cities endpoint as fitness page */
          fetchWithFallback("/api/cities/popular", FALLBACK_WELLNESS_CITIES),
        ]);

      if (cancelled) return;

      setCenters(centersResult.data.slice(0, 6));
      setExperiences(experiencesResult.data.slice(0, 6));
      setCities(citiesResult.data.slice(0, 6));

      setLoading({ centers: false, experiences: false, cities: false });
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { centers, experiences, cities, loading, error };
};

export default useWellnessData;
