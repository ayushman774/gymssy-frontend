import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import FitnessSection from "../FitnessSection/FitnessSection";
import styles from "./FitnessCategories.module.css";

/* ── Single subcategory card — DESIGN UNCHANGED ── */
const SubcategoryCard = ({ item, index }) => {
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
        delay: (index % 4) * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      {/* Image — always from frontend data */}
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{
            backgroundImage: item.image ? `url(${item.image})` : "none",
          }}
          variants={{
            hover: {
              scale: 1.07,
              transition: { duration: 0.55, ease: "easeOut" },
            },
          }}
        />
        <div className={styles.imageOverlay} />
        {/* Count badge — now from API */}
        {item.count > 0 && (
          <span className={styles.countBadge}>
            {item.count.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* title from API (api.name) merged as item.title */}
        <h3 className={styles.title}>{item.title}</h3>
        {/* description from API */}
        <p className={styles.description}>{item.description}</p>

        <div className={styles.footer}>
          <span className={styles.exploreLabel}>Explore</span>
          <motion.div
            className={styles.arrowBtn}
            variants={{
              hover: { x: 3, scale: 1.1, transition: { duration: 0.2 } },
            }}
            aria-hidden="true"
          >
            <FiArrowRight />
          </motion.div>
        </div>
      </div>

      {/* Hover border — UNCHANGED */}
      <motion.div
        className={styles.borderGlow}
        variants={{ hover: { opacity: 0.45, transition: { duration: 0.3 } } }}
        initial={{ opacity: 0 }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

/* ────────────────────────────────────────────────────
   Skeleton — shown while categories are loading.
   Matches card dimensions so layout doesn't jump.
──────────────────────────────────────────────────── */
const CategorySkeleton = () => (
  <div className={styles.grid} aria-label="Loading categories" aria-busy="true">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className={styles.gridItem} aria-hidden="true">
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonImg} />
          <div className={styles.skeletonBody}>
            <div
              className={styles.skeletonLine}
              style={{ width: "55%", height: 20 }}
            />
            <div
              className={styles.skeletonLine}
              style={{ width: "80%", height: 13, marginTop: 8 }}
            />
            <div
              className={styles.skeletonLine}
              style={{ width: "65%", height: 13, marginTop: 4 }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ────────────────────────────────────────────────────
   FitnessCategories
   
   Props:
     sectionRef   — forwarded ref (unchanged)
     categories   — merged array from useFitnessData
     loading      — boolean from useFitnessData
──────────────────────────────────────────────────── */
const FitnessCategories = ({
  sectionRef,
  categories = [],
  loading = false,
}) => (
  <FitnessSection
    id="fitness-categories"
    label="EXPLORE FITNESS"
    title="Find the Right"
    titleAccent="Fitness Experience"
    subtitle="Explore every discipline — from gyms and personal training to CrossFit, Pilates and more."
    viewAllHref="/fitness"
    viewAllText="All Fitness"
  >
    {loading ? (
      <CategorySkeleton />
    ) : (
      <div
        ref={sectionRef}
        className={styles.grid}
        role="list"
        aria-label="Fitness subcategories"
      >
        {categories.map((item, index) => (
          <div
            key={item.id ?? item.slug}
            className={styles.gridItem}
            role="listitem"
          >
            <SubcategoryCard item={item} index={index} />
          </div>
        ))}
      </div>
    )}
  </FitnessSection>
);

export default FitnessCategories;
