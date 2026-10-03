import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import GlobalMarketplaceSearch from "../../../MarketplaceSearch/GlobalMarketplaceSearch.jsx";
import styles from "./HeroContent.module.css";

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

const HeroContent = ({ currentSlide }) => {
  const accent = currentSlide?.accent ?? "#39ff14";
  const navigate = useNavigate();

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
          <span className={styles.badgeText}>Fitness Marketplace</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 className={styles.headline} variants={itemVariants}>
          {/* <span className={styles.headlineLine1}>
            Discover, Compare &amp; Book
          </span> */}
          <span className={styles.headlineLine2} style={{ color: accent }}>
            Your Fitness,
          </span>
          <span className={styles.headlineLine3}>Just Minutes Away</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p className={styles.subheadline} variants={itemVariants}>
          Find gyms, yoga, dance, swimming, CrossFit, personal trainers, and
          wellness experiences — all in one place.
        </motion.p>

        {/* ════════════════════════════════════════════
            CTA BUTTONS — inserted here, between
            subheadline and search bar.
            Uses itemVariants so it fades up with
            the rest of the content stagger.
        ════════════════════════════════════════════ */}
        <motion.div className={styles.ctaRow} variants={itemVariants}>
          {/* Primary — Book a Class */}
          <motion.button
            className={styles.ctaPrimary}
            style={{ background: accent }}
            onClick={() => navigate("/discover")}
            aria-label="Book a fitness class"
            whileHover={{
              scale: 1.03,
              boxShadow: `0 8px 28px color-mix(in srgb, ${accent} 40%, transparent)`,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Book a Class
            <FiArrowRight className={styles.ctaIcon} aria-hidden="true" />
          </motion.button>

          {/* Secondary — Partner with Gymssy */}
          <motion.button
            className={styles.ctaSecondary}
            style={{
              borderColor: `color-mix(in srgb, ${accent} 45%, rgba(255,255,255,0.15))`,
              color: "#ffffff",
            }}
            onClick={() => navigate("/partner-with-us")}
            aria-label="Partner with Gymssy"
            whileHover={{
              background: `color-mix(in srgb, ${accent} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${accent} 65%, transparent)`,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Partner with Gymssy
          </motion.button>
        </motion.div>
        {/* ════════════════════════════════════════════ */}

        {/* Search */}
        <motion.div variants={itemVariants} style={{ width: "100%" }}>
          <GlobalMarketplaceSearch accent={accent} />
        </motion.div>

        {/* Trust badges */}
        <motion.div className={styles.trustRow} variants={itemVariants}>
          {[
            "✓ Verified Fitness Partners",
            "✓ Secure Online Booking",
            "✓ Compare Prices",
            "✓ Easy Cancellation",
          ].map((t) => (
            <span key={t} className={styles.trustBadge}>
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

    </div>
  );
};

export default HeroContent;
