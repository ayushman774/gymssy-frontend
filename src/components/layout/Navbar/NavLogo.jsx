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
        aria-label="Gymssy — Home"
      >
        {/* ── LOGO IMAGE ────────────────────────────── */}
        <motion.div
          className={styles.logoMark}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <img
            src="/images/logo/gymssy-logo.jpeg"
            alt="Gymssy logo"
            className={styles.logoImage}
            width={36}
            height={36}
          />
        </motion.div>

        {/* ── WORDMARK ──────────────────────────────── */}
        <motion.div
          className={styles.wordmark}
          whileHover="hover"
          initial="initial"
        >
          <span className={styles.wordmarkPrimary}>
            {"GYMSSY".split("").map((char, i) => (
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