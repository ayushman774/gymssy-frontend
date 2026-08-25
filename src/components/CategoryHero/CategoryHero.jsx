/**
 * CategoryHero.jsx
 * Dynamic hero section for any category listing page.
 *
 * Props:
 *   category   — API category object (may be null while loading)
 *   slug       — raw URL slug (used as fallback title)
 *   total      — number of results
 *   loading    — boolean
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import styles from "./CategoryHero.module.css";

/* ─────────────────────────────────────────────
   Derive a human-readable title from slug if
   API category metadata isn't loaded yet.
───────────────────────────────────────────── */
const slugToTitle = (slug = "") =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");


const CategoryHero = ({ category, slug, total, loading }) => {
  const displayTitle = category?.name ?? slugToTitle(slug);
  const displayDesc =
    category?.description ?? `Explore the best ${displayTitle} near you.`;

  /* Background image from category if available */
  const bgUrl = category?.image?.url ?? category?.image ?? null;

  return (
    <section className={styles.hero} aria-label={`${displayTitle} category`}>
      {/* Background */}
      {bgUrl && (
        <div className={styles.heroBg} aria-hidden="true">
          <img
            src={bgUrl}
            alt=""
            className={styles.heroBgImg}
            loading="eager"
          />
          <div className={styles.heroBgOverlay} />
        </div>
      )}
      {!bgUrl && <div className={styles.heroBgFallback} aria-hidden="true" />}

      {/* Gradient line */}
      <div className={styles.heroAccentLine} aria-hidden="true" />

      <div className={styles.heroInner}>

        {/* Title */}
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {displayTitle}
        </motion.h1>

        {/* Description */}
        <motion.p
          className={styles.heroDesc}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.07,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {displayDesc}
        </motion.p>

        {/* Result count */}
        {!loading && total > 0 && (
          <motion.div
            className={styles.heroCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span className={styles.heroCountNum}>
              {total.toLocaleString()}+
            </span>
            <span className={styles.heroCountLabel}>
              {displayTitle} available
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryHero;
