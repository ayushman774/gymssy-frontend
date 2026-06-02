import { motion } from "framer-motion";
import styles from "./HamburgerButton.module.css";

const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <motion.button
      className={`${styles.button} ${isOpen ? styles.buttonOpen : ""}`}
      onClick={onClick}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Three lines that morph to X */}
      <span className={styles.linesWrapper} aria-hidden="true">
        {/* Top line */}
        <motion.span
          className={styles.line}
          animate={
            isOpen
              ? { rotate: 45, y: 7, width: "100%" }
              : { rotate: 0, y: 0, width: "100%" }
          }
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Middle line */}
        <motion.span
          className={styles.line}
          animate={
            isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />

        {/* Bottom line */}
        <motion.span
          className={styles.line}
          animate={
            isOpen
              ? { rotate: -45, y: -7, width: "100%" }
              : { rotate: 0, y: 0, width: "75%" }
          }
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />
      </span>
    </motion.button>
  );
};

export default HamburgerButton;
