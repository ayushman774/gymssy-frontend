import { useState, useEffect } from "react";
import {
  FALLBACK_ACADEMIES,
  FALLBACK_COACHES,
  FALLBACK_SPORTS_EXPERIENCES,
  FALLBACK_CITIES,
} from "../assets/data/sportsData";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://gymssy-backend.netlify.app";

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const useSportsData = () => {
  const [academies, setAcademies] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState({
    academies: true,
    coaches: true,
    experiences: true,
    cities: true,
  });

  const [error, setError] = useState({
    academies: null,
    coaches: null,
    experiences: null,
    cities: null,
  });

  useEffect(() => {
    let cancelled = false;

    /* ── Academies — reuses /api/gyms/featured ── */
    fetchJSON(`${BASE_URL}/api/gyms/featured`)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : (data?.gyms ?? data?.data ?? []);
        setAcademies(list.length ? list : FALLBACK_ACADEMIES);
      })
      .catch(() => {
        if (!cancelled) setAcademies(FALLBACK_ACADEMIES);
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, academies: false }));
      });

    /* ── Coaches — reuses /api/trainers/featured ──
       NOTE: Current API returns general fitness trainers.
       Sports-specific filter not yet available on backend.
       Required: /api/trainers/featured?type=sports
       Falling back to sports-specific static data. ── */
    fetchJSON(`${BASE_URL}/api/trainers/featured`)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : (data?.trainers ?? data?.data ?? []);
        // Use API data if available, but note it may contain
        // general fitness trainers rather than sports coaches.
        setCoaches(list.length ? list : FALLBACK_COACHES);
      })
      .catch(() => {
        if (!cancelled) setCoaches(FALLBACK_COACHES);
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, coaches: false }));
      });

    /* ── Experiences — reuses /api/experiences/trending ── */
    fetchJSON(`${BASE_URL}/api/experiences/trending`)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : (data?.experiences ?? data?.data ?? []);
        setExperiences(list.length ? list : FALLBACK_SPORTS_EXPERIENCES);
      })
      .catch(() => {
        if (!cancelled) setExperiences(FALLBACK_SPORTS_EXPERIENCES);
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, experiences: false }));
      });

    /* ── Cities — reuses /api/cities/popular ── */
    fetchJSON(`${BASE_URL}/api/cities/popular`)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : (data?.cities ?? data?.data ?? []);
        // Normalise to CityCard prop shape: { id, name, gymCount, image }
        const normalised = list.map((c) => ({
          id: c._id ?? c.id ?? c.slug,
          name: c.name,
          gymCount: c.count ?? c.gymCount ?? "500+",
          image: c.image?.url ?? c.image ?? "",
        }));
        setCities(normalised.length ? normalised : FALLBACK_CITIES);
      })
      .catch(() => {
        if (!cancelled) setCities(FALLBACK_CITIES);
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, cities: false }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { academies, coaches, experiences, cities, loading, error };
};

export default useSportsData;
