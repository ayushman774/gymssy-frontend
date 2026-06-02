import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NavLinks.module.css";

// ── Container variants (stagger children on mount) ────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

// ── Individual link variants ──────────────────────────────────────────────
const linkVariants = {
  hidden: {
    opacity: 0,
    y: -12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ── Single NavLink ────────────────────────────────────────────────────────
const NavLink = ({ link, isActive }) => {
  return (
    <motion.li variants={linkVariants} className={styles.linkItem}>
      <Link
        to={link.href}
        className={`
          ${styles.link}
          ${isActive ? styles.linkActive : ""}
        `}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Link text */}
        <span className={styles.linkText}>{link.label}</span>

        {/* Neon underline (slides in on hover / active) */}
        <span className={styles.linkUnderline} aria-hidden="true" />

        {/* Active dot indicator */}
        {isActive && (
          <motion.span
            className={styles.activeDot}
            layoutId="activeNavDot"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
            aria-hidden="true"
          />
        )}
      </Link>
    </motion.li>
  );
};

// ── NavLinks list ─────────────────────────────────────────────────────────
const NavLinks = ({ links, activeLink }) => {
  return (
    <motion.ul
      className={styles.linksList}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="list"
    >
      {links.map((link) => (
        <NavLink
          key={link.href}
          link={link}
          isActive={activeLink === link.href}
        />
      ))}
    </motion.ul>
  );
};

export default NavLinks;
