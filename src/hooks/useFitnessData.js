// src/hooks/useFitnessData.js

import { useState, useEffect, useMemo } from "react";
import {
  FALLBACK_GYMS,
  FALLBACK_TRAINERS,
  FALLBACK_EXPERIENCES,
  FALLBACK_CITIES,
  FITNESS_SUBCATEGORIES,
} from "../assets/data/fitnessData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* ── Existing helper — UNCHANGED ── */
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

/* ──────────────────────────────────────────────────────────────
   FITNESS_SLUGS — UNCHANGED
────────────────────────────────────────────────────────────── */
const FITNESS_SLUGS = [
  "gyms",
  "personal-trainers",
  "pilates",
  "cardio",
  "crossfit",
  "hiit",
  "fitness-classes",
];

const SLUG_ALIAS = {};

/* ──────────────────────────────────────────────────────────────
   normalise — UNCHANGED
   "  Premium FITNESS Center  " → "premium fitness center"
────────────────────────────────────────────────────────────── */
const normalise = (str) =>
  (str ?? "").toLowerCase().trim().replace(/\s+/g, " ");

/* ── regex escape helper — UNCHANGED ── */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ──────────────────────────────────────────────────────────────
   FITNESS_CATEGORY_KEYWORDS — UNCHANGED (used for gyms)
────────────────────────────────────────────────────────────── */
const FITNESS_CATEGORY_KEYWORDS = new Set([
  "gym",
  "gyms",
  "fitness",
  "pilates",
  "cardio",
  "crossfit",
  "cross fit",
  "hiit",
  "fitness classes",
  "personal trainer",
  "personal trainers",
  "personal training",
  "strength training",
  "functional training",
  "weight training",
  "bootcamp",
  "boot camp",
  "premium gym",
  "24/7 gym",
  "24 7 gym",
  "luxury gym",
  "fitness studio",
  "fitness center",
  "fitness centre",
  "premium fitness center",
  "premium fitness centre",
  "athletic club",
  "sports club",
  "health club",
  "functional training",
]);

/* ──────────────────────────────────────────────────────────────
   FITNESS_SPECIALIZATION_KEYWORDS  ← NEW (for trainers)
   
   Trainer records use a free-text `specialization` field.
   These are normalised lowercase values that indicate a trainer
   belongs to the Fitness category.
   
   From the API response:
     "Strength & Conditioning" → FITNESS ✓
     "HIIT & Metabolic"        → FITNESS ✓
     "Body Recomposition"      → FITNESS ✓
     "Yoga & Mobility"         → NOT Fitness (Wellness) ✗
     "Boxing & Combat"         → NOT Fitness (Sports) ✗
   
   Strategy: token-based matching against fitness terms.
   A trainer passes if their specialization contains a fitness
   keyword token AND does NOT contain any exclusion token.
────────────────────────────────────────────────────────────── */
const FITNESS_SPECIALIZATION_KEYWORDS = new Set([
  /* Strength & muscle */
  "strength",
  "conditioning",
  "strength and conditioning",
  "strength & conditioning",
  "weight training",
  "powerlifting",
  "bodybuilding",
  "muscle",
  "hypertrophy",

  /* Body composition */
  "body recomposition",
  "recomposition",
  "fat loss",
  "weight loss",
  "body transformation",
  "physique",

  /* Cardiovascular / metabolic */
  "hiit",
  "metabolic",
  "cardio",
  "endurance",
  "interval training",

  /* Functional / athletic */
  "functional",
  "functional training",
  "athletic",
  "performance",
  "crossfit",
  "cross fit",

  /* Personal training */
  "personal training",
  "personal trainer",
  "general fitness",
  "fitness coaching",
  "fitness trainer",

  /* Specific disciplines under Fitness */
  "pilates",
  "circuit training",
  "bootcamp",
  "boot camp",
  "calisthenics",
  "kettlebell",
  "resistance training",
  "core training",
  "flexibility", // flexibility as part of fitness (not yoga specifically)
  "toning",
]);

/* ──────────────────────────────────────────────────────────────
   WELLNESS_EXCLUSIONS — shared by both gym and trainer filters
────────────────────────────────────────────────────────────── */
const WELLNESS_EXCLUSIONS = new Set([
  "yoga",
  "wellness",
  "spa",
  "meditation",
  "ayurveda",
  "naturopath",
  "mindfulness",
  "mobility", // "Yoga & Mobility" → excluded via "yoga"
]);

/* ──────────────────────────────────────────────────────────────
   SPORTS_EXCLUSIONS — shared by both gym and trainer filters
────────────────────────────────────────────────────────────── */
const SPORTS_EXCLUSIONS = new Set([
  "boxing",
  "combat",
  "martial arts",
  "mma",
  "bjj",
  "wrestling",
  "swimming",
  "football",
  "cricket",
  "badminton",
  "tennis",
  "basketball",
  "volleyball",
  "sports",
  "sports academy",
  "running club",
  "dance",
  "zumba",
]);

