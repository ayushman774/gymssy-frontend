/* ══════════════════════════════════════════════════════
   SportsForKids
   No age data from backend — shows sport + description only.
   Age fields will display when backend adds age_group support.
══════════════════════════════════════════════════════ */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { SPORTS_FOR_KIDS } from "../../../../assets/data/sportsData";
import styles from "./SportsForKids.module.css";

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

const SportsForKids = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-label="Sports for kids">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <SectionLabel text="KIDS" />
          <h2 className={styles.title}>
            Sports for <span className={styles.titleAccent}>Kids</span>
          </h2>
          <p className={styles.subtitle}>
            Help kids discover sports, build confidence and stay active
          </p>
        </div>

        {/* Cards */}
        <motion.div
          className={styles.grid}
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          role="list"
          aria-label="Sports for kids"
        >
          {SPORTS_FOR_KIDS.map((sport) => (
            <motion.button
              key={sport.id}
              className={styles.card}
              variants={ITEM}
              whileHover={{ y: -4, transition: { duration: 0.22 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(`/discover?sport=${sport.slug}&audience=kids`)
              }
              role="listitem"
              aria-label={`${sport.title} for kids — ${sport.description}`}
            >
              <span className={styles.cardIcon} aria-hidden="true">
                {sport.icon}
              </span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{sport.title}</h3>
                <p className={styles.cardDesc}>{sport.description}</p>
              </div>
              <span className={styles.cardArrow} aria-hidden="true">
                <FiArrowRight />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SportsForKids;
