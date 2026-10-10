export const FEATURED_COLLECTIONS = Object.freeze([
  { slug: "beginner-gyms", title: "Best Gyms for Beginners", subtitle: "Start strong with gyms welcoming new members.", description: "Discover gyms marked as beginner-friendly by their listing details.", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80" },
  { slug: "top-trainers", title: "Top Rated Personal Trainers", subtitle: "Find expert guidance for your next milestone.", description: "Browse trainer profiles ranked by rating.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80" },
  { slug: "womens-studios", title: "Women's Fitness Studios", subtitle: "Discover spaces focused on women's fitness.", description: "Explore venues tagged for women's fitness.", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80" },
  { slug: "premium-clubs", title: "Premium Fitness Clubs", subtitle: "Elevate your training experience.", description: "Explore clubs with premium listing tags.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80" },
  { slug: "budget-gyms", title: "Budget Friendly Gyms", subtitle: "Fitness options that work with your budget.", description: "Browse gyms with starting prices up to ₹1,500.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80" },
  { slug: "luxury-wellness", title: "Luxury Wellness Centers", subtitle: "Find your next moment of recovery and renewal.", description: "Explore venues tagged for luxury wellness.", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80" },
]);
export const getFeaturedCollection = (slug) => FEATURED_COLLECTIONS.find((item) => item.slug === slug);
