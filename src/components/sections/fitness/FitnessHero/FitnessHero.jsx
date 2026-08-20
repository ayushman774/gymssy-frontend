import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiSearch,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";
import styles from "./FitnessHero.module.css";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=85&fit=crop&auto=format",
];

const QUICK_SEARCHES = [
  "Gyms near me",
  "Personal Trainer",
  "CrossFit",
  "HIIT Classes",
  "Pilates",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

const FitnessHero = ({ onExploreClick }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [currentImg, setCurrentImg] = useState(0);

  /* Slideshow */
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentImg((p) => (p + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (query) params.set("q", query);
    navigate(`/discover?${params.toString()}`);
  };

  const handleQuickSearch = (term) => {
    navigate(`/discover?q=${encodeURIComponent(term)}`);
  };

  return (
    <section className={styles.hero} aria-label="Fitness page hero">
      {/* ── Background Images ── */}
      <div className={styles.bgLayer} aria-hidden="true">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`${styles.bgSlide} ${
              i === currentImg ? styles.bgSlideActive : ""
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* ── Overlays ── */}
      <div className={styles.overlayDark} aria-hidden="true" />
      <div className={styles.overlayBottom} aria-hidden="true" />
      <div className={styles.overlayLeft} aria-hidden="true" />
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* ── Content ── */}
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Label */}
          <motion.div className={styles.label} variants={itemVariants}>
            <span className={styles.labelDot} aria-hidden="true" />
            <span>Fitness on Gymssy</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 className={styles.heading} variants={itemVariants}>
            Find Your Perfect
            <span className={styles.headingAccent}> Fitness Experience</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p className={styles.subtitle} variants={itemVariants}>
            Discover gyms, personal trainers, CrossFit, Pilates, HIIT and
            fitness classes built around your goals.
          </motion.p>

          {/* ── Search Form ── */}
          <motion.form
            className={styles.searchForm}
            variants={itemVariants}
            onSubmit={handleSearch}
            role="search"
            aria-label="Search fitness providers"
          >
            {/* Location field */}
            <div className={styles.searchField}>
              <FiMapPin className={styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter Location"
                className={styles.searchInput}
                aria-label="Enter your location"
              />
            </div>

            <div className={styles.searchDivider} aria-hidden="true" />

            {/* Query field */}
            <div className={styles.searchField}>
              <FiSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gyms, trainers, classes..."
                className={styles.searchInput}
                aria-label="Search for fitness providers"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.searchBtn}
              aria-label="Search fitness providers"
            >
              <FiSearch aria-hidden="true" />
              <span>Search</span>
            </button>
          </motion.form>

          {/* Quick searches */}
          <motion.div className={styles.quickSearches} variants={itemVariants}>
            <span className={styles.quickLabel}>Popular:</span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                className={styles.quickChip}
                onClick={() => handleQuickSearch(term)}
                type="button"
                aria-label={`Quick search: ${term}`}
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div className={styles.ctaRow} variants={itemVariants}>
            <motion.button
              className={styles.ctaPrimary}
              onClick={onExploreClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Explore fitness categories"
            >
              Explore Fitness
              <FiArrowRight aria-hidden="true" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          className={styles.scrollIndicator}
          onClick={onExploreClick}
          aria-label="Scroll to explore categories"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiChevronDown aria-hidden="true" />
        </motion.button>
      </div>

      {/* ── Bottom fade ── */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
};

export default FitnessHero;