/* ──────────────────────────────────────────────────────────────
   buildFitnessTermSet — UNCHANGED
   Derives dynamic fitness terms from the Categories API.
────────────────────────────────────────────────────────────── */
const buildFitnessTermSet = (apiMainCategories) => {
  const terms = new Set();
  if (!Array.isArray(apiMainCategories)) return terms;

  const fitnessCat = apiMainCategories.find((c) => c.slug === "fitness");
  if (!fitnessCat) return terms;

  terms.add(normalise(fitnessCat.name));
  terms.add(normalise(fitnessCat.slug));

  (fitnessCat.subcategories ?? []).forEach((sub) => {
    if (sub.isActive === false) return;
    terms.add(normalise(sub.name));
    terms.add(normalise(sub.slug));
  });

  return terms;
};

/* ──────────────────────────────────────────────────────────────
   isExcluded — shared helper
   Returns true if the normalised string contains any token
   from the provided exclusion Set.
────────────────────────────────────────────────────────────── */
const isExcluded = (norm, exclusionSet) => {
  for (const exclusion of exclusionSet) {
    if (norm.includes(exclusion)) return true;
  }
  return false;
};

/* ──────────────────────────────────────────────────────────────
   containsFitnessToken — shared helper
   Returns true if the normalised string contains any token
   from the provided keyword Set as a whole-word match.
────────────────────────────────────────────────────────────── */
const containsFitnessToken = (norm, keywordSet) => {
  for (const keyword of keywordSet) {
    if (keyword.length < 3) continue;
    const pattern = new RegExp(
      `(?:^|[\\s&,/])${escapeRegex(keyword)}(?:[\\s&,/]|$)`,
    );
    if (pattern.test(norm)) return true;
    /* Also check exact full-string match */
    if (norm === keyword) return true;
  }
  return false;
};

/* ──────────────────────────────────────────────────────────────
   isFitnessGym — UNCHANGED from previous version
────────────────────────────────────────────────────────────── */
const isFitnessGym = (gymCategory, dynamicFitnessTerms) => {
  const norm = normalise(gymCategory);
  if (!norm) return false;

  /* Deny-list first */
  if (isExcluded(norm, WELLNESS_EXCLUSIONS)) return false;
  if (isExcluded(norm, SPORTS_EXCLUSIONS)) return false;

  /* Dynamic API terms — exact full-string */
  if (dynamicFitnessTerms.has(norm)) return true;

  /* Dynamic API terms — word boundary */
  for (const term of dynamicFitnessTerms) {
    if (term.length < 3) continue;
    const wordBoundary = new RegExp(`(?:^|\\s)${escapeRegex(term)}(?:\\s|$)`);
    if (wordBoundary.test(norm)) return true;
  }

  /* Static keywords */
  if (FITNESS_CATEGORY_KEYWORDS.has(norm)) return true;

  return false;
};

/* ──────────────────────────────────────────────────────────────
   isFitnessTrainer  ← NEW
   
   Returns true if the trainer's `specialization` field belongs
   to the Fitness category.
   
   Uses the SAME dynamic term set from the Categories API as
   isFitnessGym — no duplicate category system.
   
   Matching strategy:
   
   1. Apply WELLNESS_EXCLUSIONS deny-list (e.g. "yoga", "wellness")
   2. Apply SPORTS_EXCLUSIONS deny-list  (e.g. "boxing", "combat")
   3. Check dynamic API fitness terms (from Categories API)
   4. Check static FITNESS_SPECIALIZATION_KEYWORDS
   
   deny-list is checked FIRST so "Yoga & Strength" is excluded
   despite containing a fitness keyword.
────────────────────────────────────────────────────────────── */
const isFitnessTrainer = (specialization, dynamicFitnessTerms) => {
  const norm = normalise(specialization);
  if (!norm) return false;

  /* ── Step 1: Deny-lists take absolute priority ── */
  if (isExcluded(norm, WELLNESS_EXCLUSIONS)) return false;
  if (isExcluded(norm, SPORTS_EXCLUSIONS)) return false;

  /* ── Step 2: Check dynamic Categories API terms ── */
  /* Full-string exact match */
  if (dynamicFitnessTerms.has(norm)) return true;

  /* Word/token presence match — handles "Strength & Conditioning" */
  if (containsFitnessToken(norm, dynamicFitnessTerms)) return true;

  /* ── Step 3: Check static specialization keywords ── */
  if (containsFitnessToken(norm, FITNESS_SPECIALIZATION_KEYWORDS)) return true;

  return false;
};

