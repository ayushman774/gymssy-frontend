import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers } from "react-icons/fi";
import TrainerCard from "./TrainerCard";
import { TRAINERS } from "../../../../assets/data/trainers";
import styles from "./Trainers.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── Filter tabs ───────────────────────────────────────────────────────────
const FILTERS = [
  { id: "all", label: "All Trainers" },
  { id: "strength", label: "Strength" },
  { id: "hiit", label: "HIIT" },
  { id: "nutrition", label: "Nutrition" },
  { id: "mobility", label: "Mobility" },
];

// ── Filter logic ──────────────────────────────────────────────────────────
const filterTrainer = (trainer, filter) => {
  if (filter === "all") return true;
  const specialty = trainer.specialty.toLowerCase();
  const filterMap = {
    strength: ["strength", "powerlifting", "athletic"],
    hiit: ["hiit", "functional", "cardio"],
    nutrition: ["nutrition", "weight loss"],
    mobility: ["yoga", "mobility", "recovery"],
  };
  return (filterMap[filter] || []).some((kw) => specialty.includes(kw));
};

const Trainers = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  const filtered = TRAINERS.filter((t) => filterTrainer(t, activeFilter));

  // ── GSAP neon line ────────────────────────────────────────────────────
  useEffect(() => {
    if (!neonLineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
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
            start: "top 70%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.trainers}
      aria-labelledby="trainers-heading"
      id="trainers"
    >
      {/* ── BACKGROUNDS ─────────────────────────────── */}
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── SECTION HEADER ────────────────────────── */}
        <div className={styles.header}>
          {/* Label */}
          <motion.div
            className={styles.labelRow}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className={styles.labelLine} aria-hidden="true" />
            <span className={styles.labelText}>Meet Your Coaches</span>
            <span className={styles.labelLine} aria-hidden="true" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="trainers-heading"
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trained by the <span className={styles.headlineAccent}>Best.</span>
          </motion.h2>

          {/* Sub copy */}
          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Every Apex coach is hand-selected for their expertise, results
            record, and ability to elevate others. These are not just trainers —
            they are architects of transformation.
          </motion.p>

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>

          {/* Team stat */}
          <motion.div
            className={styles.teamStat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FiUsers className={styles.teamStatIcon} aria-hidden="true" />
            <span className={styles.teamStatText}>
              <strong>50+ coaches</strong> across all disciplines
            </span>
          </motion.div>
        </div>

        {/* ── FILTER TABS ───────────────────────────── */}
        <motion.div
          className={styles.filterRow}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          role="tablist"
          aria-label="Filter trainers by specialty"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              className={`
                ${styles.filterBtn}
                ${activeFilter === filter.id ? styles.filterBtnActive : ""}
              `}
              onClick={() => setActiveFilter(filter.id)}
              role="tab"
              aria-selected={activeFilter === filter.id}
              aria-controls="trainers-grid"
            >
              {filter.label}
              {activeFilter === filter.id && (
                <motion.span
                  className={styles.filterActivePill}
                  layoutId="filterPill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── TRAINERS GRID ─────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            id="trainers-grid"
            className={styles.grid}
            role="tabpanel"
            aria-label={`${activeFilter} trainers`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.length > 0 ? (
              filtered.map((trainer, index) => (
                <TrainerCard
                  key={trainer.id}
                  trainer={trainer}
                  index={index}
                  layout={trainer.featured ? "featured" : "grid"}
                />
              ))
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <span className={styles.emptyIcon}>🔍</span>
                <p>No trainers found for this specialty.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── BOTTOM CTA ────────────────────────────── */}
        <motion.div
          className={styles.bottomCTA}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.ctaContent}>
            <p className={styles.ctaHeadline}>Find your perfect coach.</p>
            <p className={styles.ctaBody}>
              Not sure who's right for you? Book a free consultation and we'll
              match you with your ideal trainer.
            </p>
          </div>
          <div className={styles.ctaButtons}>
            <Link to="/trainers" className={styles.ctaPrimary}>
              <span>Meet All Trainers</span>
              <FiArrowRight className={styles.ctaArrow} />
            </Link>
            <Link to="/contact" className={styles.ctaSecondary}>
              Free Consultation
            </Link>
          </div>
          <div className={styles.ctaGlow} aria-hidden="true" />
        </motion.div>
      </div>

      {/* ── EDGE FADES ──────────────────────────────── */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default Trainers;
