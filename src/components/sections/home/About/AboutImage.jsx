import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./AboutImage.module.css";

gsap.registerPlugin(ScrollTrigger);

// Images from centralized config
const PRIMARY_IMAGE = {
  src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85&fit=crop&auto=format",
  alt: "Premium Apex Fitness gym interior with state-of-the-art equipment",
};

const SECONDARY_IMAGE = {
  src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=85&fit=crop&auto=format",
  alt: "Elite athlete training at Apex Fitness",
};

const ACCENT_IMAGE = {
  src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=85&fit=crop&auto=format",
  alt: "Intense training session at Apex Fitness facility",
};

const AboutImage = ({ isInView }) => {
  const containerRef = useRef(null);
  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);
  const parallaxRef = useRef(null);

  // GSAP parallax on primary image
  useEffect(() => {
    if (!parallaxRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.imageContainer}>
      {/* ── PRIMARY IMAGE (large) ─────────────────────── */}
      <motion.div
        ref={primaryRef}
        className={styles.primaryWrapper}
        initial={{ opacity: 0, x: -60, rotate: -2 }}
        animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
        transition={{
          duration: 0.9,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Image with parallax inner */}
        <div className={styles.primaryImageClip}>
          <div ref={parallaxRef} className={styles.parallaxInner}>
            <img
              src={PRIMARY_IMAGE.src}
              alt={PRIMARY_IMAGE.alt}
              className={styles.primaryImage}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Dark overlay */}
          <div className={styles.imageOverlay} aria-hidden="true" />

          {/* Neon corner accents */}
          <div
            className={`${styles.cornerAccent} ${styles.cornerTL}`}
            aria-hidden="true"
          />
          <div
            className={`${styles.cornerAccent} ${styles.cornerBR}`}
            aria-hidden="true"
          />
        </div>

        {/* ── EXPERIENCE BADGE ────────────────────────── */}
        <motion.div
          className={styles.experienceBadge}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.7,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <span className={styles.badgeNumber}>10+</span>
          <span className={styles.badgeLabel}>
            Years of
            <br />
            Excellence
          </span>
        </motion.div>
      </motion.div>

      {/* ── SECONDARY IMAGE (floating) ────────────────── */}
      <motion.div
        ref={secondaryRef}
        className={styles.secondaryWrapper}
        initial={{ opacity: 0, x: 40, y: 40 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <div className={styles.secondaryImageClip}>
          <img
            src={SECONDARY_IMAGE.src}
            alt={SECONDARY_IMAGE.alt}
            className={styles.secondaryImage}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.imageOverlay} aria-hidden="true" />

          {/* Neon border */}
          <div className={styles.neonBorder} aria-hidden="true" />
        </div>
      </motion.div>

      {/* ── ACCENT IMAGE (small floating) ─────────────── */}
      <motion.div
        className={styles.accentWrapper}
        initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
        animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{
          duration: 0.7,
          delay: 0.75,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <div className={styles.accentImageClip}>
          <img
            src={ACCENT_IMAGE.src}
            alt={ACCENT_IMAGE.alt}
            className={styles.accentImage}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.imageOverlay} aria-hidden="true" />
        </div>
      </motion.div>

      {/* ── FLOATING NEON ORBS ────────────────────────── */}
      <div
        className={`${styles.neonOrb} ${styles.orbOne}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.neonOrb} ${styles.orbTwo}`}
        aria-hidden="true"
      />
    </div>
  );
};

export default AboutImage;
