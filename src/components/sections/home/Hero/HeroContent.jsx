import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiSearch, FiNavigation, FiX } from "react-icons/fi";
import {
  SEARCH_SUGGESTIONS,
  POPULAR_CHIPS,
} from "../../../../assets/data/marketplace";
import styles from "./HeroContent.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ── Search Bar ──────────────────────────────────────────── */
const HeroSearch = () => {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const filteredSuggestions = query
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <div className={styles.searchPanel}>

        {/* ── Location Field ── */}
        <div className={styles.searchField}>
          <FiMapPin className={styles.searchFieldIcon} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or area"
            className={styles.searchInput}
            aria-label="Location"
          />
          <button
            className={styles.gpsBtn}
            aria-label="Use current location"
            onClick={() => setLocation("Current Location")}
          >
            <FiNavigation className={styles.gpsBtnIcon} />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className={styles.searchDivider} aria-hidden="true" />

        {/* ── Query Field ── */}
        <div className={styles.searchField} style={{ flex: 1, minWidth: 0 }}>
          <FiSearch className={styles.searchFieldIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Gyms, yoga, trainers, CrossFit..."
            className={`${styles.searchInput} ${styles.searchInputGrow}`}
            aria-label="Search fitness services"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setQuery("");
                setShowSuggestions(false);
              }}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* ── Search Button ── */}
        <motion.button
          className={styles.searchBtn}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Search"
          onClick={() => setShowSuggestions(false)}
        >
          <span className={styles.searchBtnText}>Search</span>
          <FiSearch className={styles.searchBtnIcon} />
          <span className={styles.searchBtnRipple} aria-hidden="true" />
        </motion.button>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            className={styles.suggestions}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            <span className={styles.suggestionsLabel}>
              {query ? "Matching services" : "Popular searches"}
            </span>
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                className={styles.suggestionItem}
                onMouseDown={() => handleSelect(s)}
                role="option"
              >
                <FiSearch className={styles.suggestionIcon} />
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main HeroContent ────────────────────────────────────── */
const HeroContent = ({ animRefs }) => {
  return (
    <motion.div
      className={styles.content}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Eyebrow */}
      <motion.div className={styles.eyebrowRow} variants={itemVariants}>
        <span className={styles.eyebrowDot} aria-hidden="true" />
        <span className={styles.eyebrowText}>
          India's #1 Fitness Marketplace
        </span>
        <span className={styles.eyebrowDot} aria-hidden="true" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        ref={animRefs?.headline}
        className={styles.headline}
        variants={itemVariants}
      >
        India's Fitness{" "}
        <span className={styles.headlineAccent}>Marketplace -</span>{" "}
        Find, Compare & Book Fitness Classes
      </motion.h1>

      {/* Subheadline */}
      <motion.p className={styles.subheadline} variants={itemVariants}>
        Discover gyms, trainers, yoga studios, fitness classes, and wellness
        experiences near you.
      </motion.p>

      {/* Search */}
      <motion.div variants={itemVariants} style={{ width: "100%" }}>
        <HeroSearch />
      </motion.div>

      {/* Popular Chips */}
      <motion.div className={styles.chipsRow} variants={itemVariants}>
        <span className={styles.chipsLabel}>Popular:</span>
        {POPULAR_CHIPS.map((chip) => (
          <motion.button
            key={chip}
            className={styles.chip}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            {chip}
          </motion.button>
        ))}
      </motion.div>

      {/* Trust row */}
      <motion.div className={styles.trustRow} variants={itemVariants}>
        {[
          { value: "10,000+", label: "Fitness Centers" },
          { value: "50K+", label: "Happy Members" },
          { value: "4.9★", label: "Avg. Rating" },
        ].map((stat) => (
          <div key={stat.label} className={styles.trustStat}>
            <span className={styles.trustValue}>{stat.value}</span>
            <span className={styles.trustLabel}>{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;