import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FitnessSection from "../../fitness/FitnessSection/FitnessSection";
import { RECOVERY_ITEMS } from "../../../../assets/data/wellnessData";
import styles from "./WellnessRecovery.module.css";

const RecoveryCard = ({ item, index }) => {
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
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
    >
      <div className={styles.left}>
        <span className={styles.icon} aria-hidden="true">
          {item.icon}
        </span>
      </div>

      <div className={styles.right}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
        <span className={styles.count}>{item.count} options</span>
      </div>

      <div className={styles.arrow} aria-hidden="true">
        →
      </div>
    </motion.article>
  );
};

const WellnessRecovery = () => (
  <FitnessSection
    id="wellness-recovery"
    label="RECOVER SMARTER"
    title="Recovery &"
    titleAccent="Mobility"
    subtitle="Recover smarter, move better and reduce pain with structured recovery programs."
    viewAllHref="/wellness/recovery"
    viewAllText="View All"
    neonColor="#39ff14"
  >
    <div
      className={styles.grid}
      role="list"
      aria-label="Recovery and mobility services"
    >
      {RECOVERY_ITEMS.map((item, index) => (
        <div key={item.id} role="listitem">
          <RecoveryCard item={item} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default WellnessRecovery;
