import { motion } from "framer-motion";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import CityCard from "../../../ui/CityCard/CityCard";
import { SkeletonRow } from "../../../ui/SkeletonCard/SkeletonCard";
import styles from "./SportsCities.module.css";

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

const SportsCities = ({ cities, loading }) => (
  <section className={styles.section} aria-label="Popular cities for sports">
    <div className={styles.inner}>
      <div className={styles.header}>
        <SectionLabel text="CITIES" />
        <h2 className={styles.title}>
          Popular Cities <span className={styles.titleAccent}>for Sports</span>
        </h2>
        <p className={styles.subtitle}>
          Discover sports academies, coaches and facilities in your city
        </p>
      </div>

      {loading.cities ? (
        <SkeletonRow count={6} variant="city" />
      ) : (
        <motion.div
          className={styles.grid}
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          role="list"
          aria-label="Popular cities for sports"
        >
          {cities.map((city, index) => (
            <motion.div key={city.id} variants={ITEM} role="listitem">
              <CityCard city={city} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  </section>
);

export default SportsCities;
