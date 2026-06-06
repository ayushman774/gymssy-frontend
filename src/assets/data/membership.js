export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Begin your journey",
    badge: null,
    color: "white",
    monthlyPrice: 49,
    annualPrice: 39,
    description:
      "Everything you need to start training seriously. Full gym access with the essential tools to build your foundation.",
    features: [
      { text: "Full gym floor access", included: true },
      { text: "Locker room & showers", included: true },
      { text: "2 group classes per week", included: true },
      { text: "Fitness assessment", included: true },
      { text: "Mobile app access", included: true },
      { text: "Personal training sessions", included: false },
      { text: "Nutrition coaching", included: false },
      { text: "Recovery suite access", included: false },
      { text: "Priority class booking", included: false },
      { text: "Dedicated coach assignment", included: false },
    ],
    cta: "Get Started",
    href: "/membership/starter",
    icon: "⚡",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Most popular choice",
    badge: "Most Popular",
    color: "neon",
    monthlyPrice: 99,
    annualPrice: 79,
    description:
      "The complete Gymsssy experience. Unlimited access, personal coaching, and the tools high-performers rely on.",
    features: [
      { text: "Full gym floor access", included: true },
      { text: "Locker room & showers", included: true },
      { text: "Unlimited group classes", included: true },
      { text: "Fitness assessment", included: true },
      { text: "Mobile app access", included: true },
      { text: "4 personal training sessions/mo", included: true },
      { text: "Nutrition coaching", included: true },
      { text: "Recovery suite access", included: false },
      { text: "Priority class booking", included: true },
      { text: "Dedicated coach assignment", included: false },
    ],
    cta: "Join Now",
    href: "/membership/professional",
    icon: "🏆",
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "The ultimate experience",
    badge: "Premium",
    color: "blue",
    monthlyPrice: 199,
    annualPrice: 159,
    description:
      "Unlimited everything. Your own dedicated coach, private training zones, and the full Gymsssy lifestyle package.",
    features: [
      { text: "Full gym floor access", included: true },
      { text: "Locker room & showers", included: true },
      { text: "Unlimited group classes", included: true },
      { text: "Fitness assessment", included: true },
      { text: "Mobile app access", included: true },
      { text: "Unlimited personal training", included: true },
      { text: "Nutrition coaching", included: true },
      { text: "Recovery suite access", included: true },
      { text: "Priority class booking", included: true },
      { text: "Dedicated coach assignment", included: true },
    ],
    cta: "Go Elite",
    href: "/membership/elite",
    icon: "👑",
  },
];

export const MEMBERSHIP_FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. All plans are month-to-month with no lock-in contracts. Cancel anytime with 30 days notice.",
  },
  {
    q: "Is there a joining fee?",
    a: "No joining fee. What you see is what you pay — transparent pricing with zero hidden costs.",
  },
  {
    q: "Can I freeze my membership?",
    a: "Absolutely. Freeze your membership for up to 3 months per year at no extra charge.",
  },
  {
    q: "Do you offer student or corporate discounts?",
    a: "Yes. We offer 20% off for students and have corporate wellness packages available.",
  },
];

export const TRUST_BADGES = [
  { icon: "🔒", text: "No Lock-in Contract" },
  { icon: "💳", text: "Cancel Anytime" },
  { icon: "✅", text: "Free First Week" },
  { icon: "🎯", text: "100% Results Guarantee" },
];
