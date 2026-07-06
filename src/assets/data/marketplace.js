// ── Category Images ───────────────────────────────────────────────────────
export const categoryImages = {
  gyms: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  yoga: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  trainers:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
  pilates:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  cardio:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  martialArts:
    "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80",
  dance: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80",
  swimming:
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
  running:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80",
  sports:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
};

export const CATEGORIES = [
  {
    id: "gyms",
    icon: "🏋",
    title: "Gyms",
    description: "Premium fitness centers with world-class equipment",
    image: categoryImages.gyms,
    count: "2,400+",
  },
  {
    id: "yoga",
    icon: "🧘",
    title: "Yoga",
    description: "Find your flow with certified yoga instructors",
    image: categoryImages.yoga,
    count: "890+",
  },
  {
    id: "trainers",
    icon: "💪",
    title: "Personal Trainers",
    description: "One-on-one coaching tailored to your goals",
    image: categoryImages.trainers,
    count: "1,200+",
  },
  {
    id: "pilates",
    icon: "🤸",
    title: "Pilates",
    description: "Strengthen your core with expert-led sessions",
    image: categoryImages.pilates,
    count: "540+",
  },
  {
    id: "cardio",
    icon: "🏃",
    title: "Cardio",
    description: "High-energy cardio classes for every level",
    image: categoryImages.cardio,
    count: "780+",
  },
  {
    id: "martial-arts",
    icon: "🥊",
    title: "Martial Arts",
    description: "MMA, boxing, BJJ and more from elite coaches",
    image: categoryImages.martialArts,
    count: "420+",
  },
  {
    id: "dance",
    icon: "💃",
    title: "Dance",
    description: "Zumba, contemporary, hip-hop and more",
    image: categoryImages.dance,
    count: "360+",
  },
  {
    id: "swimming",
    icon: "🏊",
    title: "Swimming",
    description: "Pools, academies, and aqua fitness classes",
    image: categoryImages.swimming,
    count: "290+",
  },
  {
    id: "running",
    icon: "🏃",
    title: "Running Clubs",
    description: "Join a community of passionate runners",
    image: categoryImages.running,
    count: "180+",
  },
  {
    id: "sports",
    icon: "🏸",
    title: "Sports Academies",
    description: "Multi-sport academies for all skill levels",
    image: categoryImages.sports,
    count: "310+",
  },
];

// ── Gyms Near You ─────────────────────────────────────────────────────────
export const FEATURED_GYMS = [
  {
    id: "gym-1",
    name: "Gymssy Performance Center",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    rating: 4.9,
    reviewCount: 312,
    distance: "0.8 km",
    location: "Downtown District",
    facilities: ["Olympic Lifting", "Cardio Zone", "Sauna", "Juice Bar"],
    priceFrom: 49,
    isOpen: true,
    tags: ["24/7", "Personal Training"],
    featured: true,
  },
  {
    id: "gym-2",
    name: "Elite Fitness Studio",
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    rating: 4.8,
    reviewCount: 204,
    distance: "1.5 km",
    location: "Midtown Central",
    facilities: ["Spin Studio", "Yoga Room", "Boxing", "Nutrition Bar"],
    priceFrom: 39,
    isOpen: true,
    tags: ["Group Classes", "Female Trainers"],
    featured: false,
  },
  {
    id: "gym-3",
    name: "FunctionalFit Hub",
    image:
      "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&q=80",
    rating: 4.7,
    reviewCount: 178,
    distance: "2.2 km",
    location: "West End",
    facilities: [
      "CrossFit Zone",
      "Heavy Bags",
      "Recovery Suite",
      "Protein Bar",
    ],
    priceFrom: 45,
    isOpen: false,
    tags: ["24/7", "Functional Training"],
    featured: false,
  },
  {
    id: "gym-4",
    name: "Prestige Athletic Club",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    rating: 4.9,
    reviewCount: 267,
    distance: "3.1 km",
    location: "Uptown Heights",
    facilities: [
      "Pilates Studio",
      "Aqua Training",
      "Cryotherapy",
      "VIP Lounge",
    ],
    priceFrom: 89,
    isOpen: true,
    tags: ["VIP", "Personal Training"],
    featured: true,
  },
];

