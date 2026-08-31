import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import FitnessSection from "../../fitness/FitnessSection/FitnessSection";
import useCategoriesData from "../../../../hooks/useCategoriesData";
import styles from "./WellnessCategories.module.css";

/* ─────────────────────────────────────────────────────────────
   WELLNESS CATEGORY CARD
   Structure is identical to before.
   Only change: item.image → item.image?.url  (API nested shape)
   item.title, item.slug, item.description, item.count all
   remain unchanged — useCategoriesData already normalises
   sub.name → title and sub._id → id.
───────────────────────────────────────────────────────────── */
const WellnessCategoryCard = ({ item, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() => navigate(`/category/${item.slug}`)}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/category/${item.slug}`);
        }
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.6,
        delay: (index % 5) * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      {/* Image
          Previously: style={{ backgroundImage: `url(${item.image})` }}
          Now:        style={{ backgroundImage: `url(${item.image?.url})` }}
          Reason: useCategoriesData normalises image as { url, alt }
      */}
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{ backgroundImage: `url(${item.image?.url})` }}
          variants={{
            hover: {
              scale: 1.07,
              transition: { duration: 0.55, ease: "easeOut" },
            },
          }}
        />
        <div className={styles.imageOverlay} />

        {/* Count: API provides a number; format with "+" at render time.
            Static data had pre-formatted strings like "890+".
            useCategoriesData normalises count as a number (sub.count ?? 0). */}
        <span className={styles.countBadge}>{`${item.count}+`}</span>
      </div>

      {/* Content — item.title and item.description unchanged */}
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>

        <div className={styles.footer}>
          <span className={styles.exploreLabel}>Explore</span>
          <motion.div
            className={styles.arrowBtn}
            variants={{
              hover: {
                x: 3,
                scale: 1.1,
                transition: { duration: 0.2 },
              },
            }}
            aria-hidden="true"
          >
            <FiArrowRight />
          </motion.div>
        </div>
      </div>

      {/* Hover border — purple */}
      <motion.div
        className={styles.borderGlow}
        variants={{
          hover: { opacity: 0.45, transition: { duration: 0.3 } },
        }}
        initial={{ opacity: 0 }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

/* ─────────────────────────────────────────────────────────────
   WELLNESS CATEGORIES SECTION
   Data flow:
     useCategoriesData()           — already used by Fitness
       ↓ GET /api/categories
       ↓ normalises API response
     mainCategories.find(slug === "wellness")
       ↓ wellness.subcategories
     WellnessCategoryCard[]

   useCategoriesData is reused as-is from the Fitness migration.
   No new hook, no new service, no new API layer created.
───────────────────────────────────────────────────────────── */
const WellnessCategories = ({ sectionRef }) => {
  const { mainCategories, loading, error } = useCategoriesData();

  const wellnessCategory = mainCategories.find(
    (category) => category.slug === "wellness",
  );
  const wellnessSubcategories = wellnessCategory?.subcategories ?? [];

  return (
    <FitnessSection
      id="wellness-categories"
      label="EXPLORE WELLNESS"
      title="Find the Right"
      titleAccent="Wellness Experience"
      subtitle="Explore every wellness discipline — from yoga and meditation to spa, nutrition and recovery."
      viewAllHref="/wellness"
      viewAllText="All Wellness"
      neonColor="#39ff14"
    >
      {loading ? (
        /* Loading: render the grid shell with aria-busy.
           Section heading/subtitle remain visible via FitnessSection.
           No skeleton introduced — matching the simplest safe behavior. */
        <div
          ref={sectionRef}
          className={styles.grid}
          role="list"
          aria-label="Wellness subcategories"
          aria-busy="true"
        />
      ) : error ? (
        /* Error: render empty grid shell.
           No fallback static data. No WELLNESS_SUBCATEGORIES.
           Section heading remains visible. */
        <div
          ref={sectionRef}
          className={styles.grid}
          role="list"
          aria-label="Wellness subcategories"
        />
      ) : (
        <div
          ref={sectionRef}
          className={styles.grid}
          role="list"
          aria-label="Wellness subcategories"
        >
          {wellnessSubcategories.map((item, index) => (
            /* item.id comes from useCategoriesData: sub._id → id */
            <div key={item.id} className={styles.gridItem} role="listitem">
              <WellnessCategoryCard item={item} index={index} />
            </div>
          ))}
        </div>
      )}
    </FitnessSection>
  );
};

export default WellnessCategories;
