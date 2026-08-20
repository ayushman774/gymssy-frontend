import { motion } from "framer-motion";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { SPORTS_BENEFITS } from "../../../../assets/data/sportsData";
import styles from "./SportsBenefits.module.css";

const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const SportsBenefits = () => (
  <section
    className={styles.section}
    aria-label="Why discover sports on Gymssy"
  >
    <div className={styles.inner}>
      <div className={styles.header}>
        <SectionLabel text="WHY GYMSSY" />
        <h2 className={styles.title}>
          Why Discover Sports{" "}
          <span className={styles.titleAccent}>on Gymssy?</span>
        </h2>
        <p className={styles.subtitle}>
          Everything you need to find the right sport, coach or facility
        </p>
      </div>

      <motion.div
        className={styles.grid}
        variants={CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
        role="list"
        aria-label="Gymssy sports benefits"
      >
        {SPORTS_BENEFITS.map((b) => (
          <motion.div
            key={b.id}
            className={styles.benefitCard}
            variants={ITEM}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
            role="listitem"
          >
            <div className={styles.iconWrap} aria-hidden="true">
              <span className={styles.icon}>{b.icon}</span>
            </div>
            <h3 className={styles.benefitTitle}>{b.title}</h3>
            <p className={styles.benefitDesc}>{b.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SportsBenefits;
