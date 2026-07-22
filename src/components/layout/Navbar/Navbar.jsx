import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import NavLogo from "./NavLogo";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";
import styles from "./Navbar.module.css";

// ── Navigation data ───────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home",           href: "/"            },
  { label: "Discover",       href: "/discover"     },
  { label: "Partner With Us",href: "/partner-with-us"    },
  { label: "About",          href: "/about"       },
];

const SCROLL_THRESHOLD = 60;

const Navbar = () => {
  const [isScrolled,  setIsScrolled]  = useState(false);
  const [isHidden,    setIsHidden]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [activeLink,  setActiveLink]  = useState("/");

  const lastScrollY   = useRef(0);
  const scrollDirRef  = useRef("up");
  const location      = useLocation();
  const { scrollY }   = useScroll();

  // ── Sync active link with route ─────────────────────────────────────────
  useEffect(() => {
    setActiveLink(location.pathname);
    setMobileOpen(false);
  }, [location.pathname]);

  // ── Lock body scroll when mobile menu open ──────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Scroll behaviour ────────────────────────────────────────────────────
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous  = lastScrollY.current;
    const direction = latest > previous ? "down" : "up";

    setIsScrolled(latest > SCROLL_THRESHOLD);

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

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile  = useCallback(() => setMobileOpen(false),      []);

  const navVariants = {
    visible: { y: 0,      transition: { duration: 0.4,  ease: [0.25, 0.46, 0.45, 0.94] } },
    hidden:  { y: "-100%",transition: { duration: 0.35, ease: [0.55, 0,    1,    0.45]  } },
  };

  return (
    <>
      <motion.header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : styles.transparent}`}
        variants={navVariants}
        animate={isHidden ? "hidden" : "visible"}
        initial="visible"
        role="banner"
      >
        <div className={styles.inner}>

          {/* Logo */}
          <NavLogo onClick={closeMobile} />

          {/* Desktop nav links */}
          <nav
            className={styles.desktopNav}
            role="navigation"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${styles.navLink} ${
                  activeLink === link.href ? styles.navLinkActive : ""
                }`}
              >
                {link.label}
                {activeLink === link.href && (
                  <span className={styles.activeDot} aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div className={styles.desktopCTA}>
            <a href="/login"    className={styles.btnOutline}>Log In</a>
            <Link to="/sign-up" className={styles.btnFilled}>
              Get Started
              <span className={styles.btnFilledShimmer} aria-hidden="true" />
            </Link>
          </div>

          {/* Hamburger (mobile only) */}
          <HamburgerButton isOpen={mobileOpen} onClick={toggleMobile} />
        </div>

        {/* Glassmorphism border line */}
        <motion.div
          className={styles.borderLine}
          animate={{ opacity: isScrolled ? 1 : 0, scaleX: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-hidden="true"
        />
      </motion.header>

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