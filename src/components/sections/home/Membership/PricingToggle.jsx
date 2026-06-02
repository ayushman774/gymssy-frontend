import { motion } from "framer-motion";
import styles from "./PricingToggle.module.css";

const PricingToggle = ({ isAnnual, onToggle }) => {
  return (
    <div className={styles.toggleWrapper}>
      {/* Monthly label */}
      <span
        className={`
          ${styles.label}
          ${!isAnnual ? styles.labelActive : ""}
        `}
        aria-hidden="true"
      >
        Monthly
      </span>

      {/* Toggle switch */}
      <button
        className={styles.toggle}
        onClick={onToggle}
        role="switch"
        aria-checked={isAnnual}
        aria-label={`Switch to ${isAnnual ? "monthly" : "annual"} billing`}
      >
        <motion.div
          className={styles.thumb}
          animate={{ x: isAnnual ? 24 : 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
        {/* Track glow */}
        <span
          className={styles.trackGlow}
          style={{ opacity: isAnnual ? 1 : 0 }}
          aria-hidden="true"
        />
      </button>

      {/* Annual label + savings badge */}
      <div className={styles.annualGroup}>
        <span
          className={`
            ${styles.label}
            ${isAnnual ? styles.labelActive : ""}
          `}
          aria-hidden="true"
        >
          Annual
        </span>

        {/* Savings badge */}
        <motion.span
          className={styles.savingsBadge}
          animate={{
            opacity: isAnnual ? 1 : 0.4,
            scale: isAnnual ? 1 : 0.9,
          }}
          transition={{ duration: 0.3 }}
          aria-label="Save up to 20% with annual billing"
        >
          Save 20%
        </motion.span>
      </div>
    </div>
  );
};

export default PricingToggle;
