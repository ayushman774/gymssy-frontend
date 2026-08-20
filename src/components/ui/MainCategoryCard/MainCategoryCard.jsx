import { useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import styles from "./MainCategoryCard.module.css";

/* ══════════════════════════════════════════════════════
   MAIN CATEGORY CARD
   Large hero-style card with image background.
   Used in the 3-card top row of ExploreCategories.
══════════════════════════════════════════════════════ */
const MainCategoryCard = ({ category, isActive, onClick, index }) => {
  const { title, description, image, accentColor, count } = category;

  return (
    <motion.article
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      style={{ "--accent": accentColor }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${title} — ${description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      {/* ── Background Image ── */}
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
          variants={{
            hover: {
              scale: 1.06,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        />
        {/* Dark overlay */}
        <div className={styles.overlay} />
        {/* Accent gradient at bottom */}
        <div className={styles.accentGradient} />
      </div>

      {/* ── Active indicator line ── */}
      {isActive && (
        <motion.div
          className={styles.activeLine}
          layoutId="activeCategoryLine"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}

      {/* ── Content ── */}
      <div className={styles.content}>
        {/* Count pill */}
        <span className={styles.countPill}>{count}</span>

        {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Footer row */}
        <div className={styles.footer}>
          <span className={styles.exploreText}>
            {isActive ? "Browsing" : "Explore"}
          </span>

          {/* Arrow button */}
          <motion.div
            className={`${styles.arrowBtn} ${isActive ? styles.arrowBtnActive : ""}`}
            variants={{
              hover: {
                x: 4,
                scale: 1.1,
                transition: { duration: 0.25 },
              },
            }}
            aria-hidden="true"
          >
            <FiArrowRight className={styles.arrowIcon} />
          </motion.div>
        </div>
      </div>

      {/* ── Hover border glow ── */}
      <motion.div
        className={styles.borderGlow}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.3 },
          },
        }}
        initial={{ opacity: isActive ? 0.6 : 0 }}
        animate={{ opacity: isActive ? 0.6 : 0 }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

export default MainCategoryCard;
