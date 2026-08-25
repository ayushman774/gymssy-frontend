import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiClock,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";

import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import useTrendingExperiences from "../../../../hooks/useTrendingExperiences";
import styles from "./TrendingExperiences.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   EXPERIENCE CARD — reads normalised shape
   image  → plain string URL (resolved by hook)
   duration → already formatted string e.g. "90 min"
══════════════════════════════════════════════════════ */
const ExperienceCard = ({ exp, index }) => {
  const {
    title,
    category,
    image,
    duration,
    level,
    rating,
    priceFrom,
    spots,
    trending,
    href,
  } = exp;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* ── Image ── */}
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          className={styles.image}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div className={styles.imageOverlay} />

        {trending && (
          <div className={styles.trendBadge} aria-label="Trending">
            <MdLocalFireDepartment
              className={styles.trendIcon}
              aria-hidden="true"
            />
            Trending
          </div>
        )}

        <div className={styles.categoryBadge}>{category}</div>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FiClock className={styles.metaIcon} aria-hidden="true" />
            {duration}
          </span>
          <span className={styles.metaItem}>
            <FiUsers className={styles.metaIcon} aria-hidden="true" />
            {spots} spots left
          </span>
          <span className={styles.metaItem}>
            <FiStar
              className={`${styles.metaIcon} ${styles.starIcon}`}
              aria-hidden="true"
            />
            {rating}
          </span>
        </div>

        <span className={styles.level}>{level}</span>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceFrom}>From</span>
            <span className={styles.priceVal}>${priceFrom}</span>
          </div>

          <motion.a
            href={href}
            className={styles.bookBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Book ${title}`}
          >
            Book Now
            <FiArrowRight aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   SKELETON — 4 placeholder cards
══════════════════════════════════════════════════════ */
const ExperienceSkeleton = () => (
  <div
    className={styles.grid}
    aria-label="Loading experiences"
    aria-busy="true"
  >
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className={styles.skeletonCard} aria-hidden="true">
        <div className={styles.skeletonImg} />
        <div className={styles.skeletonBody}>
          <div
            className={styles.skeletonLine}
            style={{ width: "70%", height: 18 }}
          />
          <div className={styles.skeletonMeta}>
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className={styles.skeletonLine}
                style={{ width: 60, height: 13 }}
              />
            ))}
          </div>
          <div
            className={styles.skeletonLine}
            style={{ width: "35%", height: 13 }}
          />
          <div className={styles.skeletonFooter}>
            <div
              className={styles.skeletonLine}
              style={{ width: "30%", height: 22 }}
            />
            <div className={styles.skeletonBtn} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════
   ERROR STATE
══════════════════════════════════════════════════════ */
const ErrorState = ({ message, onRetry }) => (
  <motion.div
    className={styles.errorState}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    role="alert"
  >
    <FiAlertCircle className={styles.errorIcon} aria-hidden="true" />
    <p className={styles.errorMsg}>{message}</p>
    <button className={styles.retryBtn} onClick={onRetry}>
      <FiRefreshCw aria-hidden="true" />
      Try Again
    </button>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   TRENDING EXPERIENCES — Main Section
══════════════════════════════════════════════════════ */
const TrendingExperiences = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const gsapRan = useRef(false);

  /* ── API ── */
  const { experiences, loading, error, refetch } = useTrendingExperiences();

  const isInView = useInView(sectionRef, { once: true, margin: "-8% 0px" });

  /* ── GSAP neon line — runs once after data loads ── */
  useGSAP(
    () => {
      if (loading || error || experiences.length === 0) return;
      if (gsapRan.current) return;
      gsapRan.current = true;

      gsap.fromTo(
        neonLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    },
    {
      scope: sectionRef,
      dependencies: [loading, error, experiences.length],
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="trending-heading"
      id="trending"
    >
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* ══ HEADER ══ */}
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionLabel text="HOT RIGHT NOW" variant="light" />
          </motion.div>

          <motion.h2
            id="trending-heading"
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trending Fitness{" "}
            <span className={styles.headlineAccent}>Experiences</span>
          </motion.h2>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            The most popular fitness sessions this week.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* ══ CONTENT STATES ══ */}

        {/* Loading */}
        {loading && <ExperienceSkeleton />}

        {/* Error */}
        {!loading && error && (
          <ErrorState
            message="Unable to load experiences. Please check your connection."
            onRetry={refetch}
          />
        )}

        {/* Success */}
        {!loading && !error && experiences.length > 0 && (
          <div
            className={styles.grid}
            role="list"
            aria-label="Trending fitness experiences"
          >
            {experiences.map((exp, index) => (
              <div key={exp.id} role="listitem">
                <ExperienceCard exp={exp} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && experiences.length === 0 && (
          <motion.p
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            No trending experiences available right now. Check back soon.
          </motion.p>
        )}
      </div>

      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default TrendingExperiences;
