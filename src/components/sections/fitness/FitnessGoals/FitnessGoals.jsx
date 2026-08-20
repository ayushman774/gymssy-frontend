import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FitnessSection from "../FitnessSection/FitnessSection";
import { FITNESS_GOALS } from "../../../../assets/data/fitnessData";
import styles from "./FitnessGoals.module.css";

const GoalCard = ({ goal, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() => navigate(`/discover?goal=${goal.query}`)}
      role="button"
      tabIndex={0}
      aria-label={`Find fitness for goal: ${goal.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/discover?goal=${goal.query}`);
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
      <span className={styles.icon} aria-hidden="true">
        {goal.icon}
      </span>
      <h3 className={styles.title}>{goal.title}</h3>
      <p className={styles.description}>{goal.description}</p>
      <span className={styles.cta}>Find Options →</span>

      {/* Hover glow */}
      <div className={styles.glow} aria-hidden="true" />
    </motion.article>
  );
};

const FitnessGoals = () => (
  <FitnessSection
    id="fitness-goals"
    label="PERSONALISED FITNESS"
    title="Find Fitness Based on"
    titleAccent="Your Goal"
    subtitle="Tell us what you want to achieve and we'll surface the best options for you."
  >
    <div className={styles.grid} role="list" aria-label="Fitness goals">
      {FITNESS_GOALS.map((goal, index) => (
        <div key={goal.id} role="listitem">
          <GoalCard goal={goal} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default FitnessGoals;
