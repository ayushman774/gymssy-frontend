import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiSearch,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";
import styles from "./WellnessHero.module.css";

/* Calm wellness imagery */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1616279967983-ec413476e824?w=1920&q=85&fit=crop&auto=format",
];

const QUICK_SEARCHES = [
  "Yoga near me",
  "Meditation",
  "Spa & Recovery",
  "Nutrition Coach",
  "Wellness Center",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const WellnessHero = ({ onExploreClick }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [currentImg, setCurrentImg] = useState(0);

  /* Slower slideshow — calmer than fitness */
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentImg((p) => (p + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (query) params.set("q", query);
    params.set("type", "wellness");
    navigate(`/discover?${params.toString()}`);
  };

  const handleQuickSearch = (term) => {
    navigate(`/discover?q=${encodeURIComponent(term)}&type=wellness`);
  };

  return (
    <section className={styles.hero} aria-label="Wellness page hero">
      {/* ── Background Slideshow ── */}
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

      {/* ── Overlays — slightly more purple tint for wellness ── */}
      <div className={styles.overlayDark} aria-hidden="true" />
      <div className={styles.overlayBottom} aria-hidden="true" />
      <div className={styles.overlayLeft} aria-hidden="true" />
      <div className={styles.overlayPurple} aria-hidden="true" />
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
            <span>Wellness on Gymssy</span>
          </motion.div>

          {/* Heading — split across lines */}
          <motion.h1 className={styles.heading} variants={itemVariants}>
            Find Your Balance.
            <span className={styles.headingAccent}> Move Better.</span>
            <br />
            Feel Better.
          </motion.h1>

          {/* Subtitle */}
          <motion.p className={styles.subtitle} variants={itemVariants}>
            Discover yoga, meditation, wellness centers, nutrition, recovery and
            mindful experiences designed around your wellbeing.
          </motion.p>

          {/* CTA */}
          <motion.div className={styles.ctaRow} variants={itemVariants}>
            <motion.button
              className={styles.ctaPrimary}
              onClick={onExploreClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Explore wellness categories"
            >
              Explore Wellness
              <FiArrowRight aria-hidden="true" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          className={styles.scrollIndicator}
          onClick={onExploreClick}
          aria-label="Scroll to explore wellness"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiChevronDown aria-hidden="true" />
        </motion.button>
      </div>

      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
};

export default WellnessHero;
