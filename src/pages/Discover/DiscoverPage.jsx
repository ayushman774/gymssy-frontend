import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FiSearch,
  FiMapPin,
  FiArrowRight,
  FiStar,
  FiShield,
  FiBarChart2,
  FiMessageSquare,
  FiGift,
  FiLock,
  FiUsers,
  FiChevronRight,
  FiNavigation,
  FiX,
  FiCheck,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlineSparkles } from "react-icons/hi";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import styles from "./DiscoverPage.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ═══════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: "gyms",
    icon: "🏋",
    title: "Gyms",
    count: "2,400+",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    color: "neon",
  },
  {
    id: "yoga",
    icon: "🧘",
    title: "Yoga",
    count: "1,200+",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    color: "purple",
  },
  {
    id: "trainers",
    icon: "💪",
    title: "Personal Trainers",
    count: "800+",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    color: "neon",
  },
  {
    id: "pilates",
    icon: "🤸",
    title: "Pilates",
    count: "340+",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    color: "blue",
  },
  {
    id: "martial",
    icon: "🥊",
    title: "Martial Arts",
    count: "560+",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80",
    color: "red",
  },
  {
    id: "dance",
    icon: "💃",
    title: "Dance",
    count: "720+",
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80",
    color: "pink",
  },
  {
    id: "swimming",
    icon: "🏊",
    title: "Swimming",
    count: "280+",
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
    color: "blue",
  },
  {
    id: "crossfit",
    icon: "🏃",
    title: "CrossFit",
    count: "440+",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80",
    color: "orange",
  },
  {
    id: "sports",
    icon: "🎾",
    title: "Sports",
    count: "380+",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    color: "green",
  },
  {
    id: "wellness",
    icon: "🌿",
    title: "Wellness",
    count: "290+",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
    color: "teal",
  },
];

const TRENDING = [
  {
    id: 1,
    name: "Iron Paradise Fitness",
    category: "Gym",
    rating: 4.9,
    reviews: 328,
    distance: "0.8 km",
    price: "₹999/mo",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    tags: ["24/7", "AC", "Parking"],
  },
  {
    id: 2,
    name: "Zen Flow Yoga Studio",
    category: "Yoga",
    rating: 4.8,
    reviews: 214,
    distance: "1.2 km",
    price: "₹1,200/mo",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    tags: ["Beginner", "Women", "Morning"],
  },
  {
    id: 3,
    name: "Elite CrossFit Box",
    category: "CrossFit",
    rating: 4.7,
    reviews: 189,
    distance: "2.1 km",
    price: "₹2,500/mo",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80",
    tags: ["HIIT", "Community", "Coaches"],
  },
  {
    id: 4,
    name: "Rhythm Dance Academy",
    category: "Dance",
    rating: 4.9,
    reviews: 156,
    distance: "1.5 km",
    price: "₹800/mo",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80",
    tags: ["Bollywood", "Hip-hop", "Kids"],
  },
];

const COLLECTIONS = [
  {
    id: 1,
    title: "Best Gyms for Beginners",
    count: "42 places",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    color: "#39FF14",
  },
  {
    id: 2,
    title: "Top Rated Personal Trainers",
    count: "28 trainers",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    color: "#3B82F6",
  },
  {
    id: 3,
    title: "Women's Fitness Studios",
    count: "35 studios",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    color: "#ec4899",
  },
  {
    id: 4,
    title: "Premium Fitness Clubs",
    count: "19 clubs",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    color: "#f59e0b",
  },
  {
    id: 5,
    title: "Budget Friendly Gyms",
    count: "64 gyms",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    color: "#39FF14",
  },
  {
    id: 6,
    title: "Luxury Wellness Centers",
    count: "15 centers",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    color: "#a78bfa",
  },
];

const CITIES = [
  {
    id: "bangalore",
    name: "Bangalore",
    count: "1,200+",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    count: "1,800+",
    image:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
  },
  {
    id: "delhi",
    name: "Delhi",
    count: "2,100+",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    count: "890+",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  },
  {
    id: "pune",
    name: "Pune",
    count: "670+",
    image:
      "https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?w=600&q=80",
  },
  {
    id: "chennai",
    name: "Chennai",
    count: "540+",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80",
  },
];

