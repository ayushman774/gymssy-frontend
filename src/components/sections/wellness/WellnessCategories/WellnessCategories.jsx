import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import FitnessSection from "../../fitness/FitnessSection/FitnessSection";
import { WELLNESS_SUBCATEGORIES } from "../../../../assets/data/wellnessData";
import styles from "./WellnessCategories.module.css";

/* Reuses the same card structure as FitnessCategories
   with wellness accent colours */
const WellnessCategoryCard = ({ item, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() => navigate(`/wellness/${item.slug}`)}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/wellness/${item.slug}`);
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

const WellnessCategories = ({ sectionRef }) => (
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
    <div
      ref={sectionRef}
      className={styles.grid}
      role="list"
      aria-label="Wellness subcategories"
    >
      {WELLNESS_SUBCATEGORIES.map((item, index) => (
        <div key={item.id} className={styles.gridItem} role="listitem">
          <WellnessCategoryCard item={item} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default WellnessCategories;
