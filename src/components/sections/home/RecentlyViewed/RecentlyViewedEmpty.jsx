import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCompass } from "react-icons/fi";
import styles from "./RecentlyViewed.module.css";

const RecentlyViewedEmpty = () => {
  return (
    <motion.div
      className={styles.emptyState}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <motion.div
        className={styles.emptyIconWrapper}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "backOut" }}
        aria-hidden="true"
      >
        <div className={styles.emptyIconRing} />
        <div className={styles.emptyIconGlow} />
        <FiCompass className={styles.emptyIcon} />
      </motion.div>

      {/* Copy */}
      <motion.h3
        className={styles.emptyHeading}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        Start Exploring
      </motion.h3>

      <motion.p
        className={styles.emptyBody}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.32 }}
      >
        Browse gyms, yoga studios, trainers, swimming academies and more.
        <br />
        We&apos;ll keep your recently viewed places here.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link to="/discover" className={styles.emptyBtn}>
          <FiCompass className={styles.emptyBtnIcon} aria-hidden="true" />
          Explore Gyms
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default RecentlyViewedEmpty;
