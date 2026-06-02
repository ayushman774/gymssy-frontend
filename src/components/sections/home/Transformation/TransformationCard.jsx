import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiStar, FiClock, FiTrendingDown, FiZap } from "react-icons/fi";
import BeforeAfterSlider from "./BeforeAfterSlider";
import styles from "./TransformationCard.module.css";

// ── Star rating component ─────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        className={`${styles.star} ${i < rating ? styles.starFilled : ""}`}
        aria-hidden="true"
      />
    ))} 
  </div>
);

// ── Stat pill ─────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, value, label }) => (
  <div className={styles.statPill}>
    <Icon className={styles.statPillIcon} aria-hidden="true" />
    <div className={styles.statPillText}>
      <span className={styles.statPillValue}>{value}</span>
      <span className={styles.statPillLabel}>{label}</span>
    </div>
  </div>
);

const TransformationCard = ({ transformation, index, isActive }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-5%" });

  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      aria-label={`${transformation.name}'s transformation story`}
    >
      <div
        className={`
          ${styles.cardInner}
          ${isEven ? styles.cardInnerEven : styles.cardInnerOdd}
        `}
      >
        {/* ── SLIDER COLUMN ─────────────────────────── */}
        <div className={styles.sliderCol}>
          {/* Index number */}
          <div className={styles.indexNumber} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Before / After Slider */}
          <BeforeAfterSlider
            before={transformation.before}
            after={transformation.after}
            autoPlay={isActive}
          />

          {/* Program tag */}
          <div className={styles.programTag}>
            <span className={styles.programTagDot} aria-hidden="true" />
            <span>{transformation.program}</span>
          </div>
        </div>

        {/* ── CONTENT COLUMN ────────────────────────── */}
        <div className={styles.contentCol}>
          {/* Header */}
          <div className={styles.contentHeader}>
            <div className={styles.memberInfo}>
              <h3 className={styles.memberName}>{transformation.name}</h3>
              <span className={styles.memberAge}>Age {transformation.age}</span>
            </div>
            <StarRating rating={transformation.rating} />
          </div>

          {/* Duration badge */}
          <div className={styles.durationBadge}>
            <FiClock className={styles.durationIcon} aria-hidden="true" />
            <span>{transformation.duration} Program</span>
          </div>

          {/* Stats pills */}
          <div className={styles.statsRow}>
            <StatPill
              icon={FiTrendingDown}
              value={transformation.stats.weightLost}
              label="Weight Lost"
            />
            <StatPill
              icon={FiZap}
              value={transformation.stats.muscleGained}
              label="Muscle Gained"
            />
            <StatPill
              icon={FiTrendingDown}
              value={transformation.stats.bodyFat}
              label="Body Fat"
            />
          </div>

          {/* Divider */}
          <div className={styles.divider} aria-hidden="true" />

          {/* Quote */}
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden="true">
              "
            </span>
            <p className={styles.quoteText}>{transformation.quote}</p>
          </blockquote>

          {/* Neon accent */}
          <div className={styles.neonAccent} aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
};

export default TransformationCard;
