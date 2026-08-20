import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import FitnessSection from "../FitnessSection/FitnessSection";
import { FITNESS_SUBCATEGORIES } from "../../../../assets/data/fitnessData";
import styles from "./FitnessCategories.module.css";

/* ── Single subcategory card ── */
const SubcategoryCard = ({ item, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() => navigate(`/fitness/${item.slug}`)}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/fitness/${item.slug}`);
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
      {/* Image */}
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{ backgroundImage: `url(${item.image})` }}
          variants={{
            hover: {
              scale: 1.07,
              transition: { duration: 0.55, ease: "easeOut" },
            },
          }}
        />
        <div className={styles.imageOverlay} />
        {/* Count badge */}
        <span className={styles.countBadge}>{item.count}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
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

      {/* Hover border */}
      <motion.div
        className={styles.borderGlow}
        variants={{ hover: { opacity: 0.45, transition: { duration: 0.3 } } }}
        initial={{ opacity: 0 }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

/* ── Section ── */
const FitnessCategories = ({ sectionRef }) => (
  <FitnessSection
    id="fitness-categories"
    label="EXPLORE FITNESS"
    title="Find the Right"
    titleAccent="Fitness Experience"
    subtitle="Explore every discipline — from gyms and personal training to CrossFit, Pilates and more."
    viewAllHref="/fitness"
    viewAllText="All Fitness"
  >
    <div
      ref={sectionRef}
      className={styles.grid}
      role="list"
      aria-label="Fitness subcategories"
    >
      {FITNESS_SUBCATEGORIES.map((item, index) => (
        <div key={item.id} className={styles.gridItem} role="listitem">
          <SubcategoryCard item={item} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default FitnessCategories;
