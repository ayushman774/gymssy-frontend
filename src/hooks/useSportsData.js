// src/hooks/useSportsData.js

import { useState, useEffect } from "react";
import {
  FALLBACK_ACADEMIES,
  // FALLBACK_COACHES is intentionally NOT used here —
  // Expert Sports Coaches must show API data or empty state only.
  // Using FALLBACK_COACHES would show generic Fitness trainers.
  FALLBACK_SPORTS_EXPERIENCES,
  FALLBACK_CITIES,
} from "../assets/data/sportsData";

const BASE_URL = import.meta.env.VITE_API_URL ?? "https://api.gymssy.com";

/* ─────────────────────────────────────────────────────
   Internal fetch helper
───────────────────────────────────────────────────── */
const fetchJSON = async (url) => {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(tid);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
};

/* ─────────────────────────────────────────────────────
   Normalizers — UNCHANGED from previous fix
───────────────────────────────────────────────────── */
const resolveLocation = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;
  if (typeof location === "object") {
    const { area, city } = location;
    if (area && city) return `${area}, ${city}`;
    if (city) return city;
    if (area) return area;
    return "";
  }
  return "";
};

const resolveImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object") return image.url ?? image.src ?? "";
  return "";
};

const resolveReviews = (reviews) => {
  if (typeof reviews === "number") return reviews;
  if (Array.isArray(reviews)) return reviews.length;
  return 0;
};

const normalizeAcademy = (gym) => ({
  ...gym,
  id: gym._id ?? gym.id,
  image: resolveImageUrl(gym.image ?? gym.images?.cover),
  location: resolveLocation(gym.location),
  reviews: resolveReviews(gym.reviews),
  isOpen: Boolean(gym.isOpen ?? gym.open),
  isVerified: Boolean(gym.isVerified ?? gym.verified),
  priceFrom: gym.priceFrom ?? gym.price ?? gym.startingPrice ?? null,
});

/* ─────────────────────────────────────────────────────
   normalizeSportsCoach
   Maps the /api/trainers/featured?category=sports response
   to the shape SportsCoachCard already expects:

   API field          → Card prop
   ─────────────────────────────────────────────
   _id / id           → id
   image.src          → image  (string, card does src={coach.image})
   specialty / role   → specialization
   experience         → experience
   rating             → rating
   reviews (number)   → reviews
   available          → isAvailable
   slug               → slug  (navigate `/trainer/${coach.slug}`)
   pricePerSession    → pricePerSession  (may be absent — card guards with if)
───────────────────────────────────────────────────── */
const normalizeSportsCoach = (trainer) => ({
  ...trainer,
  id: trainer._id ?? trainer.id,

  // image MUST be a string — SportsCoachCard does src={coach.image}
  image: resolveImageUrl(trainer.image),

  // reviews must be a number — card renders ({coach.reviews})
  reviews: resolveReviews(trainer.reviews),

  // SportsCoachCard reads coach.specialization
  // API returns specialty and role — map both as fallback chain
  specialization:
    trainer.specialization ?? trainer.specialty ?? trainer.role ?? "",

  experience: trainer.experience ?? "",

  // Availability — API field is "available"
  isAvailable: trainer.isAvailable ?? trainer.available ?? true,

  // Price — API may not include this; card already guards: if (price)
  pricePerSession:
    trainer.pricePerSession ?? trainer.pricePerHour ?? trainer.price ?? null,
});

const normalizeExperience = (exp) => ({
  ...exp,
  id: exp._id ?? exp.id,
  image: resolveImageUrl(exp.image),
  duration:
    typeof exp.duration === "number"
      ? `${exp.duration} min`
      : (exp.duration ?? ""),
  spots:
    typeof exp.spots === "number"
      ? exp.spots
      : (exp.capacity ?? exp.maxParticipants ?? 0),
  priceFrom: exp.priceFrom ?? exp.price ?? exp.startingPrice ?? 0,
  trending: Boolean(exp.trending ?? exp.isTrending),
  level: exp.level ?? exp.difficulty ?? "",
});

const normalizeCity = (city) => ({
  id: city._id ?? city.id ?? city.slug,
  name: city.name,
  gymCount: city.count ?? city.gymCount ?? "500+",
  image: resolveImageUrl(city.image),
  slug: city.slug ?? "",
});

const extractList = (data, ...keys) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

/* ══════════════════════════════════════════════════════
   useSportsData
══════════════════════════════════════════════════════ */
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

    /* ── Academies — UNCHANGED ── */
    fetchJSON(`${BASE_URL}/api/gyms/featured?type=sports`)
      .then((data) => {
        if (cancelled) return;
        const raw = extractList(data, "gyms", "data");
        const list = raw.map(normalizeAcademy);
        setAcademies(list.length ? list : FALLBACK_ACADEMIES);
        setError((p) => ({ ...p, academies: null }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[useSportsData] academies:", err);
        setAcademies(FALLBACK_ACADEMIES);
        setError((p) => ({ ...p, academies: err.message ?? "Failed" }));
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, academies: false }));
      });

    /* ── Sports Coaches
       ✅ CHANGED: /api/trainers/featured → /api/trainers/featured?category=sports
       ✅ CHANGED: empty API → setCoaches([])  (no fallback to generic trainers)
       ✅ CHANGED: API error → setCoaches([])  (no FALLBACK_COACHES)
    ── */
    fetchJSON(`${BASE_URL}/api/trainers/featured?category=sports`)
      .then((data) => {
        if (cancelled) return;

        const raw = extractList(data, "trainers", "data");
        const list = raw.map(normalizeSportsCoach);

        // Empty API response → empty state, NOT fallback coaches
        setCoaches(list);
        setError((p) => ({ ...p, coaches: null }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[useSportsData] coaches:", err);

        // API failure → empty array so Sports page shows error/empty UI
        // FALLBACK_COACHES is intentionally NOT used here
        setCoaches([]);
        setError((p) => ({
          ...p,
          coaches: err.message ?? "Failed to load sports coaches.",
        }));
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, coaches: false }));
      });

    /* ── Experiences — UNCHANGED ── */
    fetchJSON(`${BASE_URL}/api/experiences/trending?type=sports`)
      .then((data) => {
        if (cancelled) return;
        const raw = extractList(data, "experiences", "data");
        const list = raw.map(normalizeExperience);
        setExperiences(list.length ? list : FALLBACK_SPORTS_EXPERIENCES);
        setError((p) => ({ ...p, experiences: null }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[useSportsData] experiences:", err);
        setExperiences(FALLBACK_SPORTS_EXPERIENCES);
        setError((p) => ({ ...p, experiences: err.message ?? "Failed" }));
      })
      .finally(() => {
        if (!cancelled) setLoading((p) => ({ ...p, experiences: false }));
      });

    /* ── Cities — UNCHANGED ── */
    fetchJSON(`${BASE_URL}/api/cities/popular`)
      .then((data) => {
        if (cancelled) return;
        const raw = extractList(data, "cities", "data");
        const list = raw.map(normalizeCity);
        setCities(list.length ? list : FALLBACK_CITIES);
        setError((p) => ({ ...p, cities: null }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[useSportsData] cities:", err);
        setCities(FALLBACK_CITIES);
        setError((p) => ({ ...p, cities: err.message ?? "Failed" }));
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
