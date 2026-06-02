import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NavLogo.module.css";

const logoVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const letterVariants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const NavLogo = ({ onClick }) => {
  return (
    <motion.div
      variants={logoVariants}
      initial="initial"
      animate="animate"
      className={styles.logoWrapper}
    >
      <Link
        to="/"
        className={styles.logo}
        onClick={onClick}
        aria-label="Apex Fitness — Home"
      >
        {/* ── ICON MARK ─────────────────────────────── */}
        <motion.div
          className={styles.logoMark}
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoSvg}
          >
            {/* Outer hexagon */}
            <path
              d="M16 2L28.7 9.5V24.5L16 32L3.3 24.5V9.5L16 2Z"
              stroke="#39FF14"
              strokeWidth="1.5"
              fill="none"
              className={styles.hexOuter}
            />
            {/* Inner A shape */}
            <path
              d="M16 8L22 22H18.5L16 16L13.5 22H10L16 8Z"
              fill="#39FF14"
              className={styles.letterA}
            />
            {/* Crossbar of A */}
            <path
              d="M12.5 18.5H19.5"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* ── WORDMARK ──────────────────────────────── */}
        <motion.div
          className={styles.wordmark}
          whileHover="hover"
          initial="initial"
        >
          <span className={styles.wordmarkPrimary}>
            {"APEX".split("").map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                transition={{ delay: i * 0.04 }}
                className={styles.wordmarkChar}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className={styles.wordmarkSecondary}>FITNESS</span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default NavLogo;
