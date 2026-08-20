import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiArrowRight, FiGrid } from "react-icons/fi";

import MainCategoryCard from "../../../ui/MainCategoryCard/MainCategoryCard";
import SubcategoryChip from "../../../ui/SubcategoryChip/SubcategoryChip";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { MAIN_CATEGORIES } from "../../../../assets/data/categories";

import styles from "./ExploreCategories.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   SUBCATEGORY PANEL
   Animated panel that reveals when a main category
   is selected. AnimatePresence handles mount/unmount.
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
      {/* Panel inner — padded so overflow:hidden clips cleanly */}
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
          transition={{ duration: 0.55, delay: 0.1, ease: "power3.out" }}
        />

        {/* Chips grid */}
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

  /* Active main category — null means none selected */
  const [activeId, setActiveId] = useState(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  /* ── Toggle: clicking same card closes it ── */
  const handleCategoryClick = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  /* ── Active category object ── */
  const activeCategory = MAIN_CATEGORIES.find((c) => c.id === activeId) ?? null;

  /* ── GSAP animations ── */
  useGSAP(
    () => {
      /* Neon line draw */
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

      /* Main cards stagger */
      gsap.fromTo(
        `.${styles.cardSlot}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.mainGrid}`,
            start: "top 80%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
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

        {/* ══ MAIN 3-CARD GRID ══ */}
        <div
          className={styles.mainGrid}
          role="list"
          aria-label="Main fitness categories"
        >
          {MAIN_CATEGORIES.map((cat, index) => (
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

        {/* ══ SUBCATEGORY PANEL ══
            AnimatePresence handles smooth enter/exit.
            Key on activeId forces remount when category changes
            so entrance animation always plays.
        ══════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <SubcategoryPanel
              key={activeCategory.id}
              category={activeCategory}
            />
          )}
        </AnimatePresence>

        {/* ══ BOTTOM HINT — only when nothing is selected ══ */}
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
      </div>

      {/* ── Edge fades ── */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default ExploreCategories;
