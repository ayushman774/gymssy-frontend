// src/components/Home/FeaturedTrainers/FeaturedTrainers.jsx

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import TrainerCard from "../../../ui/TrainerCard/TrainerCard";
import useFeaturedTrainers from "../../../../hooks/useFeaturedTrainers";
import styles from "./FeaturedTrainers.module.css";

gsap.registerPlugin(ScrollTrigger);

const VISIBLE = 3;

/* ══════════════════════════════════════════════════════
   LOADING SKELETON — 3 cards matching TrainerCard shape
══════════════════════════════════════════════════════ */
const TrainerSkeleton = () => (
  <div
    className={styles.cardsRow}
    aria-label="Loading trainers"
    aria-busy="true"
  >
    {[0, 1, 2].map((i) => (
      <div key={i} className={styles.skeletonCard} aria-hidden="true">
        <div className={styles.skeletonImg} />
        <div className={styles.skeletonBody}>
          <div
            className={styles.skeletonLine}
            style={{ width: "60%", height: 18 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: "80%", height: 13, marginTop: 8 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: "50%", height: 13, marginTop: 6 }}
          />
          <div className={styles.skeletonFooter}>
            <div
              className={styles.skeletonLine}
              style={{ width: "35%", height: 20 }}
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
   FEATURED TRAINERS
══════════════════════════════════════════════════════ */
const FeaturedTrainers = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const gsapRan = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  /* ── API ── */
  const { trainers, loading, error, refetch } = useFeaturedTrainers();

  const isInView = useInView(sectionRef, { once: true, margin: "-8% 0px" });

  /* ── Navigation ── */
  const goNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % trainers.length);
  }, [trainers.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + trainers.length) % trainers.length);
  }, [trainers.length]);

  /* ── Compute visible 3 trainers ── */
  const visible =
    trainers.length > 0
      ? Array.from({ length: Math.min(VISIBLE, trainers.length) }, (_, i) => {
          const idx = (activeIndex + i) % trainers.length;
          return { ...trainers[idx], slotIndex: i };
        })
      : [];

  /* ── GSAP — runs once after trainers load ── */
  useGSAP(
    () => {
      if (loading || error || trainers.length === 0) return;
      if (gsapRan.current) return;
      gsapRan.current = true;

      if (neonLineRef.current) {
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
      }
    },
    {
      scope: sectionRef,
      dependencies: [loading, error, trainers.length],
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="trainers-heading"
      id="featured-trainers"
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
            <SectionLabel text="EXPERT COACHES" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="trainers-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Featured <span className={styles.headlineAccent}>Trainers</span>
            </motion.h2>

            {/* Nav controls — only rendered when data is ready */}
            {!loading && !error && trainers.length > VISIBLE && (
              <motion.div
                className={styles.navControls}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <button
                  className={styles.navBtn}
                  onClick={goPrev}
                  aria-label="Previous trainer"
                >
                  <FiChevronLeft />
                </button>

                <div
                  className={styles.navPips}
                  role="tablist"
                  aria-label="Trainer navigation"
                >
                  {trainers.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.pip} ${i === activeIndex ? styles.pipActive : ""}`}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`View trainer ${i + 1} of ${trainers.length}`}
                      aria-selected={i === activeIndex}
                      role="tab"
                    />
                  ))}
                </div>

                <button
                  className={styles.navBtn}
                  onClick={goNext}
                  aria-label="Next trainer"
                >
                  <FiChevronRight />
                </button>
              </motion.div>
            )}
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Connect with certified coaches across every discipline.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* ══ CONTENT STATES ══ */}

        {/* Loading */}
        {loading && <TrainerSkeleton />}

        {/* Error */}
        {!loading && error && (
          <ErrorState
            message="Unable to load trainers. Please check your connection."
            onRetry={refetch}
          />
        )}

        {/* Success */}
        {!loading && !error && trainers.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className={styles.cardsRow}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              role="list"
              aria-label="Featured trainers"
            >
              {visible.map((trainer, i) => (
                <div key={`${trainer.id}-${i}`} role="listitem">
                  <TrainerCard trainer={trainer} isCenter={i === 1} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty */}
        {!loading && !error && trainers.length === 0 && (
          <motion.p
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            No featured trainers available right now.
          </motion.p>
        )}
      </div>

      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default FeaturedTrainers;
