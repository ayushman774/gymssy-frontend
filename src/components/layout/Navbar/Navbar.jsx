import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import NavCTA from "./NavCTA";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";
import styles from "./Navbar.module.css";

// ── Navigation data ───────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Membership", href: "/membership" },
  { label: "Trainers", href: "/trainers" },
  { label: "Gyms Near you", href: "/gyms-near-you" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

// ── Scroll threshold before glass effect triggers ─────────────────────────
const SCROLL_THRESHOLD = 60;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const lastScrollY = useRef(0);
  const scrollDirRef = useRef("up");
  const location = useLocation();
  const { scrollY } = useScroll();

  // ── Sync active link with route ─────────────────────────────────────────
  useEffect(() => {
    setActiveLink(location.pathname);
    // Close mobile menu on route change
    setMobileOpen(false);
  }, [location.pathname]);

  // ── Lock body scroll when mobile menu open ──────────────────────────────
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Scroll behaviour: glass + hide on scroll down ───────────────────────
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const direction = latest > previous ? "down" : "up";

    // Glassmorphism threshold
    setIsScrolled(latest > SCROLL_THRESHOLD);

    // Hide navbar when scrolling DOWN past threshold
    // Show immediately when scrolling UP
    if (direction === "down" && latest > 300 && !mobileOpen) {
      if (scrollDirRef.current !== "down") {
        setIsHidden(true);
        scrollDirRef.current = "down";
      }
    } else if (direction === "up") {
      if (scrollDirRef.current !== "up") {
        setIsHidden(false);
        scrollDirRef.current = "up";
      }
    }

    lastScrollY.current = latest;
  });

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // ── Framer Motion variants ──────────────────────────────────────────────
  const navVariants = {
    visible: {
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hidden: {
      y: "-100%",
      transition: {
        duration: 0.35,
        ease: [0.55, 0, 1, 0.45],
      },
    },
  };

  return (
    <>
      <motion.header
        className={`
          ${styles.navbar}
          ${isScrolled ? styles.scrolled : styles.transparent}
        `}
        variants={navVariants}
        animate={isHidden ? "hidden" : "visible"}
        initial="visible"
        role="banner"
      >
        {/* ── INNER LAYOUT ────────────────────────────── */}
        <div className={styles.inner}>
          {/* Logo */}
          <NavLogo onClick={closeMobile} />

          {/* Desktop nav links */}
          <nav
            className={styles.desktopNav}
            role="navigation"
            aria-label="Primary navigation"
          >
            <NavLinks links={NAV_LINKS} activeLink={activeLink} />
          </nav>

          {/* Desktop CTA */}
          <div className={styles.desktopCTA}>
            <NavCTA />
          </div>

          {/* Hamburger (mobile only) */}
          <HamburgerButton isOpen={mobileOpen} onClick={toggleMobile} />
        </div>

        {/* ── GLASSMORPHISM BORDER LINE ──────────────── */}
        <motion.div
          className={styles.borderLine}
          animate={{
            opacity: isScrolled ? 1 : 0,
            scaleX: isScrolled ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-hidden="true"
        />
      </motion.header>

      {/* ── MOBILE MENU (portal-style, outside header) ── */}
      <MobileMenu
        isOpen={mobileOpen}
        links={NAV_LINKS}
        activeLink={activeLink}
        onClose={closeMobile}
      />
    </>
  );
};

export default Navbar;