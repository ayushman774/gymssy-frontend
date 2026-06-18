import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiFacebook,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiArrowUpRight,
  FiArrowRight,
} from "react-icons/fi";
import MagneticButton from "../../ui/MagneticButton/MagneticButton";
import { useCursorVariant } from "../../../hooks/useCursorVariant";
import styles from "./Footer.module.css";

// ─── Data ────────────────────────────────────────────────────────────
const quickLinks = [
  { label: "Home",       href: "/"         },
  { label: "About",      href: "/about"    },
  { label: "Programs",   href: "/programs" },
  { label: "Membership", href: "/pricing"  },
  { label: "Trainers",   href: "/trainers" },
  { label: "Gallery",    href: "/#gallery" },
  { label: "Contact",    href: "/contact"  },
];

const programs = [
  { label: "Strength Training",   href: "/programs" },
  { label: "Personal Training",   href: "/programs" },
  { label: "Weight Loss",         href: "/programs" },
  { label: "Functional Fitness",  href: "/programs" },
  { label: "Cardio Training",     href: "/programs" },
  { label: "Nutrition Coaching",  href: "/programs" },
];

const socialLinks = [
  {
    icon:  <FiInstagram />,
    label: "Instagram",
    href:  "https://instagram.com",
    color: "instagram",
  },
  {
    icon:  <FiFacebook />,
    label: "Facebook",
    href:  "https://facebook.com",
    color: "facebook",
  },
  {
    icon:  <FiYoutube />,
    label: "YouTube",
    href:  "https://youtube.com",
    color: "youtube",
  },
  {
    icon:  <FiLinkedin />,
    label: "LinkedIn",
    href:  "https://linkedin.com",
    color: "linkedin",
  },
];

const contactInfo = [
  {
    icon:  <FiPhone />,
    label: "Phone",
    value: "+91  8982295593",
    href:  "tel:+15550000000",
  },
  {
    icon:  <FiMail />,
    label: "Email",
    value: "Contact@gymssy.com",
    href:  "mailto:Contact@gymssy.com",
  },
  {
    icon:  <FiMapPin />,
    label: "Address",
    value: "Bhopal, Madhya Pradesh, India",
    href:  "https://maps.google.com",
  },
];

const legalLinks = [
  { label: "Privacy Policy",    href: "/privacy"  },
  { label: "Terms & Conditions", href: "/terms"   },
];

