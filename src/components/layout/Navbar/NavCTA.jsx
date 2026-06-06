import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NavCTA.module.css";

const ctaVariants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const NavCTA = ({ onClick, label = "Join Now", href = "/membership" }) => {
  return (
    <motion.div
      variants={ctaVariants}
      initial="initial"
      animate="animate"
      className={styles.ctaWrapper}
    >
      <Link
        to={href}
        className={styles.cta}
        onClick={onClick}
        aria-label="Join Gymsssy Fitness — Sign up now"
      >
        {/* Button text */}
        <span className={styles.ctaText}>{label}</span>

        {/* Animated neon border */}
        <span className={styles.ctaBorder} aria-hidden="true" />

        {/* Glow layer */}
        <span className={styles.ctaGlow} aria-hidden="true" />

        {/* Shimmer sweep on hover */}
        <span className={styles.ctaShimmer} aria-hidden="true" />
      </Link>
    </motion.div>
  );
};

export default NavCTA;
