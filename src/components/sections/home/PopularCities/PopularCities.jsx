// src/components/Home/PopularCities/PopularCities.jsx

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import CityCard from "../../../ui/CityCard/CityCard";
import usePopularCities from "../../../../hooks/usePopularCities";
import styles from "./PopularCities.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   LOADING SKELETON — 6 placeholder cards
══════════════════════════════════════════════════════ */
const CitySkeleton = () => (
  <div className={styles.grid} aria-label="Loading cities" aria-busy="true">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} className={styles.skeletonCard} aria-hidden="true">
        <div className={styles.skeletonImg} />
        <div className={styles.skeletonBody}>
          <div
            className={styles.skeletonLine}
            style={{ width: "40%", height: 13 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: "65%", height: 22, marginTop: 6 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: "50%", height: 13, marginTop: 8 }}
          />
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
   POPULAR CITIES — Main Section
══════════════════════════════════════════════════════ */
const PopularCities = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const gsapRan = useRef(false);

  /* ── API ── */
  const { cities, loading, error, refetch } = usePopularCities();

  const isInView = useInView(sectionRef, { once: true, margin: "-8% 0px" });

  /* ── GSAP — runs once after cities load ── */
  useGSAP(
    () => {
      if (loading || error || cities.length === 0) return;
      if (gsapRan.current) return;
      gsapRan.current = true;

      /* Neon line */
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

      /* Card stagger */
      const cardSlots = sectionRef.current?.querySelectorAll(
        `.${styles.cardSlot}`,
      );
      if (cardSlots?.length) {
        gsap.fromTo(
          cardSlots,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(`.${styles.grid}`),
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    },
    {
      scope: sectionRef,
      dependencies: [loading, error, cities.length],
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="cities-heading"
      id="cities"
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
            <SectionLabel text="EXPLORE YOUR CITY" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="cities-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Popular <span className={styles.headlineAccent}>Cities</span>
            </motion.h2>
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Thousands of gyms and trainers across India's top cities.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* ══ CONTENT STATES ══ */}

        {/* Loading */}
        {loading && <CitySkeleton />}

        {/* Error */}
        {!loading && error && (
          <ErrorState
            message="Unable to load cities. Please check your connection."
            onRetry={refetch}
          />
        )}

        {/* Success */}
        {!loading && !error && cities.length > 0 && (
          <div className={styles.grid} role="list" aria-label="Popular cities">
            {cities.map((city, index) => (
              <div key={city.id} className={styles.cardSlot} role="listitem">
                <CityCard city={city} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && cities.length === 0 && (
          <motion.p
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            No cities available right now. Please check back soon.
          </motion.p>
        )}
      </div>

      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default PopularCities;
