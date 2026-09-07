// src/components/sections/wellness/WellnessNutrition/WellnessNutrition.jsx
//
// CHANGES FROM PREVIOUS VERSION:
//   - Added: useNutritionists hook (API-driven nutritionist cards)
//   - Added: NutritionistCard component for real data display
//   - Added: Loading skeleton for nutritionist cards
//   - Added: Error state with retry for nutritionist section
//   - Added: "View All Nutritionists" → /nutritionists
//   - Preserved: ALL existing static content, headings, icons, animations
//   - Preserved: ALL existing CSS classes and visual design

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiRefreshCw } from "react-icons/fi";

import useNutritionists from "../../../../hooks/useNutritionists";
import NutritionistCard from "../../../ui/NutritionistCard/NutritionistCard";
import styles from "./WellnessNutrition.module.css";

/* ── Animation variants (match existing project) ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Skeleton placeholder card ── */
const NutritionistSkeleton = () => (
  <div className={styles.skeletonCard} aria-hidden="true">
    <div className={styles.skeletonImg} />
    <div className={styles.skeletonBody}>
      {[
        { w: "45%", h: 10 },
        { w: "70%", h: 18 },
        { w: "90%", h: 12 },
        { w: "55%", h: 12 },
        { w: "80%", h: 28 },
      ].map((s, i) => (
        <div
          key={i}
          className={styles.skeletonLine}
          style={{ width: s.w, height: s.h }}
        />
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const WellnessNutrition = () => {
  const navigate = useNavigate();
  const { nutritionists, loading, error, refetch } = useNutritionists();

  return (
    <section className={styles.section} aria-labelledby="nutrition-heading">
      <div className={styles.container}>
        {/* ── Header ── */}
        <motion.div
          className={styles.header}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className={styles.eyebrow}>Nutrition &amp; Healthy Living</span>
          <h2 className={styles.title} id="nutrition-heading">
            Fuel Your <span className={styles.accent}>Best Self</span>
          </h2>
          <p className={styles.subtitle}>
            Connect with certified nutrition experts for personalized meal
            plans, weight management, and sustainable lifestyle coaching.
          </p>
        </motion.div>

        {/* ── Nutritionist Cards Grid ── */}
        {loading ? (
          /* Loading skeletons */
          <div
            className={styles.grid}
            aria-label="Loading nutritionists"
            aria-busy="true"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <NutritionistSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <motion.div
            className={styles.errorBox}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            role="alert"
          >
            <p className={styles.errorText}>
              Unable to load nutritionists. Please try again.
            </p>
            <button className={styles.retryBtn} onClick={refetch}>
              <FiRefreshCw aria-hidden="true" /> Try Again
            </button>
          </motion.div>
        ) : nutritionists.length === 0 ? (
          /* Empty state */
          <motion.p
            className={styles.emptyText}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            No nutritionists available at this time. Check back soon.
          </motion.p>
        ) : (
          /* Cards */
          <motion.div
            className={styles.grid}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Show max 3 on Wellness page */}
            {nutritionists.slice(0, 3).map((n, i) => (
              <NutritionistCard
                key={n._id ?? n.id ?? i}
                nutritionist={n}
                index={i}
              />
            ))}
          </motion.div>
        )}

        {/* ── View All CTA ── */}
        <motion.div
          className={styles.viewAll}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          <motion.button
            className={styles.viewAllBtn}
            onClick={() => navigate("/nutritionists")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="View all nutritionists"
          >
            View All Nutritionists <FiArrowRight aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WellnessNutrition;
