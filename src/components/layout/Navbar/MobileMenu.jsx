import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import NavCTA from "./NavCTA";
import styles from "./MobileMenu.module.css";

// ── Animation variants ────────────────────────────────────────────────────

const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const menuVariants = {
  hidden: {
    x: "100%",
    transition: {
      duration: 0.45,
      ease: [0.55, 0, 1, 0.45],
    },
  },
  visible: {
    x: "0%",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const reducedMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const linkItemVariants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const dividerVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ── Social links ──────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: "IG" },
  { label: "Twitter", href: "#", icon: "TW" },
  { label: "YouTube", href: "#", icon: "YT" },
  { label: "Facebook", href: "#", icon: "FB" },
];

// ── MobileMenu ────────────────────────────────────────────────────────────
const MobileMenu = ({ isOpen, links, activeLink, onClose }) => {
  const prefersReduced = useReducedMotion();
  const firstLinkRef = useRef(null);

  // Focus first link when menu opens (accessibility)
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      setTimeout(() => firstLinkRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const chosenMenuVariants = prefersReduced
    ? reducedMenuVariants
    : menuVariants;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* ── BACKDROP ──────────────────────────────── */}
          <motion.div
            className={styles.backdrop}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── MENU PANEL ────────────────────────────── */}
          <motion.nav
            id="mobile-menu"
            className={styles.menu}
            variants={chosenMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* ── INNER CONTENT ─────────────────────── */}
            <div className={styles.menuInner}>
              {/* ── HEADER ────────────────────────────── */}
              <div className={styles.menuHeader}>
                <span className={styles.menuLabel}>Navigation</span>
              </div>

              {/* ── DIVIDER ───────────────────────────── */}
              <motion.div
                className={styles.divider}
                variants={dividerVariants}
                aria-hidden="true"
              />

              {/* ── NAV LINKS ─────────────────────────── */}
              <ul className={styles.linksList} role="list">
                {links.map((link, index) => {
                  const isActive = activeLink === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      variants={linkItemVariants}
                      className={styles.linkItem}
                    >
                      <Link
                        to={link.href}
                        ref={index === 0 ? firstLinkRef : null}
                        className={`
                          ${styles.link}
                          ${isActive ? styles.linkActive : ""}
                        `}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {/* Index number */}
                        <span className={styles.linkIndex}>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Label */}
                        <span className={styles.linkLabel}>{link.label}</span>

                        {/* Arrow */}
                        <span className={styles.linkArrow} aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* ── DIVIDER ───────────────────────────── */}
              <motion.div
                className={styles.divider}
                variants={dividerVariants}
                aria-hidden="true"
              />

              {/* ── CTA ───────────────────────────────── */}
              <motion.div
                className={styles.ctaWrapper}
                variants={linkItemVariants}
              >
                <NavCTA
                  onClick={onClose}
                  label="Join Now — Start Today"
                  href="/membership"
                />
              </motion.div>

              {/* ── FOOTER ROW ────────────────────────── */}
              <motion.div
                className={styles.menuFooter}
                variants={linkItemVariants}
              >
                {/* Tagline */}
                <p className={styles.tagline}>Forge your legacy.</p>

                {/* Social links */}
                <div className={styles.socialLinks}>
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className={styles.socialLink}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── NEON ACCENT LINE ──────────────────── */}
            <div className={styles.accentLine} aria-hidden="true" />
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
