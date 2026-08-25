/**
 * TrainerCard.jsx
 * Updated to handle the rich TRAINERS data shape:
 *   trainer.image → { src, srcSet, sizes, alt }
 *   trainer.href  → "/trainers/sofia-vega"  (pre-built)
 *   trainer.role, trainer.specialty, trainer.rating,
 *   trainer.reviews, trainer.experience, trainer.available
 *
 * Navigation uses trainer.href if present,
 * otherwise falls back to slugify(trainer.name).
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight, FiClock } from "react-icons/fi";
import { slugify } from "../../../../utils/slugify";
import styles from "./TrainerCard.module.css";

const TrainerCard = ({ trainer }) => {
  const navigate = useNavigate();

  /* Prefer pre-built href, fall back to slug */
  const href = trainer.href ?? `/trainers/${slugify(trainer.name)}`;

  /* Normalise image — supports both string and object shapes */
  const imgSrc = trainer.image?.src ?? trainer.image;
  const imgSrcSet = trainer.image?.srcSet ?? undefined;
  const imgSizes = trainer.image?.sizes ?? undefined;
  const imgAlt = trainer.image?.alt ?? `${trainer.name} trainer photo`;

  const handleNav = () => navigate(href);

  return (
    <motion.article
      className={styles.card}
      onClick={handleNav}
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      style={{ cursor: "pointer" }}
      aria-label={`View ${trainer.name}'s trainer profile`}
    >
      {/* ── Image ── */}
      <div className={styles.imageWrap}>
        <img
          src={imgSrc}
          srcSet={imgSrcSet}
          sizes={imgSizes}
          alt={imgAlt}
          className={styles.image}
          loading="lazy"
        />

        {/* Availability badge */}
        <div
          className={`${styles.availBadge} ${
            trainer.available ? styles.availOpen : styles.availClosed
          }`}
          aria-label={trainer.available ? "Available" : "Unavailable"}
        >
          <span className={styles.availDot} aria-hidden="true" />
          {trainer.available ? "Available" : "Busy"}
        </div>

        {/* Featured badge */}
        {trainer.featured && (
          <div className={styles.featuredBadge} aria-label="Featured">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        {/* Role */}
        {trainer.role && <p className={styles.role}>{trainer.role}</p>}

        <h3 className={styles.name}>{trainer.name}</h3>

        {/* Specialty or specialization */}
        <p className={styles.spec}>
          {trainer.specialty ?? trainer.specialization}
        </p>

        {/* Meta row */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FiStar className={styles.metaStar} aria-hidden="true" />
            <span>{trainer.rating}</span>
            <span className={styles.metaCount}>
              ({trainer.reviews ?? trainer.reviewCount})
            </span>
          </span>

          {trainer.experience && (
            <span className={styles.metaItem}>
              <FiClock className={styles.metaIcon} aria-hidden="true" />
              {trainer.experience}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <motion.button
            className={styles.btn}
            onClick={(e) => {
              e.stopPropagation();
              handleNav();
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`View ${trainer.name}'s profile`}
          >
            View Profile
            <FiArrowRight aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default TrainerCard;
