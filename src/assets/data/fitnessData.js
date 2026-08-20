/* ══════════════════════════════════════════════════════
   FITNESS PAGE — Static/Fallback Data
   Used when API is unavailable or for initial render.
   Replace with real API responses when backend is ready.
══════════════════════════════════════════════════════ */

/* ── Fitness Subcategories ── */
export const FITNESS_SUBCATEGORIES = [
  {
    id: "gyms",
    title: "Gyms",
    slug: "gyms",
    description: "Find premium gyms near you",
    count: "1,200+",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
  {
    id: "personal-trainers",
    title: "Personal Trainers",
    slug: "personal-trainers",
    description: "Train 1-on-1 with certified coaches",
    count: "800+",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
  {
    id: "crossfit",
    title: "CrossFit",
    slug: "crossfit",
    description: "High-intensity functional training",
    count: "340+",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
  {
    id: "pilates",
    title: "Pilates",
    slug: "pilates",
    description: "Core strength and flexibility",
    count: "290+",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
  {
    id: "cardio",
    title: "Cardio",
    slug: "cardio",
    description: "Boost endurance and burn calories",
    count: "410+",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
  {
    id: "hiit",
    title: "HIIT",
    slug: "hiit",
    description: "Maximum results in minimum time",
    count: "220+",
    image:
      "https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
  {
    id: "fitness-classes",
    title: "Fitness Classes",
    slug: "fitness-classes",
    description: "Group classes for every level",
    count: "560+",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=800&q=80&fit=crop&auto=format",
    accentColor: "#39ff14",
  },
];

/* ── Fitness Goals ── */
export const FITNESS_GOALS = [
  {
    id: "build-strength",
    title: "Build Strength",
    icon: "🏋️",
    description: "Powerlifting, strength training and resistance workouts",
    query: "strength",
  },
  {
    id: "lose-weight",
    title: "Lose Weight",
    icon: "🔥",
    description: "Cardio, HIIT and fat-burning fitness experiences",
    query: "weight-loss",
  },
  {
    id: "improve-endurance",
    title: "Improve Endurance",
    icon: "🏃",
    description: "Running clubs, cardio classes and stamina training",
    query: "endurance",
  },
  {
    id: "build-muscle",
    title: "Build Muscle",
    icon: "💪",
    description: "Bodybuilding, hypertrophy and muscle-focused training",
    query: "muscle",
  },
  {
    id: "improve-mobility",
    title: "Improve Mobility",
    icon: "🤸",
    description: "Flexibility, stretching and mobility-focused sessions",
    query: "mobility",
  },
  {
    id: "get-active",
    title: "Get Active",
    icon: "⚡",
    description: "Beginner-friendly classes and fitness introductions",
    query: "beginner",
  },
];

/* ── Why Gymssy Benefits ── */
export const FITNESS_BENEFITS = [
  {
    id: "verified",
    icon: "✓",
    title: "Verified Providers",
    description:
      "Discover gyms, trainers and fitness businesses verified by the Gymssy team.",
  },
  {
    id: "compare",
    icon: "⇄",
    title: "Compare Easily",
    description:
      "Compare ratings, facilities, prices and experiences side by side.",
  },
  {
    id: "personalised",
    icon: "◎",
    title: "Find What Fits You",
    description:
      "Explore options based on your goals, location and preferences.",
  },
  {
    id: "trust",
    icon: "◈",
    title: "Book With Confidence",
    description: "Discover fitness experiences through one trusted platform.",
  },
];

/* ── Fallback Featured Gyms (when API unavailable) ── */
export const FALLBACK_GYMS = [
  {
    id: "rv-001",
    slug: "cult-fit-indiranagar",
    name: "Cult.fit Indiranagar",
    category: "Premium Gym",
    location: "Indiranagar, Bengaluru",
    distance: "1.2 km",
    rating: 4.9,
    reviews: 1842,
    priceFrom: 999,
    isOpen: true,
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "rv-002",
    slug: "anytime-fitness-koramangala",
    name: "Anytime Fitness",
    category: "24/7 Gym",
    location: "Koramangala, Bengaluru",
    distance: "2.4 km",
    rating: 4.7,
    reviews: 963,
    priceFrom: 1499,
    isOpen: true,
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "rv-003",
    slug: "crossfit-chennai-nungambakkam",
    name: "CrossFit Chennai",
    category: "CrossFit",
    location: "Nungambakkam, Chennai",
    distance: "0.9 km",
    rating: 4.6,
    reviews: 412,
    priceFrom: 1299,
    isOpen: true,
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "rv-004",
    slug: "gold-gym-connaught-place",
    name: "Gold's Gym CP",
    category: "Premium Gym",
    location: "Connaught Place, Delhi",
    distance: "2.8 km",
    rating: 4.7,
    reviews: 2103,
    priceFrom: 1599,
    isOpen: true,
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "rv-005",
    slug: "the-pilates-studio-bandra",
    name: "The Pilates Studio",
    category: "Pilates",
    location: "Bandra West, Mumbai",
    distance: "1.7 km",
    rating: 5.0,
    reviews: 338,
    priceFrom: 1899,
    isOpen: true,
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "rv-006",
    slug: "zen-fit-powai",
    name: "Zen Fit Studio",
    category: "Fitness Studio",
    location: "Powai, Mumbai",
    distance: "3.6 km",
    rating: 4.8,
    reviews: 476,
    priceFrom: 1199,
    isOpen: true,
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&fit=crop&auto=format",
  },
];

/* ── Fallback Trainers (when API unavailable) ── */
export const FALLBACK_TRAINERS = [
  {
    id: "t-001",
    slug: "marcus-reid",
    name: "Marcus Reid",
    specialization: "Strength & Conditioning",
    experience: "14 years",
    rating: 4.9,
    reviews: 128,
    pricePerSession: 1200,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop&auto=format",
  },
  {
    id: "t-002",
    slug: "priya-sharma",
    name: "Priya Sharma",
    specialization: "Pilates & Flexibility",
    experience: "8 years",
    rating: 4.8,
    reviews: 94,
    pricePerSession: 900,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80&fit=crop&auto=format",
  },
  {
    id: "t-003",
    slug: "arjun-nair",
    name: "Arjun Nair",
    specialization: "CrossFit & HIIT",
    experience: "10 years",
    rating: 4.9,
    reviews: 211,
    pricePerSession: 1500,
    isAvailable: false,
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80&fit=crop&auto=format",
  },
  {
    id: "t-004",
    slug: "neha-kapoor",
    name: "Neha Kapoor",
    specialization: "Cardio & Weight Loss",
    experience: "6 years",
    rating: 4.7,
    reviews: 76,
    pricePerSession: 800,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1549476464-37392f717541?w=400&q=80&fit=crop&auto=format",
  },
];

/* ── Fallback Cities (when API unavailable) ── */
export const FALLBACK_CITIES = [
  {
    id: "bengaluru",
    name: "Bengaluru",
    count: "1,200+",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80&fit=crop&auto=format",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    count: "980+",
    image:
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80&fit=crop&auto=format",
  },
  {
    id: "delhi",
    name: "Delhi",
    count: "1,100+",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80&fit=crop&auto=format",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    count: "640+",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&fit=crop&auto=format",
  },
  {
    id: "pune",
    name: "Pune",
    count: "520+",
    image:
      "https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?w=600&q=80&fit=crop&auto=format",
  },
  {
    id: "chennai",
    name: "Chennai",
    count: "480+",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80&fit=crop&auto=format",
  },
];

/* ── Fallback Trending Experiences (when API unavailable) ── */
export const FALLBACK_EXPERIENCES = [
  {
    id: "exp-001",
    title: "Power Hour HIIT",
    category: "HIIT",
    duration: "60 min",
    level: "Intermediate",
    rating: 4.9,
    priceFrom: 499,
    spots: 8,
    trending: true,
    image:
      "https://images.unsplash.com/photo-1549476464-37392f717541?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "exp-002",
    title: "CrossFit Open WOD",
    category: "CrossFit",
    duration: "75 min",
    level: "Advanced",
    rating: 4.8,
    priceFrom: 699,
    spots: 5,
    trending: true,
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "exp-003",
    title: "Pilates Fundamentals",
    category: "Pilates",
    duration: "55 min",
    level: "Beginner",
    rating: 4.9,
    priceFrom: 599,
    spots: 12,
    trending: false,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "exp-004",
    title: "Morning Strength Circuit",
    category: "Strength",
    duration: "45 min",
    level: "All Levels",
    rating: 4.7,
    priceFrom: 399,
    spots: 15,
    trending: true,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "exp-005",
    title: "Cardio Blast Class",
    category: "Cardio",
    duration: "50 min",
    level: "Beginner",
    rating: 4.6,
    priceFrom: 349,
    spots: 20,
    trending: false,
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop&auto=format",
  },
  {
    id: "exp-006",
    title: "Personal Training Session",
    category: "Personal Training",
    duration: "60 min",
    level: "All Levels",
    rating: 5.0,
    priceFrom: 1200,
    spots: 1,
    trending: true,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop&auto=format",
  },
];
