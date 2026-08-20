/* ══════════════════════════════════════════════════════
   GYMSSY — Hierarchical Category Data
   3 main categories, each with subcategories.
   Replace image URLs with your own CDN assets.
   Backend: map using category.type field if available.
══════════════════════════════════════════════════════ */

export const MAIN_CATEGORIES = [
  {
    id: "fitness",
    title: "Fitness",
    description: "Gyms, Trainers, Fitness Classes & more",
    slug: "fitness",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85&fit=crop&auto=format",
    accentColor: "#39ff14",
    count: "2,400+ centers",
    subcategories: [
      {
        id: "gyms",
        title: "Gyms",
        slug: "gyms",
        icon: "🏋️",
        count: "1,200+",
      },
      {
        id: "personal-trainers",
        title: "Personal Trainers",
        slug: "personal-trainers",
        icon: "💪",
        count: "800+",
      },
      {
        id: "crossfit",
        title: "CrossFit",
        slug: "crossfit",
        icon: "🔥",
        count: "340+",
      },
      {
        id: "pilates",
        title: "Pilates",
        slug: "pilates",
        icon: "🤸",
        count: "290+",
      },
      {
        id: "cardio",
        title: "Cardio",
        slug: "cardio",
        icon: "🚴",
        count: "410+",
      },
      {
        id: "hiit",
        title: "HIIT",
        slug: "hiit",
        icon: "⚡",
        count: "220+",
      },
      {
        id: "fitness-classes",
        title: "Fitness Classes",
        slug: "fitness-classes",
        icon: "🎯",
        count: "560+",
      },
    ],
  },
  {
    id: "wellness",
    title: "Wellness",
    description: "Yoga, Meditation, Spa, Nutrition & more",
    slug: "wellness",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=85&fit=crop&auto=format",
    accentColor: "#39ff14",
    count: "1,800+ centers",
    subcategories: [
      {
        id: "yoga",
        title: "Yoga",
        slug: "yoga",
        icon: "🧘",
        count: "620+",
      },
      {
        id: "meditation",
        title: "Meditation",
        slug: "meditation",
        icon: "🌿",
        count: "310+",
      },
      {
        id: "spa",
        title: "Spa & Recovery",
        slug: "spa",
        icon: "✨",
        count: "280+",
      },
      {
        id: "nutrition",
        title: "Nutrition",
        slug: "nutrition",
        icon: "🥗",
        count: "190+",
      },
      {
        id: "wellness-centers",
        title: "Wellness Centers",
        slug: "wellness-centers",
        icon: "🏡",
        count: "240+",
      },
      {
        id: "recovery",
        title: "Recovery",
        slug: "recovery",
        icon: "💆",
        count: "160+",
      },
      {
        id: "mobility",
        title: "Mobility",
        slug: "mobility",
        icon: "🔄",
        count: "140+",
      },
    ],
  },
  {
    id: "sports",
    title: "Sports",
    description: "Coaching, Academies, Courts & more",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=85&fit=crop&auto=format",
    accentColor: "#38bdf8",
    count: "1,200+ centers",
    subcategories: [
      {
        id: "swimming",
        title: "Swimming",
        slug: "swimming",
        icon: "🏊",
        count: "320+",
      },
      {
        id: "martial-arts",
        title: "Martial Arts",
        slug: "martial-arts",
        icon: "🥋",
        count: "410+",
      },
      {
        id: "boxing",
        title: "Boxing",
        slug: "boxing",
        icon: "🥊",
        count: "280+",
      },
      {
        id: "sports-coaching",
        title: "Sports Coaching",
        slug: "sports-coaching",
        icon: "🏅",
        count: "360+",
      },
      {
        id: "running-clubs",
        title: "Running Clubs",
        slug: "running-clubs",
        icon: "🏃",
        count: "190+",
      },
      {
        id: "tennis",
        title: "Tennis",
        slug: "tennis",
        icon: "🎾",
        count: "220+",
      },
      {
        id: "badminton",
        title: "Badminton",
        slug: "badminton",
        icon: "🏸",
        count: "175+",
      },
      {
        id: "football",
        title: "Football",
        slug: "football",
        icon: "⚽",
        count: "145+",
      },
    ],
  },
];

/* ── Helper: get main category by id ── */
export const getMainCategory = (id) =>
  MAIN_CATEGORIES.find((c) => c.id === id) ?? null;

/* ── Helper: get all subcategories flat (for API mapping) ── */
export const getAllSubcategories = () =>
  MAIN_CATEGORIES.flatMap((c) =>
    c.subcategories.map((s) => ({ ...s, parentId: c.id })),
  );

/* ── Helper: map backend categories by type field ──
   Use this if your backend returns { type: "fitness" | "wellness" | "sports" }
   
   const grouped = groupBackendCategories(apiCategories);
─────────────────────────────────────────────────── */
export const groupBackendCategories = (apiCategories) => {
  return MAIN_CATEGORIES.map((main) => ({
    ...main,
    subcategories: apiCategories.filter((cat) => cat.type === main.id),
  }));
};
