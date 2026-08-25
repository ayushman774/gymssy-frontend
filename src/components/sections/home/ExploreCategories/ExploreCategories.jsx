/**
 * ExploreCategories.jsx
 *
 * CHANGES FROM PREVIOUS VERSION:
 *   - Removed static MAIN_CATEGORIES import
 *   - Added useCategoriesData hook (API-driven)
 *   - Added loading skeleton (3 cards matching real card dimensions)
 *   - Added error state with retry button
 *   - All animation/interaction logic unchanged
 *   - MainCategoryCard, SubcategoryChip, SectionLabel unchanged
 */

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiGrid,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import MainCategoryCard from "../../../ui/MainCategoryCard/MainCategoryCard";
import SubcategoryChip from "../../../ui/SubcategoryChip/SubcategoryChip";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import useCategoriesData from "../../../../hooks/useCategoriesData";

import styles from "./ExploreCategories.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   LOADING SKELETON
   3 placeholder cards that match MainCategoryCard shape.
   Uses CSS animation — no extra libraries.
══════════════════════════════════════════════════════ */
const CategorySkeleton = () => (
  <div
    className={styles.mainGrid}
    aria-label="Loading categories"
    aria-busy="true"
  >
    {[0, 1, 2].map((i) => (
      <div key={i} className={styles.skeletonCard} aria-hidden="true">
        <div className={styles.skeletonImg} />
        <div className={styles.skeletonBody}>
          <div
            className={styles.skeletonLine}
            style={{ width: "55%", height: 22 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: "80%", height: 14, marginTop: 10 }}
          />
          <div
            className={styles.skeletonLine}
            style={{ width: "65%", height: 14, marginTop: 6 }}
          />
          <div className={styles.skeletonChips}>
            {[0, 1, 2].map((j) => (
              <div key={j} className={styles.skeletonChip} />
            ))}
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
   SUBCATEGORY PANEL — unchanged from original
══════════════════════════════════════════════════════ */
const SubcategoryPanel = ({ category }) => {
  const { subcategories, title, accentColor, slug } = category;

  return (
    <motion.div
      className={styles.subPanel}
      key={category.id}
      initial={{ opacity: 0, height: 0, y: -10 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -10 }}
      transition={{
        duration: 0.42,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { duration: 0.3 },
        height: { duration: 0.42 },
      }}
      style={{ "--accent": accentColor }}
      aria-label={`${title} subcategories`}
    >
      <div className={styles.subPanelInner}>
        {/* Panel header */}
        <div className={styles.subPanelHeader}>
          <div className={styles.subPanelTitle}>
            <span className={styles.subPanelDot} aria-hidden="true" />
            <span>{title}</span>
          </div>

          <Link
            to={`/category/${slug}`}
            className={styles.subPanelViewAll}
            aria-label={`View all ${title} categories`}
          >
            View all {title}
            <FiArrowRight
              className={styles.subPanelViewAllIcon}
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Divider */}
        <motion.div
          className={styles.subPanelDivider}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        />

        {/* Chips */}
        {subcategories.length > 0 ? (
          <div
            className={styles.chipsGrid}
            role="list"
            aria-label={`${title} subcategories`}
          >
            {subcategories.map((sub, i) => (
              <div key={sub.id} role="listitem">
                <SubcategoryChip
                  subcategory={sub}
                  accentColor={accentColor}
                  index={i}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noSubs}>
            No subcategories found for {title} yet.
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   EXPLORE CATEGORIES — Main Section
══════════════════════════════════════════════════════ */
const ExploreCategories = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const gsapRan = useRef(false);

  const [activeId, setActiveId] = useState(null);

  /* ── API data ── */
  const {
    mainCategories,
    loading,
    error,
    /* expose refetch from hook if needed */
  } = useCategoriesData();

  /* Re-fetch trigger — increment forces useEffect to re-run */
  const [retryKey, setRetryKey] = useState(0);
  const handleRetry = useCallback(() => setRetryKey((k) => k + 1), []);

  const isInView = useInView(sectionRef, { once: true, margin: "-8% 0px" });

  /* ── Toggle ── */
  const handleCategoryClick = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  /* ── Active category object ── */
  const activeCategory = mainCategories.find((c) => c.id === activeId) ?? null;

  /* ── GSAP — runs once after categories load ── */
  useGSAP(
    () => {
      if (loading || error || mainCategories.length === 0) return;
      if (gsapRan.current) return;
      gsapRan.current = true;

      /* Neon line draw */
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

      /* Main cards stagger */
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
            duration: 0.72,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(`.${styles.mainGrid}`),
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    },
    {
      scope: sectionRef,
      dependencies: [loading, error, mainCategories.length],
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="categories-heading"
      id="categories"
    >
      {/* ── Backgrounds ── */}
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
            <SectionLabel text="BROWSE BY CATEGORY" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="categories-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore Top{" "}
              <span className={styles.headlineAccent}>Categories</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/categories" className={styles.viewAll}>
                View All
                <FiArrowRight
                  className={styles.viewAllIcon}
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Choose your preferred fitness experience.
          </motion.p>

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* ══ CONTENT STATES ══ */}

        {/* Loading */}
        {loading && <CategorySkeleton />}

        {/* Error */}
        {!loading && error && (
          <ErrorState
            message="Unable to load categories. Please check your connection."
            onRetry={handleRetry}
          />
        )}

        {/* Success — main 3-card grid */}
        {!loading && !error && mainCategories.length > 0 && (
          <>
            <div
              className={styles.mainGrid}
              role="list"
              aria-label="Main fitness categories"
            >
              {mainCategories.map((cat, index) => (
                <div key={cat.id} className={styles.cardSlot} role="listitem">
                  <MainCategoryCard
                    category={cat}
                    isActive={activeId === cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    index={index}
                  />
                </div>
              ))}
            </div>

            {/* ── SUBCATEGORY PANEL ── */}
            <AnimatePresence mode="wait">
              {activeCategory && (
                <SubcategoryPanel
                  key={activeCategory.id}
                  category={activeCategory}
                />
              )}
            </AnimatePresence>

            {/* ── HINT — only when nothing selected ── */}
            <AnimatePresence>
              {!activeId && (
                <motion.p
                  className={styles.hint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  aria-live="polite"
                >
                  <FiGrid className={styles.hintIcon} aria-hidden="true" />
                  Select a category to explore subcategories
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Empty — API returned no main categories */}
        {!loading && !error && mainCategories.length === 0 && (
          <motion.p
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            No categories available right now. Please check back soon.
          </motion.p>
        )}
      </div>

      {/* ── Edge fades ── */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default ExploreCategories;
