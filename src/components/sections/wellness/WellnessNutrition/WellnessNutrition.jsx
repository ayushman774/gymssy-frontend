import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FitnessSection from "../../fitness/FitnessSection/FitnessSection";
import { NUTRITION_ITEMS } from "../../../../assets/data/wellnessData";
import styles from "./WellnessNutrition.module.css";

/*
  NOTE: No dedicated backend API exists yet for nutrition services.
  This section renders static data and is structured so the items
  array can be replaced with API data when /api/wellness/nutrition
  becomes available.
*/

const NutritionCard = ({ item, index }) => {
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        <span className={styles.icon}>{item.icon}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
        <span className={styles.count}>{item.count} options</span>
      </div>

      <div className={styles.glow} aria-hidden="true" />
    </motion.article>
  );
};

const WellnessNutrition = () => (
  <FitnessSection
    id="wellness-nutrition"
    label="HEALTHY LIVING"
    title="Nutrition &"
    titleAccent="Healthy Living"
    subtitle="Build healthier habits with the right guidance from certified nutrition experts."
    viewAllHref="/wellness/nutrition"
    viewAllText="View All"
    neonColor="#39ff14"
  >
    <div
      className={styles.grid}
      role="list"
      aria-label="Nutrition and healthy living services"
    >
      {NUTRITION_ITEMS.map((item, index) => (
        <div key={item.id} role="listitem">
          <NutritionCard item={item} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default WellnessNutrition;
