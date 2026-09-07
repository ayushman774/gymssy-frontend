// src/components/ui/NutritionistCard/NutritionistCard.jsx

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiClock, FiArrowRight, FiUsers } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import styles from "./NutritionistCard.module.css";

/* ── Shared fade-up variant (matches project convention) ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const NutritionistCard = ({ nutritionist, index = 0 }) => {
  const navigate = useNavigate();

  if (!nutritionist) return null;

  /* ── Safe field access ── */
  const imgSrc = nutritionist.image?.src ?? "";
  const imgAlt =
    nutritionist.image?.alt ?? `${nutritionist.name} — Nutritionist`;
  const rating = nutritionist.rating ?? 0;
  const reviews =
    typeof nutritionist.reviews === "number" ? nutritionist.reviews : 0;
  const specs = Array.isArray(nutritionist.specializations)
    ? nutritionist.specializations.slice(0, 2)
    : [];

  const handleNavigate = () => {
    navigate(`/nutritionists/${nutritionist.slug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <motion.article
      className={styles.card}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={index * 0.08}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${nutritionist.name}'s profile`}
    >
      {/* ── Image ── */}
      <div className={styles.imgWrap}>
        {imgSrc ? (
          <img
            src={imgSrc}
            srcSet={nutritionist.image?.srcSet}
            sizes={nutritionist.image?.sizes}
            alt={imgAlt}
            className={styles.img}
            loading="lazy"
          />
        ) : (
          <div className={styles.imgFallback} aria-hidden="true" />
        )}

        <div className={styles.imgOverlay} aria-hidden="true" />

        {/* Availability badge */}
        <div
          className={`${styles.availBadge} ${
            nutritionist.available ? styles.availOpen : styles.availClosed
          }`}
          role="status"
        >
          <span className={styles.availDot} aria-hidden="true" />
          {nutritionist.available ? "Available" : "Unavailable"}
        </div>

        {/* Verified badge */}
        {nutritionist.isVerified && (
          <div
            className={styles.verifiedBadge}
            aria-label="Verified nutritionist"
          >
            <MdVerified aria-hidden="true" />
          </div>
        )}

        {/* Featured ribbon */}
        {nutritionist.featured && (
          <div className={styles.featuredRibbon} aria-label="Featured">
            Featured
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Role */}
        <p className={styles.role}>{nutritionist.role}</p>

        {/* Name */}
        <h3 className={styles.name}>{nutritionist.name}</h3>

        {/* Specialty */}
        {nutritionist.specialty && (
          <p className={styles.specialty}>{nutritionist.specialty}</p>
        )}

        {/* Rating row */}
        <div className={styles.ratingRow}>
          <FiStar className={styles.starIcon} aria-hidden="true" />
          <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
          <span className={styles.ratingCount}>
            ({reviews.toLocaleString()} reviews)
          </span>
        </div>

        {/* Quick stats */}
        <div className={styles.statsRow}>
          {nutritionist.experience && (
            <span className={styles.stat}>
              <FiClock aria-hidden="true" />
              {nutritionist.experience}
            </span>
          )}
          {nutritionist.clients && (
            <span className={styles.stat}>
              <FiUsers aria-hidden="true" />
              {nutritionist.clients} clients
            </span>
          )}
        </div>

        {/* Specialization pills */}
        {specs.length > 0 && (
          <div className={styles.pills} aria-label="Specializations">
            {specs.map((s) => (
              <span key={s} className={styles.pill}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={styles.cta} aria-hidden="true">
          View Profile <FiArrowRight />
        </div>
      </div>
    </motion.article>
  );
};

export default NutritionistCard;
