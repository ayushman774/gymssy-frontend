import { useState, useEffect } from "react";
import {
  FALLBACK_GYMS,
  FALLBACK_TRAINERS,
  FALLBACK_EXPERIENCES,
  FALLBACK_CITIES,
} from "../assets/data/fitnessData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const fetchWithFallback = async (endpoint, fallback) => {
  if (!BASE_URL) {
    /* No API configured — use fallback immediately */
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

const useFitnessData = () => {
  const [gyms, setGyms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState({
    gyms: true,
    trainers: true,
    experiences: true,
    cities: true,
  });

  const [error, setError] = useState({
    gyms: null,
    trainers: null,
    experiences: null,
    cities: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      /* Fetch all in parallel */
      const [gymsResult, trainersResult, experiencesResult, citiesResult] =
        await Promise.all([
          fetchWithFallback("/api/gyms/featured", FALLBACK_GYMS),
          fetchWithFallback("/api/trainers/featured", FALLBACK_TRAINERS),
          fetchWithFallback("/api/experiences/trending", FALLBACK_EXPERIENCES),
          fetchWithFallback("/api/cities/popular", FALLBACK_CITIES),
        ]);

      if (cancelled) return;

      setGyms(gymsResult.data.slice(0, 6));
      setTrainers(trainersResult.data.slice(0, 4));
      setExperiences(experiencesResult.data.slice(0, 6));
      setCities(citiesResult.data.slice(0, 6));

      setLoading({
        gyms: false,
        trainers: false,
        experiences: false,
        cities: false,
      });
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { gyms, trainers, experiences, cities, loading, error };
};

export default useFitnessData;
