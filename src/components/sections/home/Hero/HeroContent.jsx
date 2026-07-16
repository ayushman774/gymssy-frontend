import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiChevronDown, FiArrowRight } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import {
  MdOutlineFitnessCenter,
  MdOutlineCalendarToday,
  MdOutlineStar,
} from "react-icons/md";
import styles from "./HeroContent.module.css";

const ACTIVITIES = [
  "All Activities",
  "Gyms",
  "Yoga",
  "Dance",
  "Swimming",
  "CrossFit",
  "Personal Trainers",
  "Pilates",
  "Martial Arts",
  "Zumba",
];

const STATS = [
  { icon: MdOutlineFitnessCenter, value: "5000+", label: "Fitness Centers" },
  { icon: MdOutlineCalendarToday, value: "50,000+", label: "Classes Booked" },
  { icon: MdOutlineStar, value: "4.8/5", label: "Average Rating" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ── Search Bar ── */
const HeroSearch = ({ accent }) => {
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("All Activities");
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.searchBar}>
      {/* Location */}
      <div className={styles.searchField}>
        <FiMapPin
          className={styles.searchFieldIcon}
          style={{ color: accent }}
          aria-hidden="true"
        />
        <div className={styles.searchFieldText}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Location"
            className={styles.searchInput}
            aria-label="Enter your location"
          />
          <span className={styles.searchFieldSub}>Your city or area</span>
        </div>
      </div>

      <div className={styles.searchDivider} aria-hidden="true" />

      {/* Activity */}
      <div
        className={styles.searchField}
        ref={dropRef}
        style={{ position: "relative" }}
      >
        <HiOutlineUsers
          className={styles.searchFieldIcon}
          style={{ color: accent }}
          aria-hidden="true"
        />
        <div
          className={styles.searchFieldText}
          role="button"
          tabIndex={0}
          onClick={() => setDropOpen((p) => !p)}
          onKeyDown={(e) => e.key === "Enter" && setDropOpen((p) => !p)}
          aria-haspopup="listbox"
          aria-expanded={dropOpen}
        >
          <span className={styles.searchInputDisplay}>{activity}</span>
          <span className={styles.searchFieldSub}>
            Yoga, Gym, Dance &amp; more
          </span>
        </div>
        <FiChevronDown
          className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />

        <AnimatePresence>
          {dropOpen && (
            <motion.ul
              className={styles.activityDropdown}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              role="listbox"
            >
              {ACTIVITIES.map((a) => (
                <li
                  key={a}
                  role="option"
                  aria-selected={activity === a}
                  className={`${styles.activityOption} ${
                    activity === a ? styles.activityOptionActive : ""
                  }`}
                  onMouseDown={() => {
                    setActivity(a);
                    setDropOpen(false);
                  }}
                >
                  {a}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Button */}
      <button
        className={styles.searchBtn}
        style={{ background: accent }}
        aria-label="Find Experiences"
      >
        <span>Find Experiences</span>
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, value, label, accent, index }) => (
  <motion.div
    className={styles.statCard}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.6,
      delay: 0.5 + index * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    style={{ "--accent": accent }}
  >
    <div className={styles.statIconWrap}>
      <Icon className={styles.statIcon} aria-hidden="true" />
    </div>
    <div>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  </motion.div>
);

/* ── Main ── */
const HeroContent = ({ currentSlide }) => {
  const accent = currentSlide?.accent ?? "#39ff14";

  return (
    <div className={styles.layout}>
      {/* LEFT */}
      <motion.div
        className={styles.left}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          className={styles.badge}
          variants={itemVariants}
          style={{
            borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
          }}
        >
          <span
            className={styles.badgeDot}
            style={{ background: accent }}
            aria-hidden="true"
          />
          <span className={styles.badgeText}>
            India's #1 Fitness Marketplace
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 className={styles.headline} variants={itemVariants}>
          <span className={styles.headlineLine1}>
            Discover, Compare &amp; Book
          </span>
          <span className={styles.headlineLine2} style={{ color: accent }}>
            India's Best
          </span>
          <span className={styles.headlineLine3}>Fitness Experiences</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p className={styles.subheadline} variants={itemVariants}>
          Find gyms, yoga, dance, swimming, CrossFit, personal trainers, and
          wellness experiences — all in one place.
        </motion.p>

        {/* Search */}
        <motion.div variants={itemVariants} style={{ width: "100%" }}>
          <HeroSearch accent={accent} />
        </motion.div>

        {/* Trust badges */}
        <motion.div className={styles.trustRow} variants={itemVariants}>
          {[
            "✓ Verified Partners",
            "✓ Secure Booking",
            "✓ Best Prices",
            "✓ 24/7 Support",
          ].map((t) => (
            <span key={t} className={styles.trustBadge}>
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* RIGHT — stats */}
      <div className={styles.right} aria-label="Platform statistics">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} accent={accent} index={i} />
        ))}
      </div>
    </div>
  );
};

export default HeroContent;