// ─── Animation Variants ───────────────────────────────────────────────
const containerVariants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren:   0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y:       50,
  },
  visible: {
    opacity: 1,
    y:       0,
    transition: {
      duration: 0.8,
      ease:     [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const ctaHeadlineVariants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const ctaWordVariants = {
  hidden: {
    opacity: 0,
    y:       80,
    rotateX: -45,
  },
  visible: {
    opacity:  1,
    y:        0,
    rotateX:  0,
    transition: {
      duration: 0.7,
      ease:     [0.16, 1, 0.3, 1],
    },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────

/** Animated footer link with underline reveal */
const FooterLink = ({ href, children, external = false }) => {
  const { setCursor, resetCursor } = useCursorVariant();
  const isExternal = external || href?.startsWith("http");

  const content = (
    <span className={styles.linkInner}>
      <span className={styles.linkText}>{children}</span>
      <span className={styles.linkUnderline} aria-hidden="true" />
      {isExternal && (
        <FiArrowUpRight className={styles.linkExternalIcon} aria-hidden="true" />
      )}
    </span>
  );

  const sharedProps = {
    className:    styles.link,
    onMouseEnter: () => setCursor("hover"),
    onMouseLeave: resetCursor,
  };

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${children} (opens in new tab)`}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} {...sharedProps}>
      {content}
    </Link>
  );
};

/** Social icon button with magnetic + glow */
const SocialBtn = ({ icon, label, href, color }) => {
  const { setCursor, resetCursor } = useCursorVariant();

  return (
    <MagneticButton strength={0.5}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`${styles.socialBtn} ${styles[`social--${color}`]}`}
        onMouseEnter={() => setCursor("hover")}
        onMouseLeave={resetCursor}
        whileHover={{ scale: 1.1 }}
        whileTap={{  scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <span className={styles.socialIcon}>{icon}</span>
        <span className={styles.socialGlow} aria-hidden="true" />
      </motion.a>
    </MagneticButton>
  );
};

/** Contact info row */
const ContactRow = ({ icon, label, value, href }) => {
  const { setCursor, resetCursor } = useCursorVariant();

  return (
    <a
      href={href}
      className={styles.contactRow}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={`${label}: ${value}`}
      onMouseEnter={() => setCursor("hover")}
      onMouseLeave={resetCursor}
    >
      <span className={styles.contactIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.contactValue}>{value}</span>
    </a>
  );
};

// ─── CTA Section ─────────────────────────────────────────────────────
const FooterCTA = () => {
  const ctaRef   = useRef(null);
  const isInView = useInView(ctaRef, { once: true, margin: "-15%" });
  const { setCursor, resetCursor } = useCursorVariant();

  const headline = "READY TO TRANSFORM YOUR LIFE?";
  const words    = headline.split(" ");

  return (
    <section
      ref={ctaRef}
      className={styles.cta}
      aria-labelledby="footer-cta-heading"
    >
      {/* Background layers */}
      <div className={styles.ctaBg}         aria-hidden="true" />
      <div className={styles.ctaGlow}       aria-hidden="true" />
      <div className={styles.ctaGridLines}  aria-hidden="true" />
      <div className={styles.ctaNoise}      aria-hidden="true" />

      {/* Animated orb */}
      <motion.div
        className={styles.ctaOrb}
        aria-hidden="true"
        animate={{
          scale:   [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 5,
          repeat:   Infinity,
          ease:     "easeInOut",
        }}
      />

      <div className={styles.ctaContainer}>
        {/* Overline */}
        <motion.div
          className={styles.ctaOverline}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.ctaOverlineLine} aria-hidden="true" />
          <span>Begin Your Journey</span>
          <span className={styles.ctaOverlineLine} aria-hidden="true" />
        </motion.div>

        {/* Headline — word by word */}
        <motion.h2
          id="footer-cta-heading"
          className={styles.ctaHeadline}
          variants={ctaHeadlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          aria-label={headline}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className={styles.ctaWordWrapper}
              aria-hidden="true"
            >
              <motion.span
                className={`${styles.ctaWord} ${
                  word === "TRANSFORM" ? styles.ctaWordAccent : ""
                }`}
                variants={ctaWordVariants}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className={styles.ctaSubheadline}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Join the community that trains harder, grows stronger,
          and achieves more.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className={styles.ctaButtons}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {/* Primary CTA */}
          <MagneticButton strength={0.4}>
            <motion.button
              className={styles.ctaBtnPrimary}
              onMouseEnter={() => setCursor("hover")}
              onMouseLeave={resetCursor}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.ctaBtnLabel}>Join Now</span>
              <FiArrowRight className={styles.ctaBtnIcon} aria-hidden="true" />
              <span className={styles.ctaBtnShimmer} aria-hidden="true" />
            </motion.button>
          </MagneticButton>

          {/* Secondary CTA */}
          <MagneticButton strength={0.4}>
            <motion.button
              className={styles.ctaBtnSecondary}
              onMouseEnter={() => setCursor("hover")}
              onMouseLeave={resetCursor}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.ctaBtnLabel}>Book Free Trial</span>
              <FiArrowUpRight
                className={styles.ctaBtnIcon}
                aria-hidden="true"
              />
            </motion.button>
          </MagneticButton>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className={styles.ctaTrust}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {["10,000+ Members", "15 Years Excellence", "98% Retention Rate"].map(
            (badge) => (
              <span key={badge} className={styles.ctaTrustBadge}>
                <span className={styles.ctaTrustDot} aria-hidden="true" />
                {badge}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Main Footer ──────────────────────────────────────────────────────
const Footer = () => {
  const footerRef = useRef(null);
  const isInView  = useInView(footerRef, { once: true, margin: "-10%" });

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className={styles.footer} role="contentinfo">
      {/* ── CTA Section ── */}
      <FooterCTA />

      {/* ── Animated Divider ── */}
      <div className={styles.dividerWrapper} aria-hidden="true">
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className={styles.dividerGlow}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* ── Footer Body ── */}
      <div className={styles.body}>
        {/* Background effects */}
        <div className={styles.bodyBg}    aria-hidden="true" />
        <div className={styles.bodyNoise} aria-hidden="true" />

        <div className={styles.bodyContainer}>
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* ── Column 1 — Brand ── */}
            <motion.div
              className={`${styles.col} ${styles.colBrand}`}
              variants={fadeUpVariants}
            >
              {/* Logo */}
              <Link
                to="/"
                className={styles.logo}
                aria-label="Gymsssy Fitness — Home"
              >
                <span className={styles.logoText}>Gymsssy</span>
                <span className={styles.logoSub}>FITNESS</span>
              </Link>

              {/* Description */}
              <p className={styles.brandDesc}>
                A premium fitness destination dedicated to helping
                members build strength, confidence, and discipline.
                Where champions are forged.
              </p>

              {/* Social icons */}
              <div className={styles.socials} role="list">
                {socialLinks.map((s) => (
                  <div key={s.label} role="listitem">
                    <SocialBtn {...s} />
                  </div>
                ))}
              </div>

              {/* Tagline */}
              <p className={styles.tagline}>
                <span className={styles.taglineDot} aria-hidden="true" />
                Forging Champions Since 2009
              </p>
            </motion.div>

            {/* ── Column 2 — Quick Links ── */}
            <motion.div
              className={styles.col}
              variants={fadeUpVariants}
            >
              <h3 className={styles.colHeading}>Quick Links</h3>
              <nav aria-label="Footer quick links">
                <ul className={styles.linkList} role="list">
                  {quickLinks.map((link) => (
                    <li key={link.label} role="listitem">
                      <FooterLink href={link.href}>
                        {link.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* ── Column 3 — Programs ── */}
            <motion.div
              className={styles.col}
              variants={fadeUpVariants}
            >
              <h3 className={styles.colHeading}>Programs</h3>
              <nav aria-label="Footer programs">
                <ul className={styles.linkList} role="list">
                  {programs.map((prog) => (
                    <li key={prog.label} role="listitem">
                      <FooterLink href={prog.href}>
                        {prog.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* ── Column 4 — Contact ── */}
            <motion.div
              className={styles.col}
              variants={fadeUpVariants}
            >
              <h3 className={styles.colHeading}>Get In Touch</h3>

              {/* Contact rows */}
              <div className={styles.contactList}>
                {contactInfo.map((info) => (
                  <ContactRow key={info.label} {...info} />
                ))}
              </div>

              {/* Hours */}
              <div className={styles.hours}>
                <div className={styles.hoursHeader}>
                  <FiClock
                    className={styles.hoursIcon}
                    aria-hidden="true"
                  />
                  <span className={styles.hoursTitle}>Working Hours</span>
                </div>
                <div className={styles.hoursGrid}>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Mon – Sat</span>
                    <span className={styles.hoursTime}>
                      5:00 AM – 11:00 PM
                    </span>
                  </div>
                  <div className={styles.hoursRow}>
                    <span className={styles.hoursDay}>Sunday</span>
                    <span className={styles.hoursTime}>
                      6:00 AM – 8:00 PM
                    </span>
                  </div>
                </div>

                {/* Live indicator */}
                <div className={styles.liveIndicator} aria-live="polite">
                  <span className={styles.liveDot} aria-hidden="true" />
                  <span className={styles.liveText}>Open Now</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <motion.div
        className={styles.bottomBar}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className={styles.bottomContainer}>
          {/* Left — Copyright */}
          <p className={styles.copyright}>
            © {currentYear}{" "}
            <span className={styles.copyrightBrand}>Gymsssy FITNESS</span>
            . All rights reserved.
          </p>

          {/* Center — Designed for Excellence */}
          <p className={styles.designedFor} aria-label="Designed for Excellence">
            Designed for{" "}
            <span className={styles.designedForAccent}>Excellence</span>
          </p>

          {/* Right — Legal links */}
          <nav
            className={styles.legalLinks}
            aria-label="Legal links"
          >
            {legalLinks.map((link, i) => (
              <span key={link.label} className={styles.legalItem}>
                {i > 0 && (
                  <span
                    className={styles.legalSep}
                    aria-hidden="true"
                  />
                )}
                <Link
                  to={link.href}
                  className={styles.legalLink}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;