/* ──────────────────────────────────────────────────────────────
   mergeFitnessCategories — UNCHANGED
────────────────────────────────────────────────────────────── */
const mergeFitnessCategories = (apiMainCategories) => {
  const fitnessCat = Array.isArray(apiMainCategories)
    ? apiMainCategories.find((c) => c.slug === "fitness")
    : null;

  const apiSubcategories = fitnessCat?.subcategories ?? [];

  if (apiSubcategories.length === 0) {
    return FITNESS_SUBCATEGORIES;
  }

  const frontendMap = new Map(
    FITNESS_SUBCATEGORIES.map((item) => [item.slug, item]),
  );

  return FITNESS_SLUGS.map((apiSlug) => {
    const frontendSlug = SLUG_ALIAS[apiSlug] ?? apiSlug;
    const apiItem = apiSubcategories.find((s) => s.slug === apiSlug);
    const frontendItem = frontendMap.get(frontendSlug);

    if (!apiItem && !frontendItem) return null;

    if (apiItem) {
      return {
        id: apiItem._id ?? frontendItem?.id ?? apiSlug,
        title: apiItem.name ?? frontendItem?.title ?? "",
        slug: apiItem.slug,
        description: apiItem.description ?? frontendItem?.description ?? "",
        count: apiItem.count ?? frontendItem?.count ?? 0,
        icon: apiItem.icon ?? null,
        image: frontendItem?.image ?? "",
      };
    }

    return frontendItem ?? null;
  }).filter(Boolean);
};

/* ──────────────────────────────────────────────────────────────
   HOOK
────────────────────────────────────────────────────────────── */
const useFitnessData = () => {
  const [allFeaturedGyms, setAllFeaturedGyms] = useState([]);
  const [allFeaturedTrainers, setAllFeaturedTrainers] = useState([]); // ← NEW raw state
  const [rawCategories, setRawCategories] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [cities, setCities] = useState([]);
  const [fitnessCategories, setFitnessCategories] = useState(
    FITNESS_SUBCATEGORIES,
  );

  const [loading, setLoading] = useState({
    gyms: true,
    trainers: true,
    experiences: true,
    cities: true,
    categories: true,
  });

  const [error, setError] = useState({
    gyms: null,
    trainers: null,
    experiences: null,
    cities: null,
    categories: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [
        gymsResult,
        trainersResult,
        experiencesResult,
        citiesResult,
        categoriesResult,
      ] = await Promise.all([
        fetchWithFallback("/api/gyms/featured", FALLBACK_GYMS),
        fetchWithFallback("/api/trainers/featured", FALLBACK_TRAINERS),
        fetchWithFallback("/api/experiences/trending", FALLBACK_EXPERIENCES),
        fetchWithFallback("/api/cities/popular", FALLBACK_CITIES),
        fetchWithFallback("/api/categories", []),
      ]);

      if (cancelled) return;

      const apiCategories = Array.isArray(categoriesResult.data)
        ? categoriesResult.data
        : [];

      /* Store raw — filtering happens in useMemo below */
      setAllFeaturedGyms(gymsResult.data);
      setAllFeaturedTrainers(trainersResult.data); // ← store raw trainers
      setRawCategories(apiCategories);

      setExperiences(experiencesResult.data.slice(0, 6));
      setCities(citiesResult.data.slice(0, 6));
      setFitnessCategories(mergeFitnessCategories(apiCategories));

      setLoading({
        gyms: false,
        trainers: false,
        experiences: false,
        cities: false,
        categories: false,
      });
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ────────────────────────────────────────────────────────────
     Filter gyms to Fitness-only — UNCHANGED logic
  ──────────────────────────────────────────────────────────── */
  const gyms = useMemo(() => {
    const dynamicFitnessTerms = buildFitnessTermSet(rawCategories);
    return allFeaturedGyms
      .filter((gym) => isFitnessGym(gym.category, dynamicFitnessTerms))
      .slice(0, 6);
  }, [allFeaturedGyms, rawCategories]);

  /* ────────────────────────────────────────────────────────────
     Filter trainers to Fitness-only  ← NEW
     
     Same dynamicFitnessTerms built from the SAME rawCategories
     that the gym filter uses — no duplicate category fetch.
     
     Flow:
       1. buildFitnessTermSet(rawCategories) → Set of fitness terms
       2. filter each trainer: isFitnessTrainer(trainer.specialization, terms)
       3. slice to max 4 for display
  ──────────────────────────────────────────────────────────── */
  const trainers = useMemo(() => {
    const dynamicFitnessTerms = buildFitnessTermSet(rawCategories);
    return allFeaturedTrainers
      .filter((trainer) =>
        isFitnessTrainer(trainer.specialization, dynamicFitnessTerms),
      )
      .slice(0, 4);
  }, [allFeaturedTrainers, rawCategories]);

  return {
    gyms,
    trainers, // ← now filtered to Fitness-only
    experiences,
    cities,
    fitnessCategories,
    loading,
    error,
  };
};

export default useFitnessData;