const TRAINERS = [
  {
    id: 1,
    name: "Arjun Sharma",
    specialization: "Strength & Conditioning",
    rating: 4.9,
    experience: "8 years",
    sessions: "1,200+",
    price: "₹800/session",
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Nair",
    specialization: "Yoga & Mindfulness",
    rating: 5.0,
    experience: "6 years",
    sessions: "980+",
    price: "₹600/session",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80",
    verified: true,
  },
  {
    id: 3,
    name: "Rahul Verma",
    specialization: "CrossFit & HIIT",
    rating: 4.8,
    experience: "5 years",
    sessions: "740+",
    price: "₹700/session",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    verified: true,
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    specialization: "Dance & Zumba",
    rating: 4.9,
    experience: "7 years",
    sessions: "1,050+",
    price: "₹500/session",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80",
    verified: true,
  },
  {
    id: 5,
    name: "Vikram Singh",
    specialization: "Martial Arts & MMA",
    rating: 4.7,
    experience: "10 years",
    sessions: "1,500+",
    price: "₹900/session",
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80",
    verified: true,
  },
];

const GYMS = [
  {
    id: 1,
    name: "Anytime Fitness Koramangala",
    address: "Koramangala, Bangalore",
    rating: 4.8,
    reviews: 412,
    price: "₹1,500/mo",
    amenities: ["AC", "Parking", "Sauna", "Pool"],
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    logo: "AF",
    verified: true,
    tag: "Popular",
  },
  {
    id: 2,
    name: "Gold's Gym Indiranagar",
    address: "Indiranagar, Bangalore",
    rating: 4.7,
    reviews: 308,
    price: "₹2,000/mo",
    amenities: ["24/7", "Steam", "Crossfit", "Cafe"],
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    logo: "GG",
    verified: true,
    tag: "Premium",
  },
  {
    id: 3,
    name: "Cult.fit HSR Layout",
    address: "HSR Layout, Bangalore",
    rating: 4.9,
    reviews: 621,
    price: "₹1,800/mo",
    amenities: ["HIIT", "Yoga", "Cycle", "App"],
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    logo: "CF",
    verified: true,
    tag: "Top Rated",
  },
];

const OFFERS = [
  {
    id: 1,
    title: "Free Trial",
    subtitle: "First session on us",
    desc: "Try any gym or studio completely free. No credit card required.",
    icon: "🎁",
    gradient: "linear-gradient(135deg, #39FF14 0%, #00c853 100%)",
    textColor: "#000",
    tag: "Limited",
  },
  {
    id: 2,
    title: "30% OFF",
    subtitle: "Monthly Memberships",
    desc: "Get 30% off on your first 3 months at 500+ partner gyms.",
    icon: "🔥",
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    textColor: "#fff",
    tag: "Hot Deal",
  },
  {
    id: 3,
    title: "Weekend Pass",
    subtitle: "₹199 only",
    desc: "Access any partner gym on weekends. Perfect for travel.",
    icon: "🗓️",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #6366f1 100%)",
    textColor: "#fff",
    tag: "New",
  },
  {
    id: 4,
    title: "PT Discount",
    subtitle: "20% off sessions",
    desc: "Book 5 personal training sessions and save 20% instantly.",
    icon: "💪",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
    textColor: "#fff",
    tag: "Popular",
  },
];

const WHY_FEATURES = [
  {
    icon: FiShield,
    title: "Verified Businesses",
    desc: "Every gym, studio and trainer is thoroughly vetted before listing on Gymssy.",
    color: "neon",
  },
  {
    icon: FiBarChart2,
    title: "Compare Memberships",
    desc: "Side-by-side comparison of pricing, amenities, and services — zero guesswork.",
    color: "blue",
  },
  {
    icon: FiStar,
    title: "Trusted Reviews",
    desc: "Authentic reviews from real members help you make confident decisions.",
    color: "neon",
  },
  {
    icon: FiGift,
    title: "Exclusive Deals",
    desc: "Access member-only discounts, free trials, and limited-time offers.",
    color: "blue",
  },
  {
    icon: FiLock,
    title: "Secure Bookings",
    desc: "Your personal data and payments are protected with enterprise-grade security.",
    color: "neon",
  },
  {
    icon: FiUsers,
    title: "Real Community",
    desc: "Join 50,000+ fitness seekers discovering and booking their best experiences.",
    color: "blue",
  },
];

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */

/* ── Search Bar ── */
const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [query,    setQuery]    = useState("");
  const [locFocus, setLocFocus] = useState(false);
  const [qFocus,   setQFocus]   = useState(false);

  const SUGGESTIONS = [
    "Gyms", "Yoga", "Personal Trainers", "Pilates",
    "CrossFit", "Swimming", "Dance", "Martial Arts",
  ];

  return (
    <div className={styles.searchBoxWrap}>

      {/* ── Top pill row ── */}
      <div className={styles.searchPill}>

        {/* Location field */}
        <div className={`${styles.searchField} ${locFocus ? styles.searchFieldActive : ""}`}>
          <FiMapPin className={styles.searchFieldIcon} aria-hidden="true" />
          <div className={styles.searchFieldText}>
            <label className={styles.searchLabel} htmlFor="disc-location">
              Location
            </label>
            <input
              id="disc-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setLocFocus(true)}
              onBlur={() => setLocFocus(false)}
              placeholder="Enter your city or locality"
              className={styles.searchInput}
            />
          </div>
          {location && (
            <button
              className={styles.clearBtn}
              onClick={() => setLocation("")}
              aria-label="Clear location"
              tabIndex={-1}
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className={styles.pillDivider} aria-hidden="true" />

        {/* Query field */}
        <div className={`${styles.searchField} ${styles.searchFieldGrow} ${qFocus ? styles.searchFieldActive : ""}`}>
          <FiSearch className={styles.searchFieldIcon} aria-hidden="true" />
          <div className={styles.searchFieldText}>
            <label className={styles.searchLabel} htmlFor="disc-query">
              What are you looking for?
            </label>
            <input
              id="disc-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setQFocus(true)}
              onBlur={() => setQFocus(false)}
              placeholder="Search gyms, yoga, trainers, dance..."
              className={styles.searchInput}
            />
          </div>
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => setQuery("")}
              aria-label="Clear search"
              tabIndex={-1}
            >
              <FiX />
            </button>
          )}
        </div>

        {/* CTA */}
        <button className={styles.searchBtn} aria-label="Explore">
          <span>Explore</span>
          <FiArrowRight aria-hidden="true" />
        </button>
      </div>

      {/* ── Suggestions row ── */}
      <div className={styles.suggestionsRow}>
        <span className={styles.suggestionsLabel}>Popular:</span>
        <div className={styles.suggestionsChips}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className={styles.suggestionChip}
              onClick={() => setQuery(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

/* ── Category Card ── */
const CategoryCard = ({ cat, index }) => (
  <motion.div
    className={`${styles.categoryCard} ${styles[`categoryCard--${cat.color}`]}`}
    variants={staggerItem}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
  >
    <div className={styles.categoryImgWrap}>
      <img
        src={cat.image}
        alt={cat.title}
        className={styles.categoryImg}
        loading="lazy"
      />
      <div className={styles.categoryImgOverlay} aria-hidden="true" />
    </div>
    <div className={styles.categoryBody}>
      <span className={styles.categoryIcon} aria-hidden="true">
        {cat.icon}
      </span>
      <h3 className={styles.categoryTitle}>{cat.title}</h3>
      <p className={styles.categoryCount}>{cat.count} listings</p>
      <div
        className={`${styles.categoryAccent} ${styles[`categoryAccent--${cat.color}`]}`}
        aria-hidden="true"
      />
    </div>
    <div className={styles.categoryHoverOverlay} aria-hidden="true" />
  </motion.div>
);

/* ── Discover Card (Trending) ── */
const DiscoverCard = ({ item }) => (
  <motion.article
    className={styles.discoverCard}
    variants={staggerItem}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
  >
    {/* Image */}
    <div className={styles.discoverImgWrap}>
      <img
        src={item.image}
        alt={item.name}
        className={styles.discoverImg}
        loading="lazy"
      />
      <div className={styles.discoverImgOverlay} aria-hidden="true" />
      {item.verified && (
        <div className={styles.verifiedBadge}>
          <FiCheck aria-hidden="true" />
          Verified
        </div>
      )}
      <div className={styles.discoverCategory}>{item.category}</div>
    </div>

    {/* Body */}
    <div className={styles.discoverBody}>
      <div className={styles.discoverMeta}>
        <span className={styles.discoverRating}>
          <FiStar aria-hidden="true" />
          {item.rating}
        </span>
        <span className={styles.discoverReviews}>({item.reviews})</span>
        <span className={styles.discoverDot} aria-hidden="true" />
        <span className={styles.discoverDistance}>
          <FiNavigation aria-hidden="true" />
          {item.distance}
        </span>
      </div>

      <h3 className={styles.discoverName}>{item.name}</h3>

      <div className={styles.discoverTags}>
        {item.tags.map((t) => (
          <span key={t} className={styles.discoverTag}>
            {t}
          </span>
        ))}
      </div>

      <div className={styles.discoverFooter}>
        <span className={styles.discoverPrice}>
          From <strong>{item.price}</strong>
        </span>
        <div className={styles.discoverActions}>
          <button className={styles.discoverBtnOutline}>View</button>
          <button className={styles.discoverBtnFilled}>Book Now</button>
        </div>
      </div>
    </div>
  </motion.article>
);

/* ── Collection Card ── */
const CollectionCard = ({ col }) => (
  <motion.div
    className={styles.collectionCard}
    variants={staggerItem}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    style={{ "--col-accent": col.color }}
  >
    <div className={styles.collectionImgWrap}>
      <img
        src={col.image}
        alt={col.title}
        className={styles.collectionImg}
        loading="lazy"
      />
      <div className={styles.collectionOverlay} aria-hidden="true" />
      <div className={styles.collectionContent}>
        <p className={styles.collectionCount}>{col.count}</p>
        <h3 className={styles.collectionTitle}>{col.title}</h3>
        <button className={styles.collectionBtn}>
          <span>Explore</span>
          <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  </motion.div>
);

/* ── City Card ── */
const CityCard = ({ city }) => (
  <motion.div
    className={styles.cityCard}
    variants={staggerItem}
    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
  >
    <div className={styles.cityImgWrap}>
      <img
        src={city.image}
        alt={city.name}
        className={styles.cityImg}
        loading="lazy"
      />
      <div className={styles.cityOverlay} aria-hidden="true" />
      <div className={styles.cityContent}>
        <h3 className={styles.cityName}>{city.name}</h3>
        <p className={styles.cityCount}>{city.count} fitness centers</p>
        <button className={styles.cityBtn}>
          Explore <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  </motion.div>
);

/* ── Trainer Card ── */
const TrainerCard = ({ trainer }) => (
  <div className={styles.trainerCard}>
    <div className={styles.trainerImgWrap}>
      <img
        src={trainer.image}
        alt={trainer.name}
        className={styles.trainerImg}
        loading="lazy"
      />
      {trainer.verified && (
        <div className={styles.trainerVerified} aria-label="Verified trainer">
          <FiCheck />
        </div>
      )}
    </div>
    <div className={styles.trainerBody}>
      <div className={styles.trainerRating}>
        <FiStar aria-hidden="true" />
        <span>{trainer.rating}</span>
        <span className={styles.trainerSessions}>
          · {trainer.sessions} sessions
        </span>
      </div>
      <h3 className={styles.trainerName}>{trainer.name}</h3>
      <p className={styles.trainerSpec}>{trainer.specialization}</p>
      <div className={styles.trainerMeta}>
        <span className={styles.trainerExp}>
          <FiAward aria-hidden="true" />
          {trainer.experience}
        </span>
        <span className={styles.trainerPrice}>{trainer.price}</span>
      </div>
      <button className={styles.trainerBtn}>Book Session</button>
    </div>
  </div>
);

/* ── Gym Card ── */
const GymCard = ({ gym }) => (
  <motion.article
    className={styles.gymCard}
    variants={staggerItem}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
  >
    <div className={styles.gymImgWrap}>
      <img
        src={gym.image}
        alt={gym.name}
        className={styles.gymImg}
        loading="lazy"
      />
      <div className={styles.gymImgOverlay} aria-hidden="true" />
      {gym.tag && <div className={styles.gymTag}>{gym.tag}</div>}
      {gym.verified && (
        <div className={styles.gymVerified}>
          <FiShield aria-hidden="true" /> Verified
        </div>
      )}
    </div>
    <div className={styles.gymBody}>
      <div className={styles.gymHeader}>
        <div className={styles.gymLogo}>{gym.logo}</div>
        <div className={styles.gymMeta}>
          <span className={styles.gymRating}>
            <FiStar aria-hidden="true" />
            {gym.rating}
          </span>
          <span className={styles.gymReviews}>({gym.reviews} reviews)</span>
        </div>
      </div>
      <h3 className={styles.gymName}>{gym.name}</h3>
      <p className={styles.gymAddress}>
        <FiMapPin aria-hidden="true" /> {gym.address}
      </p>
      <div className={styles.gymAmenities}>
        {gym.amenities.map((a) => (
          <span key={a} className={styles.gymAmenity}>
            {a}
          </span>
        ))}
      </div>
      <div className={styles.gymFooter}>
        <span className={styles.gymPrice}>From {gym.price}</span>
        <div className={styles.gymActions}>
          <button className={styles.gymBtnOutline}>View Gym</button>
          <button className={styles.gymBtnFilled}>Membership</button>
        </div>
      </div>
    </div>
  </motion.article>
);

/* ── Offer Card ── */
const OfferCard = ({ offer }) => (
  <motion.div
    className={styles.offerCard}
    variants={staggerItem}
    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
    style={{ background: offer.gradient }}
  >
    <div className={styles.offerGlass} aria-hidden="true" />
    <div className={styles.offerContent}>
      <span
        className={styles.offerTag}
        style={{
          color: offer.textColor === "#000" ? "#000" : "#fff",
          background: "rgba(255,255,255,0.2)",
        }}
      >
        {offer.tag}
      </span>
      <span className={styles.offerIcon} aria-hidden="true">
        {offer.icon}
      </span>
      <h3 className={styles.offerTitle} style={{ color: offer.textColor }}>
        {offer.title}
      </h3>
      <p className={styles.offerSubtitle} style={{ color: offer.textColor }}>
        {offer.subtitle}
      </p>
      <p
        className={styles.offerDesc}
        style={{
          color:
            offer.textColor === "#000"
              ? "rgba(0,0,0,0.7)"
              : "rgba(255,255,255,0.8)",
        }}
      >
        {offer.desc}
      </p>
      <button
        className={styles.offerBtn}
        style={{
          background:
            offer.textColor === "#000" ? "#000" : "rgba(255,255,255,0.18)",
          color: offer.textColor === "#000" ? "#39FF14" : "#fff",
        }}
      >
        Claim Now <FiArrowRight />
      </button>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   PAGE SECTIONS
═══════════════════════════════════════════ */

/* ── Page Header ── */
const PageHeader = () => {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current?.querySelector("img"),
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className={styles.pageHeader}
      aria-label="Discover page header"
    >
      <div className={styles.headerBgWrap}>
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt=""
          className={styles.headerBgImg}
          loading="eager"
        />
      </div>
      <div className={styles.headerOverlay} aria-hidden="true" />

      <div className={styles.headerContent}>
        {/* Breadcrumb */}
        <motion.nav
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-label="Breadcrumb"
        >
          <Link to="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <FiChevronRight className={styles.breadcrumbSep} aria-hidden="true" />
          <span className={styles.breadcrumbCurrent}>Discover</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel text="INDIA'S FITNESS MARKETPLACE" variant="light" />
        </motion.div>

        <motion.h1
          className={styles.headerTitle}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Discover <span className={styles.headerAccent}>Fitness</span>
        </motion.h1>

        <motion.p
          className={styles.headerSubtitle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          Explore India's best gyms, trainers, studios and fitness experiences.
        </motion.p>

        <motion.div
          className={styles.headerLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

/* ── Smart Search ── */
const SmartSearch = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  return (
    <section ref={ref} className={styles.searchSection}>
      <div className={styles.sectionContainer}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className={styles.searchHeader}>
            <SectionLabel text="SMART SEARCH" variant="light" />
            <h2 className={styles.searchHeading}>
              Find Your Perfect{" "}
              <span className={styles.accentText}>Fitness Match</span>
            </h2>
          </div>
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
};

/* ── Trending Categories ── */
const TrendingCategories = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="categories-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="CATEGORIES" variant="light" />
          <h2 id="categories-heading" className={styles.sectionHeading}>
            Trending <span className={styles.accentText}>Categories</span>
          </h2>
          <p className={styles.sectionSubtext}>
            From high-intensity training to mindful yoga — find every fitness
            experience in one place.
          </p>
        </motion.div>

        <motion.div
          className={styles.categoriesGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Trending Near You ── */
const TrendingNearYou = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={`${styles.section} ${styles.sectionAlt}`}
      aria-labelledby="trending-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="NEAR YOU" variant="light" />
          <div className={styles.sectionHeadRow}>
            <h2 id="trending-heading" className={styles.sectionHeading}>
              Trending <span className={styles.accentText}>Near You</span>
            </h2>
            <Link to="/explore/all" className={styles.viewAllBtn}>
              View All <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className={styles.sectionSubtext}>
            Top-rated fitness destinations in your area.
          </p>
        </motion.div>

        <motion.div
          className={styles.discoverGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {TRENDING.map((item) => (
            <DiscoverCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Featured Collections ── */
const FeaturedCollections = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="collections-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="CURATED FOR YOU" variant="light" />
          <h2 id="collections-heading" className={styles.sectionHeading}>
            Featured <span className={styles.accentText}>Collections</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Handpicked fitness experiences curated by our experts.
          </p>
        </motion.div>

        <motion.div
          className={styles.collectionsGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {COLLECTIONS.map((col) => (
            <CollectionCard key={col.id} col={col} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Popular Cities ── */
const PopularCities = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={`${styles.section} ${styles.sectionAlt}`}
      aria-labelledby="cities-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="EXPLORE BY CITY" variant="light" />
          <h2 id="cities-heading" className={styles.sectionHeading}>
            Popular <span className={styles.accentText}>Cities</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Fitness experiences across India's fastest growing cities.
          </p>
        </motion.div>

        <motion.div
          className={styles.citiesGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {CITIES.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Top Trainers ── */
const TopTrainers = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="trainers-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="TOP TRAINERS" variant="light" />
          <div className={styles.sectionHeadRow}>
            <h2 id="trainers-heading" className={styles.sectionHeading}>
              Expert <span className={styles.accentText}>Trainers</span>
            </h2>
            <Link to="/trainers" className={styles.viewAllBtn}>
              View All <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className={styles.sectionSubtext}>
            Certified professionals ready to help you reach your fitness goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className={styles.trainerSwiper}
          >
            {TRAINERS.map((trainer) => (
              <SwiperSlide key={trainer.id}>
                <TrainerCard trainer={trainer} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

/* ── Featured Gyms ── */
const FeaturedGyms = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={`${styles.section} ${styles.sectionAlt}`}
      aria-labelledby="gyms-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="FEATURED" variant="light" />
          <div className={styles.sectionHeadRow}>
            <h2 id="gyms-heading" className={styles.sectionHeading}>
              Featured <span className={styles.accentText}>Gyms</span>
            </h2>
            <Link to="/gyms" className={styles.viewAllBtn}>
              View All <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className={styles.sectionSubtext}>
            Premium gyms verified by our quality team.
          </p>
        </motion.div>

        <motion.div
          className={styles.gymsGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {GYMS.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Special Offers ── */
const SpecialOffers = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="offers-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="LIMITED TIME" variant="light" />
          <h2 id="offers-heading" className={styles.sectionHeading}>
            Special <span className={styles.accentText}>Offers</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Exclusive deals and promotions available for a limited time.
          </p>
        </motion.div>

        <motion.div
          className={styles.offersGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── Why Gymssy ── */
const WhyGymssy = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className={`${styles.section} ${styles.sectionAlt}`}
      aria-labelledby="why-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHead}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <SectionLabel text="WHY GYMSSY" variant="light" />
          <h2 id="why-heading" className={styles.sectionHeading}>
            Why Discover with <span className={styles.accentText}>Gymssy</span>
          </h2>
          <p className={styles.sectionSubtext}>
            The smarter way to discover, compare and book fitness experiences.
          </p>
        </motion.div>

        <motion.div
          className={styles.whyGrid}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {WHY_FEATURES.map((f) => (
            <motion.div
              key={f.title}
              className={`${styles.whyCard} ${styles[`whyCard--${f.color}`]}`}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className={`${styles.whyIconWrap} ${styles[`whyIconWrap--${f.color}`]}`}
              >
                <f.icon className={styles.whyIcon} aria-hidden="true" />
              </div>
              <h3 className={styles.whyTitle}>{f.title}</h3>
              <p className={styles.whyDesc}>{f.desc}</p>
              <div className={styles.whyCardShine} aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
const DiscoverPage = () => (
  <main className={styles.page}>
    <PageHeader />
    <SmartSearch />
    <TrendingCategories />
    <TrendingNearYou />
    <FeaturedCollections />
    <PopularCities />
    <TopTrainers />
    <FeaturedGyms />
    <SpecialOffers />
    <WhyGymssy />
  </main>
);

export default DiscoverPage;