// ── Trainers ──────────────────────────────────────────────────────────────
export const FEATURED_TRAINERS = [
  {
    id: "trainer-1",
    name: "Marcus Reid",
    specialization: "Strength & Conditioning",
    experience: 14,
    rating: 4.9,
    reviewCount: 128,
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80",
    pricePerSession: 80,
    available: true,
  },
  {
    id: "trainer-2",
    name: "Sophia Laurent",
    specialization: "Yoga & Mobility",
    experience: 11,
    rating: 4.9,
    reviewCount: 215,
    image:
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=500&q=80",
    pricePerSession: 65,
    available: true,
  },
  {
    id: "trainer-3",
    name: "Jordan Steele",
    specialization: "HIIT & Metabolic",
    experience: 9,
    rating: 4.8,
    reviewCount: 189,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
    pricePerSession: 75,
    available: false,
  },
  {
    id: "trainer-4",
    name: "Priya Sharma",
    specialization: "Body Recomposition",
    experience: 8,
    rating: 4.8,
    reviewCount: 156,
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&q=80",
    pricePerSession: 70,
    available: true,
  },
  {
    id: "trainer-5",
    name: "Leo Martinez",
    specialization: "Boxing & Combat",
    experience: 10,
    rating: 4.7,
    reviewCount: 143,
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&q=80",
    pricePerSession: 60,
    available: true,
  },
];

// ── Trending Experiences ──────────────────────────────────────────────────
export const TRENDING_EXPERIENCES = [
  {
    id: "exp-1",
    title: "Morning Yoga Flow",
    category: "Yoga",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80",
    duration: "60 min",
    level: "All Levels",
    rating: 4.9,
    priceFrom: 15,
    spots: 8,
    trending: true,
  },
  {
    id: "exp-2",
    title: "CrossFit Open WOD",
    category: "CrossFit",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80",
    duration: "45 min",
    level: "Intermediate",
    rating: 4.8,
    priceFrom: 20,
    spots: 12,
    trending: true,
  },
  {
    id: "exp-3",
    title: "Functional Fitness",
    category: "Functional",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=700&q=80",
    duration: "50 min",
    level: "Beginner",
    rating: 4.7,
    priceFrom: 18,
    spots: 15,
    trending: false,
  },
  {
    id: "exp-4",
    title: "Salsa Dance Class",
    category: "Dance",
    image:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?w=700&q=80",
    duration: "75 min",
    level: "All Levels",
    rating: 4.9,
    priceFrom: 22,
    spots: 5,
    trending: true,
  },
  {
    id: "exp-5",
    title: "Boxing Fundamentals",
    category: "Boxing",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=700&q=80",
    duration: "60 min",
    level: "Beginner",
    rating: 4.8,
    priceFrom: 25,
    spots: 10,
    trending: false,
  },
  {
    id: "exp-6",
    title: "Elite Strength Program",
    category: "Strength",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&q=80",
    duration: "90 min",
    level: "Advanced",
    rating: 5.0,
    priceFrom: 35,
    spots: 6,
    trending: true,
  },
];

// ── Why Choose Us ─────────────────────────────────────────────────────────
export const WHY_FEATURES = [
  {
    id: "verified",
    title: "Verified Gyms",
    description:
      "Every gym on our platform is physically verified and quality-checked by our team.",
    color: "green",
  },
  {
    id: "trainers",
    title: "Certified Trainers",
    description:
      "All trainers hold recognised certifications and are background-verified.",
    color: "blue",
  },
  {
    id: "compare",
    title: "Easy Comparison",
    description:
      "Compare gyms, trainers, and memberships side by side in seconds.",
    color: "green",
  },
  {
    id: "secure",
    title: "Secure Membership",
    description:
      "Your payments and personal data are protected with bank-grade encryption.",
    color: "blue",
  },
  {
    id: "deals",
    title: "Exclusive Deals",
    description:
      "Access member-only offers, flash deals, and first-month discounts.",
    color: "green",
  },
  {
    id: "reviews",
    title: "Trusted Reviews",
    description:
      "Every review is verified and written by real, confirmed members.",
    color: "blue",
  },
];

// ── Popular Cities ────────────────────────────────────────────────────────
export const POPULAR_CITIES = [
  {
    id: "bangalore",
    name: "Bangalore",
    gymCount: "1,200+",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=700&q=80",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    gymCount: "980+",
    image:
      "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=700&q=80",
  },
  {
    id: "delhi",
    name: "Delhi",
    gymCount: "870+",
    image:
      "https://images.unsplash.com/photo-1558431382-27e303142255?w=700&q=80",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    gymCount: "640+",
    image:
      "https://images.unsplash.com/photo-1573153237029-5a3a8d41f3c6?w=700&q=80",
  },
  {
    id: "pune",
    name: "Pune",
    gymCount: "520+",
    image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=700&q=80",
  },
  {
    id: "chennai",
    name: "Chennai",
    gymCount: "480+",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&q=80",
  },
];

// ── Search Suggestions ────────────────────────────────────────────────────
export const SEARCH_SUGGESTIONS = [
  "Gyms",
  "Yoga",
  "Personal Trainer",
  "Pilates",
  "CrossFit",
  "Zumba",
  "Swimming",
  "Dance",
  "Martial Arts",
  "Sports Academy",
];

export const POPULAR_CHIPS = [
  "Gyms",
  "Yoga",
  "CrossFit",
  "Personal Trainers",
  "Pilates",
  "Swimming",
  "Dance",
  "Nutrition",
];
