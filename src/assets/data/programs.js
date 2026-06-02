export const PROGRAMS = [
  {
    id: "strength",
    slug: "strength-training",
    category: "Foundation",
    title: "Strength Training",
    subtitle: "Build raw power",
    description:
      "Develop elite-level strength through progressive overload, compound movements, and precision programming built by world-class coaches.",
    duration: "60 min",
    level: "All Levels",
    sessions: "3–5x / week",
    tag: "Most Popular",
    tagColor: "neon",
    icon: "💪",
    image: {
      src: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=85&fit=crop&auto=format",
      srcSet:
        "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&q=80&fit=crop&auto=format 400w, https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=85&fit=crop&auto=format 600w, https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=85&fit=crop&auto=format 800w",
      sizes: "(max-width: 400px) 400px, (max-width: 600px) 600px, 800px",
      alt: "Athlete performing heavy deadlift in strength training session",
    },
    hoverImage: {
      src: "https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=800&q=85&fit=crop&auto=format",
      alt: "Powerlifter with intense focus during squat training",
    },
    highlights: [
      "Progressive overload system",
      "Powerlifting & Olympic lifts",
      "Periodized programming",
    ],
    href: "/programs/strength-training",
  },
  {
    id: "personal",
    slug: "personal-training",
    category: "Premium",
    title: "Personal Training",
    subtitle: "1-on-1 elite coaching",
    description:
      "Accelerate results with a dedicated coach building a program uniquely tailored to your body, goals, and lifestyle.",
    duration: "50 min",
    level: "All Levels",
    sessions: "2–4x / week",
    tag: "Elite",
    tagColor: "blue",
    icon: "🏆",
    image: {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=85&fit=crop&auto=format",
      srcSet:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&fit=crop&auto=format 400w, https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=85&fit=crop&auto=format 600w, https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=85&fit=crop&auto=format 800w",
      sizes: "(max-width: 400px) 400px, (max-width: 600px) 600px, 800px",
      alt: "Elite personal trainer coaching client with expert guidance",
    },
    hoverImage: {
      src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=85&fit=crop&auto=format",
      alt: "Personal trainer demonstrating technique to gym member",
    },
    highlights: [
      "Dedicated coach assignment",
      "Custom weekly programming",
      "Nutrition integration",
    ],
    href: "/programs/personal-training",
  },
  {
    id: "weightloss",
    slug: "weight-loss",
    category: "Transformation",
    title: "Weight Loss",
    subtitle: "Redefine your body",
    description:
      "Science-driven fat loss combining metabolic conditioning, strength, and expert nutrition guidance for lasting transformation.",
    duration: "45 min",
    level: "Beginner–Inter",
    sessions: "4–5x / week",
    tag: "Trending",
    tagColor: "neon",
    icon: "🔥",
    image: {
      src: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=85&fit=crop&auto=format",
      srcSet:
        "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80&fit=crop&auto=format 400w, https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=85&fit=crop&auto=format 600w, https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=85&fit=crop&auto=format 800w",
      sizes: "(max-width: 400px) 400px, (max-width: 600px) 600px, 800px",
      alt: "Athlete on treadmill during intense cardio weight loss workout",
    },
    hoverImage: {
      src: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&q=85&fit=crop&auto=format",
      alt: "High-intensity cardio training session for weight loss",
    },
    highlights: [
      "Metabolic conditioning",
      "Body composition tracking",
      "Nutrition coaching included",
    ],
    href: "/programs/weight-loss",
  },
  {
    id: "cardio",
    slug: "cardio",
    category: "Endurance",
    title: "Cardio & HIIT",
    subtitle: "Ignite your engine",
    description:
      "High-octane cardio and HIIT sessions engineered to maximize calorie burn, boost endurance, and elevate cardiovascular health.",
    duration: "45 min",
    level: "All Levels",
    sessions: "3–6x / week",
    tag: null,
    tagColor: null,
    icon: "⚡",
    image: {
      src: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=85&fit=crop&auto=format",
      srcSet:
        "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80&fit=crop&auto=format 400w, https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=85&fit=crop&auto=format 600w, https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=85&fit=crop&auto=format 800w",
      sizes: "(max-width: 400px) 400px, (max-width: 600px) 600px, 800px",
      alt: "Athlete in intense HIIT cardio training session",
    },
    hoverImage: {
      src: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800&q=85&fit=crop&auto=format",
      alt: "High-energy cardio workout in premium gym environment",
    },
    highlights: [
      "HIIT & steady-state cardio",
      "Heart rate zone training",
      "Endurance benchmarking",
    ],
    href: "/programs/cardio",
  },
  {
    id: "functional",
    slug: "functional-fitness",
    category: "Athletic",
    title: "Functional Fitness",
    subtitle: "Move like an athlete",
    description:
      "Athletic movement patterns, battle ropes, kettlebells, and sled work to build a body that performs as powerfully as it looks.",
    duration: "55 min",
    level: "Intermediate",
    sessions: "3–4x / week",
    tag: null,
    tagColor: null,
    icon: "🎯",
    image: {
      src: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=85&fit=crop&auto=format",
      srcSet:
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80&fit=crop&auto=format 400w, https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=85&fit=crop&auto=format 600w, https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=85&fit=crop&auto=format 800w",
      sizes: "(max-width: 400px) 400px, (max-width: 600px) 600px, 800px",
      alt: "Athlete training with battle ropes for functional fitness",
    },
    hoverImage: {
      src: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=85&fit=crop&auto=format",
      alt: "Functional training sled push workout in gym",
    },
    highlights: [
      "Battle ropes & sleds",
      "Kettlebell programming",
      "Athletic movement drills",
    ],
    href: "/programs/functional-fitness",
  },
  {
    id: "nutrition",
    slug: "nutrition-coaching",
    category: "Lifestyle",
    title: "Nutrition Coaching",
    subtitle: "Fuel the machine",
    description:
      "Expert nutritionists craft personalised meal plans and macro strategies that work in sync with your training for optimal results.",
    duration: "Ongoing",
    level: "All Levels",
    sessions: "Weekly check-ins",
    tag: "New",
    tagColor: "blue",
    icon: "🥗",
    image: {
      src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=85&fit=crop&auto=format",
      srcSet:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&fit=crop&auto=format 400w, https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=85&fit=crop&auto=format 600w, https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=85&fit=crop&auto=format 800w",
      sizes: "(max-width: 400px) 400px, (max-width: 600px) 600px, 800px",
      alt: "Healthy fitness nutrition and lifestyle coaching",
    },
    hoverImage: {
      src: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=85&fit=crop&auto=format",
      alt: "Premium nutrition guidance for athletic performance",
    },
    highlights: [
      "Personalised macro plans",
      "Weekly nutritionist check-ins",
      "Supplement guidance",
    ],
    href: "/programs/nutrition-coaching",
  },
];
