import { motion } from "framer-motion";
import FitnessSection from "../FitnessSection/FitnessSection";
import { FITNESS_BENEFITS } from "../../../../assets/data/fitnessData";
import styles from "./FitnessBenefits.module.css";

const BenefitCard = ({ benefit, index }) => (
  <motion.div
    className={styles.card}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-4%" }}
    transition={{
      duration: 0.55,
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    <div className={styles.iconWrap} aria-hidden="true">
      <span className={styles.icon}>{benefit.icon}</span>
    </div>
    <h3 className={styles.title}>{benefit.title}</h3>
    <p className={styles.description}>{benefit.description}</p>
  </motion.div>
);

const FitnessBenefits = () => (
  <FitnessSection
    id="fitness-benefits"
    label="WHY GYMSSY"
    title="Why Find Fitness"
    titleAccent="on Gymssy?"
    subtitle="Gymssy is India's most trusted fitness marketplace."
  >
    <div className={styles.grid} role="list" aria-label="Gymssy benefits">
      {FITNESS_BENEFITS.map((b, i) => (
        <div key={b.id} role="listitem">
          <BenefitCard benefit={b} index={i} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default FitnessBenefits;
