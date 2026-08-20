import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiSearch, FiArrowRight } from "react-icons/fi";
import styles from "./SportsHero.module.css";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const SportsHero = ({ onExploreClick }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ type: "sports" });
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/discover?${params.toString()}`);
  };

  return (
    <section className={styles.hero} aria-label="Sports hero">
      {/* Background */}
      <div className={styles.heroBg} aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1800&q=80&fit=crop&auto=format"
          alt=""
          className={styles.heroBgImage}
        />
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroBgGradient} />
      </div>

      <div className={styles.heroInner}>
        {/* Eyebrow */}
        <motion.span
          className={styles.eyebrow}
          variants={FADE_UP}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          🏆 Sports on Gymssy
        </motion.span>

        {/* Heading */}
        <motion.h1
          className={styles.heading}
          variants={FADE_UP}
          custom={0.1}
          initial="hidden"
          animate="visible"
        >
          Play More. <span className={styles.headingBlock}>Train Harder.</span>{" "}
          <span className={styles.headingAccent}>Go Further.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          variants={FADE_UP}
          custom={0.2}
          initial="hidden"
          animate="visible"
        >
          Discover sports academies, expert coaches, courts, swimming, martial
          arts and sports experiences near you.
        </motion.p>

        {/* Search */}
        <motion.form
          className={styles.searchBar}
          onSubmit={handleSearch}
          role="search"
          aria-label="Search sports"
          variants={FADE_UP}
          custom={0.3}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.searchField}>
            <FiMapPin className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            />
          </div>

          <div className={styles.searchDivider} aria-hidden="true" />

          <div className={`${styles.searchField} ${styles.searchFieldGrow}`}>
            <FiSearch className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search sports, coaches, academies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search sports, coaches or academies"
            />
          </div>

          <motion.button
            type="submit"
            className={styles.searchBtn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Search"
          >
            <FiSearch aria-hidden="true" />
            <span>Search</span>
          </motion.button>
        </motion.form>

        {/* Explore CTA */}
        <motion.button
          className={styles.exploreCta}
          onClick={onExploreClick}
          variants={FADE_UP}
          custom={0.4}
          initial="hidden"
          animate="visible"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Explore sports categories"
        >
          Explore Sports
          <FiArrowRight className={styles.exploreArrow} aria-hidden="true" />
        </motion.button>

        {/* Stats */}
        <motion.div
          className={styles.stats}
          variants={FADE_UP}
          custom={0.5}
          initial="hidden"
          animate="visible"
          aria-label="Sports on Gymssy statistics"
        >
          {[
            { value: "500+", label: "Sports Academies" },
            { value: "200+", label: "Expert Coaches" },
            { value: "50+", label: "Sports & Activities" },
            { value: "6", label: "Major Cities" },
          ].map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SportsHero;
