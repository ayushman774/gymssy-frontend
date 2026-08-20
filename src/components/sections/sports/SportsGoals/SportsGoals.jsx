import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { SPORTS_GOALS } from "../../../../assets/data/sportsData";
import styles from "./SportsGoals.module.css";

const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const SportsGoals = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-label="Find sports by goal">
      <div className={styles.inner}>
        <div className={styles.header}>
          <SectionLabel text="GOALS" />
          <h2 className={styles.title}>
            Find Sports Based on{" "}
            <span className={styles.titleAccent}>Your Goal</span>
          </h2>
          <p className={styles.subtitle}>
            Whatever you're training for, Gymssy helps you find the right sport
          </p>
        </div>

        <motion.div
          className={styles.grid}
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          role="list"
          aria-label="Sports goals"
        >
          {SPORTS_GOALS.map((goal) => (
            <motion.button
              key={goal.id}
              className={styles.goalCard}
              variants={ITEM}
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(`/discover?goal=${goal.query}&type=sports`)
              }
              role="listitem"
              aria-label={`${goal.title} — ${goal.description}`}
            >
              <span className={styles.goalIcon} aria-hidden="true">
                {goal.icon}
              </span>
              <div className={styles.goalText}>
                <span className={styles.goalTitle}>{goal.title}</span>
                <span className={styles.goalDesc}>{goal.description}</span>
              </div>
              <FiArrowRight className={styles.goalArrow} aria-hidden="true" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SportsGoals;
