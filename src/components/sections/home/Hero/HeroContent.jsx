import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiChevronDown, FiArrowRight, FiSearch } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import { MdOutlineFitnessCenter, MdOutlineCalendarToday, MdOutlineStar } from "react-icons/md";
import styles from "./HeroContent.module.css";

/* ── Activity options for the dropdown ── */
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

/* ── Stats shown on the right ── */
const STATS = [
  { icon: MdOutlineFitnessCenter, value: "5000+",   label: "Fitness Centers" },
  { icon: MdOutlineCalendarToday, value: "50,000+", label: "Classes Booked"  },
  { icon: MdOutlineStar,          value: "4.8/5",   label: "Average Rating"  },
];

/* ── Animation variants ── */
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const statVariants = {
  hidden:  { opacity: 0, x: 40 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.5 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ════════════════════════════════════════════════
   SEARCH BAR
════════════════════════════════════════════════ */
const HeroSearch = () => {
  const [location,     setLocation]     = useState("");
  const [activity,     setActivity]     = useState("All Activities");
  const [dropOpen,     setDropOpen]     = useState(false);
  const dropRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.searchBar}>

      {/* Location field */}
      <div className={styles.searchField}>
        <FiMapPin className={styles.searchFieldIcon} aria-hidden="true" />
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

      {/* Divider */}
      <div className={styles.searchDivider} aria-hidden="true" />

      {/* Activity dropdown */}
      <div className={styles.searchField} ref={dropRef} style={{ position: "relative" }}>
        <HiOutlineUsers className={styles.searchFieldIcon} aria-hidden="true" />
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

        {/* Dropdown list */}
        <AnimatePresence>
          {dropOpen && (
            <motion.ul
              className={styles.activityDropdown}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              role="listbox"
              aria-label="Select activity"
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

      {/* CTA button */}
      <button className={styles.searchBtn} aria-label="Find Experiences">
        <span>Find Experiences</span>
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════════
   STAT CARD (floating right)
════════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, value, label, index }) => (
  <motion.div
    className={styles.statCard}
    variants={statVariants}
    custom={index}
    initial="hidden"
    animate="visible"
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

/* ════════════════════════════════════════════════
   HERO CONTENT
════════════════════════════════════════════════ */
const HeroContent = () => {
  return (
    <div className={styles.layout}>

      {/* ── LEFT — main copy ── */}
      <motion.div
        className={styles.left}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow badge */}
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>India's #1 Fitness Marketplace</span>
        </motion.div>

        {/* Headline — 3 lines matching the image */}
        <motion.h1 className={styles.headline} variants={itemVariants}>
          <span className={styles.headlineLine1}>Discover, Compare &amp; Book</span>
          <span className={styles.headlineLine2}>India's Best</span>
          <span className={styles.headlineLine3}>Fitness Experiences</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p className={styles.subheadline} variants={itemVariants}>
          Find gyms, yoga, dance, swimming, CrossFit,
          personal trainers, and wellness experiences—
          <br className={styles.subBreak} />
          all in one place.
        </motion.p>

        {/* Search bar */}
        <motion.div variants={itemVariants} style={{ width: "100%" }}>
          <HeroSearch />
        </motion.div>
      </motion.div>

      {/* ── RIGHT — floating stat cards ── */}
      <div className={styles.right} aria-label="Platform statistics">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>
    </div>
  );
};

export default HeroContent;