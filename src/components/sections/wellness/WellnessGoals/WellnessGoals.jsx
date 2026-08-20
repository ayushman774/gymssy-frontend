import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FitnessSection from "../../fitness/FitnessSection/FitnessSection";
import { WELLNESS_GOALS } from "../../../../assets/data/wellnessData";
import styles from "./WellnessGoals.module.css";

const WellnessGoalCard = ({ goal, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() => navigate(`/discover?goal=${goal.query}&type=wellness`)}
      role="button"
      tabIndex={0}
      aria-label={`Wellness goal: ${goal.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/discover?goal=${goal.query}&type=wellness`);
        }
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <span className={styles.icon} aria-hidden="true">
        {goal.icon}
      </span>
      <h3 className={styles.title}>{goal.title}</h3>
      <p className={styles.description}>{goal.description}</p>
      <span className={styles.cta}>Find Options →</span>
      <div className={styles.glow} aria-hidden="true" />
    </motion.article>
  );
};

const WellnessGoals = () => (
  <FitnessSection
    id="wellness-goals"
    label="PERSONALISED WELLNESS"
    title="Wellness"
    titleAccent="by Goal"
    subtitle="Tell us what you want to achieve and we'll find the right wellness experiences for you."
    neonColor="#39ff14"
  >
    <div className={styles.grid} role="list" aria-label="Wellness goals">
      {WELLNESS_GOALS.map((goal, index) => (
        <div key={goal.id} role="listitem">
          <WellnessGoalCard goal={goal} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default WellnessGoals;
